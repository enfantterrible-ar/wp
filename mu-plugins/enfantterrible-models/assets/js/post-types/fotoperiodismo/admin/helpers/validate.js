/**
 * @file validate.js
 * Validation utilities for the fotoperiodismo model meta fields.
 *
 * This module provides strict and flexible validation functions that verify
 * the shape and types of gallery images, layouts, authors, and descriptions
 * according to the defined REST API schema.
 */

/**
 * Validates if a string is a well-formed HTTPS URL.
 * Optionally allows empty strings.
 *
 * @param {*} value - The value to validate as a URL.
 * @param {boolean} [allowEmpty=false] - If true, empty strings are considered valid.
 * @returns {boolean} True if valid HTTPS URL or allowed empty, false otherwise.
 */
function isUri(value, allowEmpty = false) {
	if (allowEmpty && value === '') return true;
	if (typeof value !== 'string') return false;

	try {
		const url = new URL(value);
		return url.protocol === 'https:';
	} catch {
		return false;
	}
}

function validateImageSize(size) {
	if (typeof size !== 'object' || size === null) return false;
	const { width, height } = size;
	return Number.isInteger(width) && Number.isInteger(height);
}

function validateImage(image) {
	if (typeof image !== 'object' || image === null) return false;

	const requiredProps = ['key', 'url', 'alt', 'title', 'id', 'size'];

	if (!requiredProps.every((p) => Object.prototype.hasOwnProperty.call(image, p))) return false;

	if (
		typeof image.key !== 'string' ||
		!isUri(image.url) ||
		typeof image.alt !== 'string' ||
		typeof image.title !== 'string' ||
		!Number.isInteger(image.id) ||
		!validateImageSize(image.size)
	) {
		return false;
	}

	return true;
}

function validateLayouts(layouts) {
	if (typeof layouts !== 'object' || layouts === null) return false;

	const breakpoints = ['lg', 'md', 'sm', 'xs', 'xxs'];

	for (const bp of breakpoints) {
		if (!Array.isArray(layouts[bp])) return false;

		for (const layoutItem of layouts[bp]) {
			if (typeof layoutItem !== 'object' || layoutItem === null) return false;

			const requiredProps = ['i', 'x', 'y', 'w', 'h'];

			if (!requiredProps.every((p) => Object.prototype.hasOwnProperty.call(layoutItem, p))) {
				return false;
			}

			if (
				typeof layoutItem.i !== 'string' ||
				!Number.isInteger(layoutItem.x) ||
				!Number.isInteger(layoutItem.y) ||
				!Number.isInteger(layoutItem.w) ||
				!Number.isInteger(layoutItem.h)
			) {
				return false;
			}

			if (
				('minW' in layoutItem && !Number.isInteger(layoutItem.minW)) ||
				('minH' in layoutItem && !Number.isInteger(layoutItem.minH)) ||
				('maxW' in layoutItem && !Number.isInteger(layoutItem.maxW)) ||
				('maxH' in layoutItem && !Number.isInteger(layoutItem.maxH)) ||
				('static' in layoutItem && typeof layoutItem.static !== 'boolean') ||
				('moved' in layoutItem && typeof layoutItem.moved !== 'boolean')
			) {
				return false;
			}
		}
	}

	return true;
}

function validateGallery(gallery) {
	if (typeof gallery !== 'object' || gallery === null) return false;

	if (!Array.isArray(gallery.images)) return false;

	if (!gallery.images.every(validateImage)) return false;

	if (!validateLayouts(gallery.layouts)) return false;

	if (!(gallery.lastUpdated === null || Number.isInteger(gallery.lastUpdated))) return false;

	return true;
}

function validateAuthor(author) {
	if (typeof author !== 'object' || author === null) return false;

	const requiredProps = ['id', 'name', 'url'];
	if (!requiredProps.every((p) => Object.prototype.hasOwnProperty.call(author, p))) return false;

	if (
		typeof author.id !== 'string' ||
		typeof author.name !== 'string' ||
		!isUri(author.url, true)
	) {
		return false;
	}

	return true;
}

function validateAuthors(authors) {
	if (!Array.isArray(authors)) return false;

	return authors.every(validateAuthor);
}

function validateDescriptions(descShort, descLong) {
	return typeof descShort === 'string' && typeof descLong === 'string';
}

function validateObjectShape(obj) {
	if (typeof obj !== 'object' || obj === null) return false;

	const requiredKeys = [
		'et_models_fotoperiodismo_images',
		'et_models_fotoperiodismo_desc_short',
		'et_models_fotoperiodismo_desc_long',
		'et_models_fotoperiodismo_authors',
	];

	if (!requiredKeys.every((key) => Object.prototype.hasOwnProperty.call(obj, key))) {
		return false;
	}

	if (!validateGallery(obj.et_models_fotoperiodismo_images)) return false;

	if (
		!validateDescriptions(
			obj.et_models_fotoperiodismo_desc_short,
			obj.et_models_fotoperiodismo_desc_long,
		)
	) {
		return false;
	}

	if (!validateAuthors(obj.et_models_fotoperiodismo_authors)) return false;

	return true;
}

function validateSpecificShape(obj, options = {}) {
	const {
		checkImages = true,
		checkAuthors = true,
		checkDescriptions = true,
		strictImageValidation = true,
	} = options;

	if (typeof obj !== 'object' || obj === null) return false;

	const requiredKeys = [
		'et_models_fotoperiodismo_images',
		'et_models_fotoperiodismo_desc_short',
		'et_models_fotoperiodismo_desc_long',
		'et_models_fotoperiodismo_authors',
	];

	if (!requiredKeys.every((key) => Object.prototype.hasOwnProperty.call(obj, key))) {
		return false;
	}

	if (checkImages) {
		const images = obj.et_models_fotoperiodismo_images;
		if (!images || !Array.isArray(images.images) || !images.layouts) return false;

		if (strictImageValidation && !validateGallery(images)) return false;
	}

	if (checkAuthors && !validateAuthors(obj.et_models_fotoperiodismo_authors)) return false;

	if (
		checkDescriptions &&
		!validateDescriptions(
			obj.et_models_fotoperiodismo_desc_short,
			obj.et_models_fotoperiodismo_desc_long,
		)
	) {
		return false;
	}

	return true;
}

export {
	validateObjectShape,
	validateSpecificShape,
	validateGallery,
	validateImage,
	validateLayouts,
	validateAuthor,
	validateAuthors,
	validateDescriptions,
};
