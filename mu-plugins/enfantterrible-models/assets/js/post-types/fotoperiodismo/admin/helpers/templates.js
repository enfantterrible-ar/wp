import apiFetch from '@wordpress/api-fetch';

// Shared cache for template content
const templateCache = new Map();

/**
 * Fetches template content for a given post type.
 * Uses an in-memory cache to avoid repeated API calls.
 *
 * @param {string} postType - The post type to fetch template for
 * @returns {Promise<string|null>} The serialized block content or null
 */
export async function getTemplateContent(postType) {
	if (templateCache.has(postType)) {
		return templateCache.get(postType);
	}

	try {
		const data = await apiFetch({
			path: `/enfantterrible-models/v1/templates/${postType}`,
			method: 'GET',
		});
		const serialized = data?.serialized || null;
		templateCache.set(postType, serialized);
		return serialized;
	} catch (error) {
		console.error(`Error fetching template for ${postType}:`, error);
		return null;
	}
}
