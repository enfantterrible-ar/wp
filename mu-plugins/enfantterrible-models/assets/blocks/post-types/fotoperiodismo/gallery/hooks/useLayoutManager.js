// hooks/useLayoutManager.js
import { useCallback, useRef, useMemo } from '@wordpress/element';
import { GRID_CONFIG, LAYOUT_CONSTANTS } from '../config';

/**
 * @typedef {import('../config').GalleryImage} GalleryImage
 * @typedef {import('../config').LayoutsByBreakpoint} LayoutsByBreakpoint
 */

/**
 * @typedef {object} LayoutManager
 * @property {LayoutsByBreakpoint} layouts - All calculated layouts by breakpoint
 * @property {() => void} generateLayouts - Generates new layouts for all breakpoints
 * @property {() => void} updateLayouts - Updates layouts from user interactions
 * @property {(id: string) => void} removeFromLayouts - Removes an image from all layouts
 * @property {(breakpoint: string) => void} onBreakpointChange - Callback for breakpoint changes
 * @property {number} rowHeight - Grid row height in pixels
 * @property {number} cols - Default number of columns
 * @property {(width: number) => string} getBreakpointFromWidth - Gets breakpoint name from width
 */

/**
 * Alias for the return type of the UseLayoutManagerReturn hook.
 *
 * @typedef {LayoutManager} UseLayoutManagerReturn
 */

/**
 * Manages responsive grid layouts for gallery images across breakpoints.
 * Handles layout calculations, position optimization, and responsive behavior.
 *
 * @param {object} config - Configuration object
 * @param {LayoutsByBreakpoint} config.currentLayouts - Current layouts by breakpoint
 * @param {Array<GalleryImage>} config.images - Current gallery images
 * @param {Function} config.updateGallery - Gallery state update function
 * @param {number} config.measuredWidth - Current container width in pixels
 *
 * @returns {UseLayoutManagerReturn}
 */
const useLayoutManager = ({ currentLayouts, images, updateGallery, measuredWidth }) => {
	const layoutsRef = useRef(currentLayouts || {});
	const imagesRef = useRef(images || []);
	const layoutCache = useRef(new Map());

	// Update refs
	layoutsRef.current = currentLayouts;
	imagesRef.current = images;

	const rowHeight = LAYOUT_CONSTANTS.GRID_ROW_HEIGHT;
	const breakpoints = Object.keys(GRID_CONFIG.cols);
	const baseBreakpoint = breakpoints[0];
	const baseCols = GRID_CONFIG.cols[baseBreakpoint];

	/**
	 * Determines the appropriate breakpoint name for a given width
	 * @param {number} width - Container width in pixels
	 * @returns {string} Breakpoint name (e.g. 'xs', 'md', 'lg')
	 */
	const getBreakpointFromWidth = useCallback(
		(width) => {
			const sorted = Object.entries(GRID_CONFIG.breakpoints).sort(([, a], [, b]) => b - a);
			for (const [bp, minWidth] of sorted) {
				if (width >= minWidth) return bp;
			}
			return breakpoints[breakpoints.length - 1];
		},
		[breakpoints],
	);

	/**
	 * Finds optimal position for a new grid item using bin-packing algorithm
	 * @param {Array} newLayout - Current layout items
	 * @param {number} itemWidth - Item width in grid units
	 * @param {number} itemHeight - Item height in grid units
	 * @param {number} cols - Number of columns in grid
	 * @returns {object} Optimal position {x, y}
	 */
	const findBestPosition = useCallback((newLayout, itemWidth, itemHeight, cols) => {
		// Create a grid to track occupied spaces
		const maxY = Math.max(0, ...newLayout.map((item) => item.y + item.h));
		const gridHeight = maxY + itemHeight + 5; // Add some buffer

		// Create a 2D array to represent the grid
		const grid = Array(gridHeight)
			.fill(null)
			.map(() => Array(cols).fill(false));

		// Mark occupied spaces
		newLayout.forEach((item) => {
			for (let { y } = item; y < item.y + item.h; y++) {
				for (let { x } = item; x < item.x + item.w; x++) {
					if (y < gridHeight && x < cols) {
						grid[y][x] = true;
					}
				}
			}
		});

		// Find the first available position that can fit the item
		for (let y = 0; y < gridHeight - itemHeight + 1; y++) {
			for (let x = 0; x <= cols - itemWidth; x++) {
				// Check if the item can fit at this position
				let canFit = true;
				for (let dy = 0; dy < itemHeight && canFit; dy++) {
					for (let dx = 0; dx < itemWidth && canFit; dx++) {
						if (grid[y + dy][x + dx]) {
							canFit = false;
						}
					}
				}

				if (canFit) {
					return { x, y };
				}
			}
		}

		// If no space found, place at the bottom
		return { x: 0, y: maxY };
	}, []);

	/**
	 * Calculates appropriate grid height for an image based on aspect ratio
	 * @param {number} aspectRatio - Image height/width ratio
	 * @param {number} itemWidth - Item width in grid units
	 * @param {number} colWidthPx - Column width in pixels
	 * @param {string} bp - Breakpoint name
	 * @returns {number} Calculated grid height in rows
	 */
	const calculateItemHeight = useCallback(
		(aspectRatio, itemWidth, colWidthPx, bp) => {
			const physicalWidth = itemWidth * colWidthPx;
			const physicalHeight = physicalWidth * aspectRatio;
			let calculatedHeight = Math.max(
				LAYOUT_CONSTANTS.MIN_ITEM_HEIGHT,
				Math.round(physicalHeight / rowHeight),
			);

			// Apply stricter height constraints for xs breakpoint to prevent overly tall images
			if (bp === 'xs') {
				// For mobile, we want a more reasonable height regardless of aspect ratio
				const maxHeightXs = LAYOUT_CONSTANTS.MAX_ITEM_HEIGHT_XS || 6;
				calculatedHeight = Math.min(calculatedHeight, maxHeightXs);

				// Also ensure a minimum reasonable height for very wide images
				calculatedHeight = Math.max(calculatedHeight, 3);
			}

			return calculatedHeight;
		},
		[rowHeight],
	);

	/**
	 * Calculates complete layout for a specific breakpoint
	 * @param {string} bp - Breakpoint name
	 * @param {number} containerWidth - Container width in pixels
	 * @param {boolean} [forceRecalculate=false] - Bypass cache
	 * @returns {Array} Layout items for the breakpoint
	 */
	const calculateLayoutForBreakpoint = useCallback(
		(bp, containerWidth, forceRecalculate = false) => {
			const cacheKey = `${bp}-${containerWidth}-${images.length}`;

			if (!forceRecalculate && layoutCache.current.has(cacheKey)) {
				return layoutCache.current.get(cacheKey);
			}

			const existingLayout = layoutsRef.current[bp] || [];
			const existingLayoutMap = new Map(existingLayout.map((item) => [item.i, item]));

			const cols = GRID_CONFIG.cols[bp];
			const itemWidth = GRID_CONFIG.itemWidth[bp] || GRID_CONFIG.itemWidth.lg;
			const colWidthPx = containerWidth / cols;

			const newLayout = [];

			for (const image of imagesRef.current) {
				const existingItem = existingLayoutMap.get(image.key);

				if (existingItem) {
					// Keep existing position and check if it was user-resized
					const aspectRatio =
						image.size?.height && image.size?.width
							? image.size.height / image.size.width
							: 1;
					const calculatedHeight = calculateItemHeight(
						aspectRatio,
						itemWidth,
						colWidthPx,
						bp,
					);

					// If height differs significantly from calculated, assume user resized
					const isUserResized = Math.abs(existingItem.h - calculatedHeight) > 1;
					// If existing width differs from the default itemWidth, assume user resized width
					const isUserResizedWidth = existingItem.w !== itemWidth;

					let height;
					if (!isUserResized) {
						height = calculatedHeight;
					} else if (bp === 'xxs') {
						height = Math.min(existingItem.h, LAYOUT_CONSTANTS.MAX_ITEM_HEIGHT_XS || 6);
					} else {
						height = existingItem.h;
					}

					newLayout.push({
						...existingItem,
						// Preserve user resize, otherwise use calculated dimensions
						w: isUserResizedWidth ? existingItem.w : itemWidth,
						h: height,
					});
				} else {
					// New image - calculate position and dimensions
					const aspectRatio =
						image.size && image.size.height && image.size.width
							? image.size.height / image.size.width
							: 1;
					const calculatedHeight = calculateItemHeight(
						aspectRatio,
						itemWidth,
						colWidthPx,
						bp,
					);

					// Find the best position using the improved algorithm
					const { x, y } = findBestPosition(newLayout, itemWidth, calculatedHeight, cols);

					newLayout.push({
						i: image.key,
						x: Math.max(0, Math.min(x, cols - itemWidth)),
						y: Math.max(0, y),
						w: itemWidth,
						h: calculatedHeight,
					});
				}
			}

			layoutCache.current.set(cacheKey, newLayout);
			return newLayout;
		},
		[images, findBestPosition, calculateItemHeight],
	);

	/**
	 * Generates responsive layouts for all breakpoints
	 * @returns {object} Layouts by breakpoint
	 */
	const generateLayouts = useCallback(() => {
		const layouts = {};
		const currentBp = getBreakpointFromWidth(measuredWidth);

		// Clear cache when new images are added
		layoutCache.current.clear();

		for (const bp of breakpoints) {
			// Use actual measured width for current breakpoint
			let containerWidth = measuredWidth;

			// For other breakpoints, estimate container width
			if (bp !== currentBp) {
				containerWidth = GRID_CONFIG.breakpoints[bp] || measuredWidth;
			}

			layouts[bp] = calculateLayoutForBreakpoint(bp, containerWidth, true);
		}

		return layouts;
	}, [breakpoints, calculateLayoutForBreakpoint, getBreakpointFromWidth, measuredWidth]);

	/**
	 * Gets the current active breakpoint based on measured width
	 * @type {string}
	 */
	const currentBreakpoint = getBreakpointFromWidth(measuredWidth);

	/**
	 * Calculates and memoizes the layout for the current breakpoint
	 * - Returns empty array if width is 0 or no images exist
	 * - Uses cached calculation when dependencies haven't changed
	 * @type {Array}
	 * @see calculateLayoutForBreakpoint
	 */
	const currentLayout = useMemo(() => {
		if (measuredWidth === 0 || images.length === 0) return [];
		return calculateLayoutForBreakpoint(currentBreakpoint, measuredWidth);
	}, [calculateLayoutForBreakpoint, currentBreakpoint, measuredWidth, images.length]);

	/**
	 * Generates and memoizes responsive layouts for all breakpoints
	 * - Returns empty layouts for all breakpoints if width is 0
	 * - Uses currentLayout for active breakpoint (avoids recalculating)
	 * - Estimates widths for other breakpoints using config
	 * @type {object}
	 * @property {Array} [breakpointName] - Layout array for each breakpoint
	 * @example
	 * {
	 *   xs: [...],
	 *   sm: [...],
	 *   lg: [...]
	 * }
	 */
	const allLayouts = useMemo(() => {
		if (measuredWidth === 0) {
			return breakpoints.reduce((acc, bp) => {
				acc[bp] = [];
				return acc;
			}, {});
		}

		const layouts = {};
		for (const bp of breakpoints) {
			if (bp === currentBreakpoint) {
				layouts[bp] = currentLayout;
			} else {
				const estimatedWidth = GRID_CONFIG.breakpoints[bp] || measuredWidth;
				layouts[bp] = calculateLayoutForBreakpoint(bp, estimatedWidth);
			}
		}

		return layouts;
	}, [
		breakpoints,
		currentBreakpoint,
		currentLayout,
		calculateLayoutForBreakpoint,
		measuredWidth,
	]);

	/**
	 * Updates layouts from react-grid-layout changes
	 * @param {Array} _ - Unused param (maintained for RGL compatibility)
	 * @param {object} allLayoutsFromRGL - New layouts by breakpoint
	 */
	const updateLayouts = useCallback(
		(_, allLayoutsFromRGL) => {
			const mergedLayouts = { ...layoutsRef.current };

			// Update layouts with data from react-grid-layout
			for (const bp of Object.keys(allLayoutsFromRGL)) {
				mergedLayouts[bp] = allLayoutsFromRGL[bp];
			}

			// Clear cache since layouts changed
			layoutCache.current.clear();

			updateGallery({ layouts: mergedLayouts });
		},
		[updateGallery],
	);

	/**
	 * Callback for breakpoint changes (clears layout cache)
	 */
	const onBreakpointChange = useCallback(() => {
		// Clear cache to force fresh calculations
		layoutCache.current.clear();
	}, []);

	/**
	 * Removes an image from all layouts
	 * @param {string} imageKey - Unique image identifier
	 * @returns {object} Updated layouts by breakpoint
	 */
	const removeFromLayouts = useCallback(
		(imageKey) => {
			const newLayouts = {};
			for (const bp of breakpoints) {
				newLayouts[bp] = (layoutsRef.current[bp] || []).filter(
					(item) => item.i !== imageKey,
				);
			}

			// Clear cache since layouts changed
			layoutCache.current.clear();

			return newLayouts;
		},
		[breakpoints],
	);

	return {
		layouts: allLayouts,
		generateLayouts,
		updateLayouts,
		removeFromLayouts,
		onBreakpointChange,
		rowHeight,
		cols: baseCols,
		getBreakpointFromWidth,
	};
};

export default useLayoutManager;
