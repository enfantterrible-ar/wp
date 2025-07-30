// hooks/useGalleryManagers.js
import useGalleryState from './useGalleryState';
import useLayoutManager from './useLayoutManager';
import useImageManager from './useImageManager';
import useResponsiveContainerWidth from './useResponsiveContainerWidth';

/**
 * @typedef {import('./hooks/useLayoutManager').LayoutManager} LayoutManager
 * @typedef {import('./hooks/useImageManager').ImageManager} ImageManager
 * @typedef {import('../config').GalleryState} GalleryState
 */

/**
 * @typedef {object} GalleryManagers
 * @property {() => void} measureRef - Ref callback to measure container width
 * @property {number} measuredWidth - Current width of the gallery container
 * @property {GalleryState['images']} images - Array of all gallery images
 * @property {GalleryState['layouts']} layouts - Current gallery layouts (managed by layoutManager)
 * @property {LayoutManager} layoutManager - Instance with layout management methods
 * @property {ImageManager} imageManager - Instance with image management methods
 */

/**
 * @typedef {GalleryManagers} UseGalleryManagersReturn
 */

/**
 * Main gallery management hook that combines all gallery-related functionality.
 * Coordinates container measurement, gallery state, layout management, and image handling.
 *
 * @returns {UseGalleryManagersReturn} - An object containing gallery managers
 *
 * @example
 * // Basic usage
 * const {
 *   measureRef,
 *   measuredWidth,
 *   images,
 *   layouts,
 *   layoutManager,
 *   imageManager
 * } = useGalleryManagers();
 *
 * @see useGalleryState
 * @see useLayoutManager
 * @see useImageManager
 * @see useResponsiveContainerWidth
 */
const useGalleryManagers = () => {
	const [measuredWidth, measureRef] = useResponsiveContainerWidth();
	const { galleryData, updateGallery } = useGalleryState();
	const { images, layouts } = galleryData;

	const layoutManager = useLayoutManager({
		currentLayouts: layouts,
		images,
		updateGallery,
		measuredWidth,
	});

	const imageManager = useImageManager({
		images,
		updateGallery,
		layoutManager,
	});

	return {
		measureRef,
		measuredWidth,
		images,
		layouts: layoutManager.layouts,
		layoutManager,
		imageManager,
	};
};

export default useGalleryManagers;
