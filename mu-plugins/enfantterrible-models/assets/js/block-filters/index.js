/**
 * @file Central export module for all block filter definitions.
 *
 * This module serves as the main entry point for collecting and exporting
 * all block-related WordPress filters. Each imported filter should conform
 * to the WP_BlocksFilterDefinition shape with hook, namespace, and callback
 * properties.
 */

import disableBlockSelection from './disableBlockSelection';

/**
 * WordPress block filter that prevents selection of specific block types.
 * @type {WP_BlocksFilterDefinition}
 */
export { disableBlockSelection };
