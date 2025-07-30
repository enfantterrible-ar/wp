// components/GridTile.js
import { forwardRef, WPElement, Ref } from '@wordpress/element'; // Import forwardRef from @wordpress/element
import { Icon, trash } from '@wordpress/icons';

/**
 * @typedef {import('../config').GalleryImage} GalleryImage
 */

/**
 * @typedef {import('react').CSSProperties} CSSProperties
 * @typedef {import('react').MouseEventHandler} MouseEventHandler
 * @typedef {import('react').TouchEventHandler} TouchEventHandler
 */

/**
 * @typedef {object} GridImage
 * @property {string} url - Image source URL
 * @property {string} alt - Image alt text
 * @property {string} key - Unique identifier for the image
 */

/**
 * @typedef {object} GridTileProps
 * @property {GalleryImage} image - Image data to display (now includes all properties)
 * @property {(key: string) => void} onRemoveImage - Called when remove button is clicked
 * @property {CSSProperties} [style] - Custom styles for the tile container
 * @property {string} [className] - Additional class names for the tile
 * @property {MouseEventHandler} [onMouseDown] - Mouse down handler
 * @property {MouseEventHandler} [onMouseUp] - Mouse up handler
 * @property {TouchEventHandler} [onTouchEnd] - Touch end handler
 * @property {WPElement} [children] - Child elements (typically resize handles)
 */

/**
 * A single tile in the image grid with interactive controls
 *
 * Features:
 * - Displays an image with alt text
 * - Includes a remove button with trash icon
 * - Supports resize handles via children
 * - Forwards ref to container element
 * - Handles mouse/touch events for interaction
 *
 * @param {GridTileProps} props - Component properties
 * @param {Ref<HTMLDivElement>} ref - Forwarded ref to tile container
 * @returns {WPElement} Image tile with controls
 *
 * @example
 * <GridTile
 *   image={{ url: 'image.jpg', alt: 'Description', key: '1' }}
 *   onRemoveImage={(key) => console.log('Remove:', key)}
 *   style={{ backgroundColor: '#eee' }}
 * >
 *   <ResizeHandle />
 * </GridTile>
 */
const GridTile = forwardRef(
	(
		{
			image,
			onRemoveImage,
			style,
			className,
			onMouseDown,
			onMouseUp,
			onTouchEnd,
			children,
			...props
		},
		ref,
	) => {
		const { url, alt, key: imageKey } = image;

		return (
			<div
				className={`wp-block-enfantterrible-models-gallery__item grid-gallery-item ${className || ''}`}
				role="gridcell"
				aria-label="Grid cell"
				tabIndex={0}
				style={style}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onTouchEnd={onTouchEnd}
				ref={ref}
				{...props} // Spread any other props that react-grid-layout passes
			>
				<button
					type="button"
					className="wp-block-enfantterrible-models-gallery__item-remove-image"
					onClick={() => onRemoveImage(imageKey)}
				>
					<Icon
						icon={trash}
						size={24}
						className="wp-block-enfantterrible-models-gallery__item-remove-image--icon"
					/>
				</button>
				<img
					src={url}
					alt={alt}
					className="wp-block-enfantterrible-models-gallery__item-image"
				/>
				{children} {/* This is where the resize handles get rendered */}
			</div>
		);
	},
);

// Add display name for debugging
GridTile.displayName = 'GridTile';

export default GridTile;
