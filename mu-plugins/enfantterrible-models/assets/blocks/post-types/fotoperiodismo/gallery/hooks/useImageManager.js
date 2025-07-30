// hooks/useImageManager.js
import { useCallback } from '@wordpress/element';
import useNotices from './useNotices';

/**
 * @typedef {import('../config').GalleryState} GalleryState
 * @typedef {import('../hooks/useLayoutManager').LayoutManager} LayoutManager
 */

/**
 * Describes the shape of the image manager object returned by the hook.
 *
 * @typedef {object} ImageManager
 * @property {(images: Array) => void} selectImages - Adds and processes new images
 * @property {(imageKey: string) => void} removeImage - Removes an image by key
 */

/**
 * Alias for the return type of the useImageManager hook.
 *
 * @typedef {ImageManager} UseImageManagerReturn
 */

/**
 * Manages gallery image operations including adding, removing, and transforming images.
 * Handles image deduplication, validation, and coordinates with layout management.
 *
 * @param {object} config - Configuration object
 * @param {GalleryState['images']} config.images - Current gallery images array
 * @param {(partialState: Partial<GalleryState>) => void} config.updateGallery - Gallery state update function
 * @param {LayoutManager} config.layoutManager - Layout manager instance
 *
 * @returns {UseImageManagerReturn}
 *
 * @example
 * const imageManager = useImageManager({ images, updateGallery, layoutManager });
 * imageManager.selectImages(newImages);
 */
const useImageManager = ({ images, updateGallery, layoutManager }) => {
	const { generateLayouts, removeFromLayouts } = layoutManager;
	const { showNotice } = useNotices();

	/**
	 * Adds new images to the gallery and generates corresponding layouts
	 * @param {Array} newImageData - Array of new image objects to add
	 * @returns {void}
	 */
	const addImages = useCallback(
		(newImageData) => {
			if (!Array.isArray(newImageData) || newImageData.length === 0) {
				return;
			}

			const newImages = [...images, ...newImageData];
			const newLayouts = generateLayouts(newImageData, images);

			updateGallery({
				images: newImages,
				layouts: newLayouts,
			});
		},
		[images, generateLayouts, updateGallery],
	);

	/**
	 * Removes an image from the gallery by its key
	 * @param {string} imageKey - Unique identifier of the image to remove
	 * @returns {void}
	 */
	const removeImage = useCallback(
		(imageKey) => {
			const newImages = images.filter((img) => img.key !== imageKey);
			const newLayouts = removeFromLayouts(imageKey);

			updateGallery({
				images: newImages,
				layouts: newLayouts,
			});
		},
		[images, removeFromLayouts, updateGallery],
	);

	/**
	 * Normalizes raw image data into consistent gallery image format
	 * @param {object} imageData - Raw image data object
	 * @returns {object | null} Normalized image object or null if invalid
	 */
	const transformImageData = useCallback(
		(imageData) => {
			if (!imageData || typeof imageData !== 'object') {
				showNotice('error', 'Datos de imagen no válidos');
				return null;
			}

			return {
				key: String(imageData.id),
				id: imageData.id,
				url: imageData.source_url || imageData.url || '',
				alt: imageData.alt_text || imageData.alt || '',
				title: imageData.title?.rendered || imageData.title || '',
				size: {
					width: imageData.width,
					height: imageData.height,
				},
			};
		},
		[showNotice],
	);

	/**
	 * Filters out images that already exist in the gallery
	 * @param {Array} selectedImages - Array of candidate images
	 * @returns {Array} Filtered array with only new images
	 */
	const dedupeImages = useCallback(
		(selectedImages) => {
			const existingImageIds = new Set(images.map((img) => img.id));
			return selectedImages.filter((img) => !existingImageIds.has(img.id));
		},
		[images],
	);

	/**
	 * Checks if any images in the selection already exist in gallery
	 * @param {Array} selectedImages - Array of candidate images
	 * @returns {boolean} True if duplicates exist
	 */
	const hasDuplicatedImages = useCallback(
		(selectedImages) => {
			const existingImageIds = new Set(images.map((img) => img.id));
			return selectedImages.some((img) => existingImageIds.has(img.id));
		},
		[images],
	);

	/**
	 * Validates and prepares images for addition to gallery
	 * @param {Array} selectedImages - Raw image data to process
	 * @returns {Array} Prepared images ready for addition
	 */
	const prepareImages = useCallback(
		(selectedImages) => {
			if (!Array.isArray(selectedImages) || selectedImages.length === 0) {
				return [];
			}

			const isReady = (image) => {
				return image.id && image.url && !image.url.startsWith('blob:');
			};

			if (!selectedImages.every(isReady)) {
				return [];
			}

			const formattedImages = selectedImages
				.map(transformImageData)
				.filter((img) => img !== null);

			if (formattedImages.length === 0) {
				return [];
			}

			let imagesToAdd = formattedImages;

			if (hasDuplicatedImages(formattedImages)) {
				showNotice('warning', 'Algunas imágenes ya existen y fueron omitidas.');
				imagesToAdd = dedupeImages(formattedImages);
			}

			return imagesToAdd;
		},
		[transformImageData, hasDuplicatedImages, dedupeImages, showNotice],
	);

	/**
	 * Main method to add new images to gallery after processing
	 * @param {Array} selectedImages - Raw image data to add
	 * @returns {void}
	 */
	const selectImages = useCallback(
		(selectedImages) => {
			const imagesToAdd = prepareImages(selectedImages);
			if (imagesToAdd.length > 0) {
				addImages(imagesToAdd);
			}
		},
		[addImages, prepareImages],
	);

	return {
		selectImages,
		removeImage,
	};
};

export default useImageManager;
