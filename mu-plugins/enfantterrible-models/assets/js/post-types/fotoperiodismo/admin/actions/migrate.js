import { resolveSelect, dispatch } from '@wordpress/data';
import { transformAuthorsMeta, transformGalleryMeta } from '../helpers/transforms';
import { validateObjectShape } from '../helpers/validate';
import { getTemplateContent } from '../helpers/templates';

/**
 * Retrieves a post entity record from the WP core store, along with its meta data.
 * If the post has no meta data, returns null.
 *
 * @param {object} item - A post item object with an id property.
 * @returns {Promise<object|null>} A promise that resolves to a post entity record with meta data, or null if no meta data exists.
 */
async function getPostWithMeta(item) {
	const post = await resolveSelect('core').getEntityRecord('postType', 'fotoperiodismo', item.id);
	return post?.meta ? post : null;
}

/**
 * Transforms legacy meta data into the new structure expected by the "fotoperiodismo" post type.
 * This function takes the legacy meta data as an argument, and returns a new object with the transformed data.
 *
 * The returned object will have the following properties:
 * - et_models_fotoperiodismo_authors: The transformed authors data.
 * - et_models_fotoperiodismo_desc_long: The transformed description (long version).
 * - et_models_fotoperiodismo_desc_short: The transformed description (short version).
 * - et_models_fotoperiodismo_images: The transformed gallery data.
 *
 * @param {object} meta - The legacy meta data to transform.
 * @returns {Promise<object>} A promise that resolves to an object with the transformed data.
 */
async function getTransformedMeta(meta) {
	const [galleryData, authorsData] = await Promise.all([
		transformGalleryMeta(meta._crb_enfantterrible_fotoperiodismo_gallery),
		transformAuthorsMeta(meta._crb_enfantterrible_fotoperiodismo_authors),
	]);

	return {
		...meta,
		et_models_fotoperiodismo_authors: authorsData,
		et_models_fotoperiodismo_desc_long: meta._crb_enfantterrible_fotoperiodismo_desc_long || '',
		et_models_fotoperiodismo_desc_short:
			meta._crb_enfantterrible_fotoperiodismo_desc_short || '',
		et_models_fotoperiodismo_images: galleryData,
	};
}

/**
 * Validates that the transformed meta data matches the expected shape.
 * Throws an error with context if the shape is invalid.
 * @param {object} meta - The transformed meta data
 * @returns {Promise<object>} The validated meta data
 */
async function validateTransformedMeta(meta) {
	if (!validateObjectShape(meta)) {
		throw new Error(`Meta shape validation failed. Data: ${JSON.stringify(meta)}`);
	}
	return meta;
}

/**
 * Migrates a list of post items from legacy data to new data structure.
 * @param {Array} items - List of post items to migrate.
 * @returns {Promise<Array>} Promise that resolves to an array of objects with the following properties:
 * - id: The ID of the post item.
 * - success: A boolean indicating whether the migration was successful.
 * - updatedPost: The updated post entity record, if successful.
 * - error: An error message, if the migration failed.
 */
async function migratePosts(items) {
	console.log('migratePosts - starting with items:', items);

	const promises = items.map(async (item) => {
		try {
			const post = await getPostWithMeta(item);
			if (!post) {
				return { id: item.id, error: 'Post not found' };
			}

			// Transform + validate meta
			const transformedMeta = await getTransformedMeta(post.meta);
			const validatedMeta = await validateTransformedMeta(transformedMeta);

			// Get template content (cached by postType)
			const templateContent = await getTemplateContent(item.type);
			if (!templateContent) {
				throw new Error(`Template not found for post type ${item.type}`);
			}

			// Save both meta + content in a single entity update
			const updatedPost = await dispatch('core').saveEntityRecord(
				'postType',
				'fotoperiodismo',
				{
					id: item.id,
					meta: validatedMeta,
					content: templateContent,
				},
			);

			return { id: item.id, success: true, updatedPost };
		} catch (error) {
			console.error(`Error migrating item ${item.id}:`, error);
			return { id: item.id, error: error.message };
		}
	});

	const results = await Promise.all(promises);
	console.log('migratePosts - final results:', results);
	return results;
}

export const migrate = {
	id: 'migrate',
	label: 'Migrate Selected',
	supportsBulk: true,
	icon: 'update',
	isPrimary: true,
	callback: async (items, { onActionPerformed }) => {
		const results = await migratePosts(items);
		if (onActionPerformed) onActionPerformed(results);
	},
};
