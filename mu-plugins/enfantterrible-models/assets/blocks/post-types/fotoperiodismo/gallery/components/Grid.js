// components/Grid.js
import { Responsive } from 'react-grid-layout';
import { WPElement } from '@wordpress/element';
import GridTile from './GridTile';
import { GRID_CONFIG, LAYOUT_CONSTANTS } from '../config';

/**
 * @typedef {import('../config').GalleryImage} GalleryImage
 * @typedef {import('../config').LayoutItem} LayoutItem
 * @typedef {import('../config').LayoutsByBreakpoint} LayoutsByBreakpoint
 */

/**
 * @typedef {object} GridProps
 * @property {number} width - The current container width in pixels
 * @property {GalleryImage[]} images - Array of image data to display
 * @property {LayoutsByBreakpoint} layouts - Layout data keyed by breakpoint
 * @property {(layouts: LayoutItem[], allLayouts: LayoutsByBreakpoint) => void} onLayoutChange - Callback when layout updates
 * @property {(key: string) => void} onRemoveImage - Callback to remove an image by its unique key
 * @property {(breakpoint: string, cols: number) => void} onBreakpointChange - Callback when breakpoint changes
 */

/**
 * Responsive image grid using react-grid-layout.
 *
 * @description
 * Features:
 * - Supports drag-and-drop and resize for each image
 * - Fully responsive via react-grid-layout breakpoints
 * - Integrates tightly with image and layout state managers
 * - Prevents rendering issues with initial container width = 0
 *
 * @param {GridProps} props - Props for the Grid component
 * @returns {WPElement|null} Rendered responsive grid or null when width is 0
 *
 * @example
 * const layouts = {
 *   lg: [{ i: 'abc123', x: 0, y: 0, w: 2, h: 2 }],
 * };
 *
 * <Grid
 *   width={containerWidth}
 *   images={[{ key: 'abc123', url: 'image.jpg', ... }]}
 *   layouts={layouts}
 *   onLayoutChange={(layout, allLayouts) => saveLayouts(allLayouts)}
 *   onRemoveImage={(key) => removeImageByKey(key)}
 *   onBreakpointChange={(breakpoint, cols) => console.log(breakpoint, cols)}
 * />
 */
const Grid = ({ width, images, layouts, onLayoutChange, onRemoveImage, onBreakpointChange }) => {
	// Directly use Responsive from react-grid-layout.
	// It will receive the 'width' prop directly from the parent (edit.js).
	const ResponsiveGridLayout = Responsive;

	// Important: Conditionally render ResponsiveGridLayout only if a valid width is available (> 0).
	// This prevents `react-grid-layout` from rendering incorrectly or throwing errors with an initial `width=0`.
	if (width === 0) {
		return null; // Or you can return a loading spinner or a div with a min-height placeholder.
	}

	return (
		<ResponsiveGridLayout
			measureBeforeMount
			className="layout"
			layouts={layouts}
			breakpoints={GRID_CONFIG.breakpoints}
			cols={GRID_CONFIG.cols}
			rowHeight={LAYOUT_CONSTANTS.GRID_ROW_HEIGHT}
			onLayoutChange={onLayoutChange}
			onBreakpointChange={onBreakpointChange}
			isDraggable
			isResizable
			margin={[0, 0]}
			containerPadding={[0, 0]}
			width={width} // Pass the received width directly to ResponsiveGridLayout
			resizeHandles={['ne', 'nw', 'se', 'sw']}
		>
			{images.map((image) => (
				<GridTile key={image.key} image={image} onRemoveImage={onRemoveImage} />
			))}
		</ResponsiveGridLayout>
	);
};

export default Grid;
