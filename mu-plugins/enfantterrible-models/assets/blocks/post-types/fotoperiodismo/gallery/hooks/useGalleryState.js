// hooks/useGalleryState.js
import { useCallback, useRef } from '@wordpress/element';
import { usePostMetaValue } from '@10up/block-components';
import { META_FIELD, DEFAULT_GALLERY_STATE } from '../config';
import useNotices from './useNotices';

/**
 * @typedef {import('../config').GalleryState} GalleryState
 */

/**
 * @typedef {object} UseGalleryStateReturn
 * @property {GalleryState} galleryData - Current gallery state (images, layouts, lastUpdated)
 * @property {(partialState: Partial<GalleryState>) => void} updateGallery - Stable updater function merging partial updates into galleryData
 */

/**
 * Manages gallery state including post meta updates and error handling.
 * Provides a stable update function that automatically merges updates with current state.
 *
 *
 * @example
 * // Basic usage
 * const { galleryData, updateGallery } = useGalleryState();
 *
 * // Updating state
 * updateGallery({ images: newImagesArray });
 *
 * @see usePostMetaValue - For the underlying post meta management
 * @see useNotices - For error notification handling
 *
 * @description
 * Implementation notes:
 * - Uses a ref to track current state internally
 * - Automatically adds a timestamp to updates
 * - Validates and normalizes image array input
 * - Provides a stable update function safe for use in dependency arrays
 * - Triggers notices for error conditions
 *
 * @returns {UseGalleryStateReturn}
 */
const useGalleryState = () => {
	const [galleryData, setGalleryData] = usePostMetaValue(META_FIELD, DEFAULT_GALLERY_STATE);
	// Use a ref to always get the current galleryData without depending on it
	// This makes updateGallery stable without needing galleryData in its deps
	const galleryDataRef = useRef(galleryData);
	galleryDataRef.current = galleryData; // Keep ref updated with latest state

	const { showNotice } = useNotices();

	/**
	 * Merges updates with current gallery state and handles errors.
	 *
	 * Note: This function will:
	 * - Modify the post meta value through setGalleryData
	 * - Potentially show error notices through the notices system
	 * - Always add a lastUpdated timestamp
	 * - Preserve existing state for any properties not being updated
	 *
	 * @param {object} updates - Partial state update. Will be merged with current state.
	 * @param {Array} [updates.images] - New images array (will be validated)
	 * @param {object} [updates.layouts] - New layouts configuration
	 *
	 * @example
	 * // Update just images
	 * updateGallery({ images: newImages });
	 *
	 * @throws Will display error notice (but not throw) if images are invalid
	 * @see useNotices.showNotice Used for error notifications
	 */
	const updateGallery = useCallback(
		(updates) => {
			// This updateGallery will now ALWAYS expect a plain object (not a function).
			// Call sites (like useLayoutManager) must evaluate functional updates beforehand.

			const normalizedUpdates = {
				...updates,
				lastUpdated: Date.now(),
			};

			if (normalizedUpdates.images && !Array.isArray(normalizedUpdates.images)) {
				showNotice(
					'error',
					'Hubo un problema al actualizar tu galería. Inténtalo de nuevo o recarga la página.',
				);
				// Revert to original images or an empty array to prevent further errors
				normalizedUpdates.images = galleryDataRef.current?.images || [];
			}

			// Use the ref to get current data for merging, ensuring we base on the latest.
			const newState = {
				...galleryDataRef.current, // Get the latest state via ref
				...normalizedUpdates,
			};

			setGalleryData(newState); // Pass a plain object to the external setter
		},
		[setGalleryData, showNotice], // Only depend on setGalleryData, which is stable.
		// galleryDataRef.current ensures access to latest galleryData without adding it here.
	);

	return {
		galleryData,
		updateGallery,
	};
};

export default useGalleryState;
