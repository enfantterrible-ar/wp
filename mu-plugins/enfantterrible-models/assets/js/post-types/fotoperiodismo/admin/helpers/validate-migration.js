// helpers/validate-migration.js
/**
 * Migration validation utilities
 * Works alongside existing validate.js to check if migration was completed correctly
 * by comparing current data with what transforms would produce from legacy data.
 */

import { validateObjectShape } from './validate';
import { transformAuthorsMeta, transformGalleryMeta } from './transforms';

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
 * Utility to compare arrays ignoring order
 */
function arraysEqual(arr1, arr2) {
	if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
	if (arr1.length !== arr2.length) return false;

	const sorted1 = [...arr1].sort();
	const sorted2 = [...arr2].sort();

	return sorted1.every((item, index) => item === sorted2[index]);
}

/**
 * Check if post has legacy data that needs migration
 * Safely handles undefined/null meta
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
 * Compare gallery data with what transforms would produce
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

	try {
		const expectedGallery = await transformGalleryMeta(legacyGallery);
		const currentIds = currentGallery.images.map((img) => img.id);
		const expectedIds = expectedGallery.images.map((img) => img.id);

		return arraysEqual(currentIds, expectedIds);
	} catch (error) {
		return false;
	}
}

/**
 * Compare authors data with what transforms would produce
 */
function validateAuthorsMigration(meta) {
	const legacyAuthors = meta._crb_enfantterrible_fotoperiodismo_authors || [];
	const currentAuthors = meta.et_models_fotoperiodismo_authors || [];

	// No legacy authors = nothing to validate
	if (!Array.isArray(legacyAuthors) || legacyAuthors.length === 0) {
		return true;
	}

	// Should have matching author count
	if (!Array.isArray(currentAuthors) || currentAuthors.length !== legacyAuthors.length) {
		return false;
	}

	try {
		const expectedAuthors = transformAuthorsMeta(legacyAuthors);

		// Compare author names (basic check)
		const currentNames = currentAuthors.map((a) => (a.name || '').trim().toLowerCase()).sort();
		const expectedNames = expectedAuthors
			.map((a) => (a.name || '').trim().toLowerCase())
			.sort();

		return arraysEqual(currentNames, expectedNames);
	} catch (error) {
		return false;
	}
}

/**
 * Compare descriptions with legacy data
 */
function validateDescriptionsMigration(meta) {
	const legacyShort = meta._crb_enfantterrible_fotoperiodismo_desc_short || '';
	const legacyLong = meta._crb_enfantterrible_fotoperiodismo_desc_long || '';

	const currentShort = meta.et_models_fotoperiodismo_desc_short || '';
	const currentLong = meta.et_models_fotoperiodismo_desc_long || '';

	return legacyShort === currentShort && legacyLong === currentLong;
}

/**
 * Main migration validation function
 * Checks if migration was completed correctly by comparing current data
 * with what transforms would produce from legacy data
 *
 * Uses existing validateObjectShape() for structure validation
 */
export async function validateMigration(meta) {
	// No legacy data = no migration needed
	if (!hasLegacyData(meta)) {
		return MIGRATION_STATUS.NO_LEGACY;
	}

	// Use existing shape validation first
	if (!validateObjectShape(meta)) {
		return MIGRATION_STATUS.INCOMPLETE;
	}

	try {
		// Check if migrated data matches expected transforms
		const [galleryValid, authorsValid, descriptionsValid] = await Promise.all([
			validateGalleryMigration(meta),
			validateAuthorsMigration(meta),
			validateDescriptionsMigration(meta),
		]);

		if (galleryValid && authorsValid && descriptionsValid) {
			return MIGRATION_STATUS.VALID;
		}
		return MIGRATION_STATUS.INVALID;
	} catch (error) {
		return MIGRATION_STATUS.INVALID;
	}
}

/**
 * Simple boolean check for UI - integrates with your existing logic
 * Returns true if migration is valid or not needed
 */
export async function isMigrationComplete(meta) {
	const status = await validateMigration(meta);
	return status === MIGRATION_STATUS.VALID || status === MIGRATION_STATUS.NO_LEGACY;
}

/**
 * Synchronous fallback that just uses your existing validateObjectShape
 * Use this in the main data mapping, then enhance async if needed
 * Handles cases where meta might be undefined or posts are still loading
 */
export function getMigrationStatusSync(meta) {
	// Handle undefined/null meta (posts still loading, context issues, etc.)
	if (!meta || typeof meta !== 'object') {
		return { migrated: false, status: 'loading', message: 'Loading...' };
	}

	// Quick checks that don't require async operations
	if (!hasLegacyData(meta)) {
		return { migrated: true, status: 'no_legacy', message: 'No migration needed' };
	}

	if (!validateObjectShape(meta)) {
		return { migrated: false, status: 'incomplete', message: 'Not migrated' };
	}

	// For posts with both legacy and new structure, we need async validation
	// Return a "pending" state that can be enhanced later
	return { migrated: true, status: 'pending', message: 'Checking...' };
}

/**
 * Detailed migration info for debugging
 */
export async function getMigrationInfo(meta) {
	const status = await validateMigration(meta);
	const message = MIGRATION_MESSAGES[status];
	const info = {
		status,
		message,
		hasLegacyData: hasLegacyData(meta),
		hasValidStructure: validateObjectShape(meta),
		timestamp: new Date().toISOString(),
	};

	// Add detailed breakdown if needed
	if (status === MIGRATION_STATUS.INVALID) {
		try {
			const [galleryValid, authorsValid, descriptionsValid] = await Promise.all([
				validateGalleryMigration(meta),
				validateAuthorsMigration(meta),
				validateDescriptionsMigration(meta),
			]);

			info.details = {
				gallery: galleryValid,
				authors: authorsValid,
				descriptions: descriptionsValid,
			};
		} catch (error) {
			info.error = error.message;
		}
	}

	return info;
}
