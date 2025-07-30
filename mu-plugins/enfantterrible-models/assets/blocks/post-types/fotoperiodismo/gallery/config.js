/**
 * @file Configuration constants for the gallery block component.
 * Defines responsive breakpoints, grid layouts, and default states for the fotoperiodismo gallery.
 *
 * @module GalleryConfig
 * @version 1.0.0
 * @since 1.0.0
 */

import textdomain from './block.json';

/**
 * WordPress text domain for internationalization
 * @type {string}
 * @constant
 * @default ''
 */
const TEXT_DOMAIN = textdomain?.textdomain || '';

/**
 * WordPress post meta field key for storing gallery data
 * @type {string}
 * @constant
 */
const META_FIELD = 'et_models_fotoperiodismo_images';

/**
 * Responsive grid configuration object defining breakpoints, columns, and item widths
 * @typedef {object} GridConfiguration
 * @property {object} breakpoints - Pixel widths where layout changes occur
 * @property {number} breakpoints.lg - Large desktop breakpoint (1366px+)
 * @property {number} breakpoints.md - Medium desktop/tablet breakpoint (996px+)
 * @property {number} breakpoints.sm - Small tablet breakpoint (768px+)
 * @property {number} breakpoints.xs - Mobile breakpoint (600px+)
 * @property {number} breakpoints.xxs - Extra small mobile breakpoint (0px+)
 * @property {object} cols - Number of grid columns per breakpoint
 * @property {number} cols.lg - Columns for large screens (12)
 * @property {number} cols.md - Columns for medium screens (8)
 * @property {number} cols.sm - Columns for small screens (4)
 * @property {number} cols.xs - Columns for mobile (2)
 * @property {number} cols.xxs - Columns for extra small mobile (1)
 * @property {object} itemWidth - Default item width in grid units per breakpoint
 * @property {number} itemWidth.lg - Item width on large screens (3 units)
 * @property {number} itemWidth.md - Item width on medium screens (2 units)
 * @property {number} itemWidth.sm - Item width on small screens (2 units)
 * @property {number} itemWidth.xs - Item width on mobile (1 unit)
 * @property {number} itemWidth.xxs - Item width on extra small mobile (1 unit)
 */
const GRID_CONFIG = {
	breakpoints: {
		lg: 1366,
		md: 996,
		sm: 768,
		xs: 600,
		xxs: 0, // Catches everything below 600px
	},
	cols: {
		lg: 12,
		md: 8,
		sm: 4,
		xs: 2,
		xxs: 1,
	},
	itemWidth: {
		lg: 3,
		md: 2,
		sm: 2,
		xs: 1,
		xxs: 1,
	},
};

/**
 * Initial state structure for new gallery instances
 * @typedef {object} GalleryState
 * @property {Array<GalleryImage>} images - Array of gallery images
 * @property {LayoutsByBreakpoint} layouts - Layout configurations for each breakpoint
 * @property {number|null} lastUpdated - Unix timestamp of last modification
 */

/**
 * @typedef {object} GalleryImage
 * @property {string} key - Unique identifier for the image
 * @property {string} url - Image source URL
 * @property {string} alt - Image alt text
 * @property {string} title - Image title/caption
 * @property {number} id - WordPress media attachment ID
 * @property {object} size - Image dimensions
 * @property {number} size.width - Image width in pixels
 * @property {number} size.height - Image height in pixels
 */

/**
 * @typedef {object} LayoutsByBreakpoint
 * @property {Array<LayoutItem>} lg - Layout items for large screens
 * @property {Array<LayoutItem>} md - Layout items for medium screens
 * @property {Array<LayoutItem>} sm - Layout items for small screens
 * @property {Array<LayoutItem>} xs - Layout items for mobile
 * @property {Array<LayoutItem>} xxs - Layout items for extra small mobile
 */

/**
 * @typedef {object} LayoutItem
 * @property {string} i - Item identifier (matches GalleryImage.key)
 * @property {number} x - X coordinate in grid units
 * @property {number} y - Y coordinate in grid units
 * @property {number} w - Width in grid units
 * @property {number} h - Height in grid units
 * @property {number} [minW] - Minimum width constraint
 * @property {number} [minH] - Minimum height constraint
 * @property {number} [maxW] - Maximum width constraint
 * @property {number} [maxH] - Maximum height constraint
 * @property {boolean} [isDraggable] - Whether item can be dragged
 * @property {boolean} [isResizable] - Whether item can be resized
 */

/**
 * Default gallery state for new instances
 * @type {GalleryState}
 * @constant
 */
const DEFAULT_GALLERY_STATE = {
	images: [],
	layouts: { lg: [], md: [], sm: [], xs: [], xxs: [] },
	lastUpdated: null,
};

/**
 * Layout calculation constants for grid item sizing
 * @typedef {object} LayoutConstants
 * @property {number} DEFAULT_ITEM_HEIGHT - Standard height for new items (3 units)
 * @property {number} MIN_ITEM_HEIGHT - Minimum allowed item height (2 units)
 * @property {number} GRID_ROW_HEIGHT - Height of each grid row in pixels (60px)
 * @property {number} MAX_ITEM_HEIGHT_XS - Maximum height for mobile items (10 units)
 */

/**
 * Constants used for layout calculations and constraints
 * @type {LayoutConstants}
 * @constant
 */
const LAYOUT_CONSTANTS = {
	/** Default height for newly added gallery items */
	DEFAULT_ITEM_HEIGHT: 3,
	/** Minimum height constraint for all gallery items */
	MIN_ITEM_HEIGHT: 2,
	/** Physical height of each grid row in pixels */
	GRID_ROW_HEIGHT: 60,
	/** Maximum height allowed for items on mobile (xs) breakpoint */
	MAX_ITEM_HEIGHT_XS: 10,
};

export { META_FIELD, GRID_CONFIG, DEFAULT_GALLERY_STATE, LAYOUT_CONSTANTS, TEXT_DOMAIN };
