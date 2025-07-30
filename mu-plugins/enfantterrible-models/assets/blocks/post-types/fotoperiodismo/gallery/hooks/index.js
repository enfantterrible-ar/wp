// hooks/index.js

/**
 * Gallery Hooks Module
 *
 * A collection of custom hooks for managing gallery state and behavior.
 *
 * @module GalleryHooks
 *
 * @property {Function} useGalleryManagers - Main gallery management hook
 * @property {Function} useGalleryState - Gallery state management hook
 * @property {Function} useImageManager - Image operations hook
 * @property {Function} useLayoutManager - Layout management hook
 * @property {Function} useResponsiveContainerWidth - Responsive width measurement hook
 * @property {Function} useNotices - Notification system hook
 *
 * @example
 * // Import all hooks
 * import { useGalleryManagers, useGalleryState } from './hooks';
 *
 * @example
 * // Import specific hook
 * import { useResponsiveContainerWidth } from './hooks';
 */

import useGalleryManagers from './useGalleryManagers';
import useResponsiveContainerWidth from './useResponsiveContainerWidth';
import useGalleryState from './useGalleryState';
import useImageManager from './useImageManager';
import useLayoutManager from './useLayoutManager';
import useNotices from './useNotices';

export {
	useGalleryManagers,
	useGalleryState,
	useImageManager,
	useLayoutManager,
	useResponsiveContainerWidth,
	useNotices,
};
