/**
 * Migration validation utilities
 * Works alongside existing validate.js to check if migration was completed correctly
 * by comparing current data with what transforms would produce from legacy data.
 */

import { validateObjectShape } from './validate';
import { normalizeUrl } from './shared';
import { getTemplateContent } from './templates';

/**
 * Simple migration status types
 */
export const MIGRATION_STATUS = {
	VALID: 'valid', // Migration completed and data matches
	INVALID: 'invalid', // Migration attempted but data doesn't match
	INCOMPLETE: 'incomplete', // New structure missing or malformed
	NO_LEGACY: 'no_legacy', // No legacy data to migrate
};

export const MIGRATION_MESSAGES = {
	valid: 'Migration complete',
	invalid: 'Invalid migration',
	incomplete: 'Not migrated',
	no_legacy: 'No migration needed',
};

/**
 * Checks if two arrays are equal.
 *
 * Equality is determined by sorting the arrays and checking if every element at the same index is equal.
 *
 * @param {Array} arr1 - First array to compare
 * @param {Array} arr2 - Second array to compare
 * @returns {boolean} True if the arrays are equal, false otherwise
 */
function arraysEqual(arr1, arr2) {
	if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
	if (arr1.length !== arr2.length) return false;

	const sorted1 = [...arr1].sort();
	const sorted2 = [...arr2].sort();

	return sorted1.every((item, index) => item === sorted2[index]);
}

/**
 * Checks if a given meta object has any legacy data that can be migrated.
 *
 * Legacy data is defined as either _crb_enfantterrible_fotoperiodismo_gallery or
 * _crb_enfantterrible_fotoperiodismo_authors array properties.
 *
 * @param {object} meta - Meta object to check for legacy data
 * @returns {boolean} True if meta object has legacy data, false otherwise
 */
function hasLegacyData(meta) {
	if (!meta || typeof meta !== 'object') {
		return false;
	}

	const legacyGallery = meta._crb_enfantterrible_fotoperiodismo_gallery;
	const legacyAuthors = meta._crb_enfantterrible_fotoperiodismo_authors;

	const hasGallery = Array.isArray(legacyGallery) && legacyGallery.length > 0;
	const hasAuthors = Array.isArray(legacyAuthors) && legacyAuthors.length > 0;

	return hasGallery || hasAuthors;
}

/**
 * Extracts image IDs from legacy gallery data.
 *
 * @param {Array} legacyGallery - Legacy gallery data containing image objects or IDs.
 * @returns {Array<number>} An array of image IDs parsed from the legacy data.
 */
function getGalleryIdsFromLegacy(legacyGallery) {
	return legacyGallery.map((item) => parseInt(item.id || item, 10)).filter(Boolean);
}

/**
 * Validates that the gallery data has been migrated correctly
 * by comparing current data with what transforms would produce from legacy data.
 *
 * @param {object} meta - The post meta object
 * @returns {boolean} True if the gallery data has been migrated correctly, false otherwise
 */
async function validateGalleryMigration(meta) {
	const legacyGallery = meta._crb_enfantterrible_fotoperiodismo_gallery || [];
	const currentGallery = meta.et_models_fotoperiodismo_images;

	// No legacy gallery = nothing to validate
	if (!Array.isArray(legacyGallery) || legacyGallery.length === 0) {
		return true;
	}

	// Should have new gallery structure
	if (!currentGallery?.images || !Array.isArray(currentGallery.images)) {
		return false;
	}

	const legacyIds = getGalleryIdsFromLegacy(legacyGallery);
	const currentIds = currentGallery.images.map((img) => img.id);

	return arraysEqual(currentIds, legacyIds);
}

export function getAuthorSignatures(authors) {
	return authors.map((a) => {
		const name = (a.name || a.nombre || '').trim().toLowerCase();
		const url = normalizeUrl(a.url || a.link || '');
		return `${name}|${url}`;
	});
}

export function validateAuthors(legacyAuthors, currentAuthors) {
	const legacySignatures = getAuthorSignatures(legacyAuthors).sort();
	const currentSignatures = getAuthorSignatures(currentAuthors).sort();
	const isValid = arraysEqual(legacySignatures, currentSignatures);

	console.log('Validating authors migration:', { legacySignatures, currentSignatures });

	return {
		legacySignatures,
		currentSignatures,
		status: isValid,
	};
}

/**
 * Validates that the authors have been migrated correctly
 * @param {object} meta - The post meta object
 * @returns {boolean} True if the authors have been migrated correctly, false otherwise
 */
function validateAuthorsMigration(meta) {
	const legacyAuthors = meta._crb_enfantterrible_fotoperiodismo_authors || [];
	const currentAuthors = meta.et_models_fotoperiodismo_authors || [];

	// No legacy authors = nothing to validate
	if (!Array.isArray(legacyAuthors) || legacyAuthors.length === 0) {
		return true;
	}

	const { status } = validateAuthors(
		legacyAuthors.filter((a) => (a.nombre || a.link || '').trim()), // drop empties
		currentAuthors,
	);

	console.log('Validating authors migration:', { legacyAuthors, currentAuthors });

	return status;
}

/**
 * Validates that the descriptions (short and long) have been migrated correctly
 * @param {object} meta - The post meta object
 * @returns {boolean} True if the descriptions have been migrated correctly, false otherwise
 */
function validateDescriptionsMigration(meta) {
	const legacyShort = meta._crb_enfantterrible_fotoperiodismo_desc_short || '';
	const legacyLong = meta._crb_enfantterrible_fotoperiodismo_desc_long || '';

	const currentShort = meta.et_models_fotoperiodismo_desc_short || '';
	const currentLong = meta.et_models_fotoperiodismo_desc_long || '';

	return legacyShort === currentShort && legacyLong === currentLong;
}

/**
 * Validates that a post's meta data has been migrated correctly.
 * Checks that the data exists, matches the expected shape, and has been transformed
 * correctly from legacy data.
 * @param {object} meta - The post's meta data
 * @returns {Promise<object>} A promise that resolves to an object with the following properties:
 * - status: The migration status, one of the following:
 *   - MIGRATION_STATUS.NO_LEGACY: No legacy data to migrate
 *   - MIGRATION_STATUS.INCOMPLETE: New structure missing or malformed
 *   - MIGRATION_STATUS.VALID: Migration complete and data matches expected transforms
 *   - MIGRATION_STATUS.INVALID: Migration attempted but data doesn't match
 * - needsMigration: A boolean indicating whether either the content or meta needs migration
 */
async function validateMetaMigration(meta) {
	// No legacy data = no migration needed
	if (!hasLegacyData(meta)) {
		return {
			status: MIGRATION_STATUS.NO_LEGACY,
			needsMigration: false,
		};
	}

	// Use existing shape validation first
	if (!validateObjectShape(meta)) {
		return {
			status: MIGRATION_STATUS.INCOMPLETE,
			needsMigration: true,
		};
	}

	try {
		// Check if migrated data matches expected transforms
		const [galleryValid, authorsValid, descriptionsValid] = await Promise.all([
			validateGalleryMigration(meta),
			validateAuthorsMigration(meta),
			validateDescriptionsMigration(meta),
		]);

		const allValid = galleryValid && authorsValid && descriptionsValid;

		return {
			status: allValid ? MIGRATION_STATUS.VALID : MIGRATION_STATUS.INVALID,
			needsMigration: !allValid,
		};
	} catch (error) {
		return {
			status: MIGRATION_STATUS.INVALID,
			needsMigration: true,
		};
	}
}

/**
 * Checks if content needs migration by comparing with template
 *
 * @param {object} currentContent - The content object with .raw property
 * @param {string} templateContent - The template content to compare against
 * @returns {boolean} True if content needs migration
 */
function validateContentMigration(currentContent, templateContent) {
	if (!templateContent) return false;
	const current = (currentContent?.raw || '').trim();
	const template = templateContent.trim();
	return current !== template;
}

/**
 * Validates the migration status of a post by checking both meta and content.
 * @param {object} meta - The post's meta data
 * @param {object} content - The post's content object with .raw property
 * @param {string} postType - The post type slug
 * @returns {Promise<object>} A promise that resolves to an object with the following properties:
 * - status: The migration status (one of MIGRATION_STATUS.*)
 * - metaNeedsMigration: A boolean indicating whether the meta needs migration
 * - contentNeedsMigration: A boolean indicating whether the content needs migration
 * - needsMigration: A boolean indicating whether either the content or meta needs migration
 */
export async function validateMigration(meta, content, postType) {
	// Validate meta
	const metaResult = await validateMetaMigration(meta);
	let { status } = metaResult;

	// Check content migration
	const templateContent = await getTemplateContent(postType);
	const contentNeedsMigration = validateContentMigration(content, templateContent);

	// If content needs migration, adjust status
	if (
		contentNeedsMigration &&
		(status === MIGRATION_STATUS.VALID || status === MIGRATION_STATUS.NO_LEGACY)
	) {
		status = MIGRATION_STATUS.INCOMPLETE;
	}

	return {
		status,
		metaNeedsMigration: metaResult.needsMigration,
		contentNeedsMigration,
		needsMigration: metaResult.needsMigration || contentNeedsMigration,
	};
}

/**
 * Checks if a post's migration is complete by validating both meta and content.
 * @param {object} meta - The post's meta data
 * @param {object} content - The post's content object with .raw property
 * @param {string} postType - The post type slug
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the migration is complete
 */
export async function isMigrationComplete(meta, content, postType) {
	const result = await validateMigration(meta, content, postType);
	return !result.needsMigration;
}

/**
 * Retrieves information about the migration status of a post
 * @param {object} meta - The post meta object
 * @param {object} content - The post content object
 * @param {string} postType - The post type slug
 * @returns {Promise<object>} A promise that resolves to an object with the following properties:
 * - status: The migration status (one of MIGRATION_STATUS.*)
 * - message: A human-readable message describing the migration status
 * - needsContentMigration: A boolean indicating whether the content needs migration
 * - needsMetaMigration: A boolean indicating whether the meta needs migration
 * - needsMigration: A boolean indicating whether either the content or meta needs migration
 * - timestamp: A timestamp indicating when the migration information was retrieved
 */
export async function getMigrationInfo(meta, content, postType) {
	const result = await validateMigration(meta, content, postType);

	return {
		status: result.status,
		message: MIGRATION_MESSAGES[result.status],
		needsContentMigration: result.contentNeedsMigration,
		needsMetaMigration: result.metaNeedsMigration,
		needsMigration: result.needsMigration,
		timestamp: new Date().toISOString(),
	};
}
