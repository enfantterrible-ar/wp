// assets/js/block-filters.js
import { addFilter } from '@wordpress/hooks';
import * as blockFilters from './block-filters/index';

/** @typedef {import('./types').WP_BlocksFilterDefinition} WP_BlocksFilterDefinition */

/**
 * Registers all block-related WordPress filters defined in the
 * `blocks-filters` module directory.
 *
 * Each module inside `blocks-filters` should export one or more filter
 * definitions as named exports. These should conform to the
 * {@link WP_BlocksFilterDefinition} shape.
 *
 * This loop collects all exported filter objects and registers them
 * using `addFilter`. Each must contain:
 *   - `hook`: the WordPress filter name to attach to.
 *   - `namespace`: a unique namespace for the filter.
 *   - `callback`: the actual function to apply as the filter.
 *
 * Example expected structure in a filter module:
 * ```js
 * export const disableToolbar = {
 *   hook: 'editor.BlockContextualToolbar',
 *   namespace: 'my-plugin/disable-toolbar',
 *   callback: (Slot) => (props) => { ... }
 * };
 * ```
 */
Object.values(blockFilters).forEach(
	/**
	 * Registers a single block filter definition with WordPress.
	 * @param {WP_BlocksFilterDefinition} filter The filter definition object containing hook, namespace, and callback.
	 */
	({ hook, namespace, callback }) => {
		addFilter(hook, namespace, callback);
	},
);
