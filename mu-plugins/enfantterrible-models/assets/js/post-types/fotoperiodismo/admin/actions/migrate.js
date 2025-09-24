import { resolveSelect, dispatch } from '@wordpress/data';
import { transformAuthorsMeta, transformGalleryMeta } from '../helpers/transforms';
import { validateObjectShape } from '../helpers/validate';

async function getPostWithMeta(item) {
	const post = await resolveSelect('core').getEntityRecord('postType', 'fotoperiodismo', item.id);
	return post?.meta ? post : null;
}

async function savePostMeta(item, meta) {
	console.log(item);
	// return dispatch('core').saveEntityRecord('postType', 'fotoperiodismo', {
	// 	...item,
	// 	meta,
	// });
}

async function validateTransformedMeta(meta) {
	const shapeValid = validateObjectShape(meta);
	if (!shapeValid) {
		throw new Error(`Meta shape validation failed. Data: ${JSON.stringify(meta)}`);
	}

	return meta;
}

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

async function migrateMeta(items) {
	console.log('migrateMeta - starting with items:', items);

	const promises = items.map(async (item) => {
		console.log(`Processing item ${item.id}`);

		const post = await getPostWithMeta(item);
		if (!post) {
			console.log(`No post found for item ${item.id}`);
			return { id: item.id, error: 'Post not found' };
		}

		try {
			const transformedMeta = await getTransformedMeta(post.meta);
			const validatedMeta = await validateTransformedMeta(transformedMeta);
			if (!validatedMeta) {
				throw new Error('Invalid transformed meta');
			}
			console.log(`Transformed meta for ${item.id}:`, validatedMeta);

			// Uncomment when ready to save
			const saveResult = await savePostMeta(item, transformedMeta);
			return saveResult;
		} catch (error) {
			console.error(`Error processing item ${item.id}:`, error);
			return { id: item.id, error: error.message };
		}
	});

	const results = await Promise.all(promises);
	console.log('migrateMeta - final results:', results);
	return results;
}

export const migrate = {
	id: 'migrate',
	label: 'Migrate Selected',
	supportsBulk: true,
	icon: 'update',
	isPrimary: true,
	callback: async (items, { onActionPerformed }) => {
		const migrated = await migrateMeta(items);
		console.log(migrated);
		if (onActionPerformed) {
			onActionPerformed(migrated);
		}
	},
};
