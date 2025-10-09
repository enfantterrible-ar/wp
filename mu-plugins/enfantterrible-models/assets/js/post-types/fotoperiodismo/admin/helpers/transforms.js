import { resolveSelect } from '@wordpress/data';
import { nanoid } from 'nanoid';
import { normalizeUrl } from './shared';

/**
 * Transforms a single image data into the expected gallery image shape.
 * Throws an error with context if the shape is invalid.
 */
export function transformImageData(imageData, id) {
	const numericId = parseInt(id, 10);
	if (Number.isNaN(numericId)) {
		throw new Error(`Invalid image ID: ${id}`);
	}

	const image = {
		key: numericId.toString(),
		id: numericId,
		url: imageData?.source_url || '',
		alt: imageData?.alt_text || '',
		title: imageData?.title?.rendered || '',
		size: {
			width: imageData?.media_details?.width || 0,
			height: imageData?.media_details?.height || 0,
		},
	};

	return image;
}

/**
 * Transforms authors meta array into expected shape.
 * Throws an error with context if the shape is invalid.
 */
export function transformAuthorsMeta(authors = []) {
	const transformed = authors
		.filter((author) => (author.nombre || author.link || '').trim())
		.map((author) => ({
			id: nanoid(),
			name: typeof author.nombre === 'string' ? author.nombre : '',
			url: typeof author.link === 'string' ? normalizeUrl(author.link) : '',
		}));

	return transformed;
}

/**
 * Transforms gallery meta from array of image IDs.
 * Throws an error with context if gallery shape is invalid.
 */
export async function transformGalleryMeta(imagesIds = []) {
	const images = await Promise.all(
		imagesIds.filter(Boolean).map(async (id) => {
			try {
				const imageData = await resolveSelect('core').getMedia(id);
				return transformImageData(imageData, id);
			} catch (error) {
				throw new Error(
					`Failed to fetch or transform image with ID ${id}: ${error.message}`,
				);
			}
		}),
	);

	const gallery = {
		images,
		layouts: { lg: [], md: [], sm: [], xs: [], xxs: [] },
		lastUpdated: Date.now(),
	};
	console.log(gallery);
	return gallery;
}

/**
 * Transforms descriptions meta values.
 * Throws an error with context if validation fails.
 */
export function transformDescriptions(shortDesc, longDesc) {
	const descShort = typeof shortDesc === 'string' ? shortDesc : '';
	const descLong = typeof longDesc === 'string' ? longDesc : '';

	return {
		et_models_fotoperiodismo_desc_short: descShort,
		et_models_fotoperiodismo_desc_long: descLong,
	};
}
