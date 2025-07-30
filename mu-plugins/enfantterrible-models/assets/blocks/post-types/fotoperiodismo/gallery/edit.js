import { useBlockProps } from '@wordpress/block-editor';
import { WPElement } from '@wordpress/element';
import { MediaUpload, Grid, DropZone, EmptyState } from './components';
import { useGalleryManagers } from './hooks';

/**
 * @typedef {import('./hooks/useLayoutManager').LayoutManager} LayoutManager
 * @typedef {import('./hooks/useImageManager').ImageManager} ImageManager
 */
/**
 * The main editor component for the gallery block.
 *
 * Handles the block's edit interface including:
 * - Media upload functionality
 * - Gallery layout management
 * - Responsive width measurement
 * - Empty state handling
 *
 * @returns {WPElement} The block editor interface
 *
 * @example
 * // Register the block
 * registerBlockType('my-namespace/gallery', {
 *   edit: BlockEdit,
 *   // ...other block settings
 * });
 */
export const BlockEdit = () => {
	/** @type {import('@wordpress/block-editor').BlockProps} */
	const blockProps = useBlockProps();

	/**
	 * Gallery management hooks
	 * @type {object}
	 * @property {Function} measureRef - Ref callback for container measurement
	 * @property {number} measuredWidth - Current container width
	 * @property {Array} images - Current gallery images
	 * @property {object} layouts - Current gallery layouts
	 * @property {LayoutManager} layoutManager - Layout management methods
	 * @property {ImageManager} imageManager - Image management methods
	 */
	const { measureRef, measuredWidth, images, layouts, layoutManager, imageManager } =
		useGalleryManagers();

	return (
		<div {...blockProps} draggable="false">
			<section className="wp-block-enfantterrible-models-gallery__section">
				<header className="wp-block-enfantterrible-models-gallery__header">
					<p>Galería</p>
				</header>
				<MediaUpload onSelectImages={imageManager.selectImages} />
			</section>
			<section
				className="wp-block-enfantterrible-models-gallery__playground"
				ref={measureRef}
			>
				<DropZone onSelectImages={imageManager.selectImages} />
				{images.length === 0 && <EmptyState />}
				{images.length > 0 && (
					<Grid
						width={measuredWidth}
						images={images}
						layouts={layouts}
						onLayoutChange={layoutManager.updateLayouts}
						onBreakpointChange={layoutManager.onBreakpointChange}
						onRemoveImage={imageManager.removeImage}
					/>
				)}
			</section>
		</div>
	);
};
