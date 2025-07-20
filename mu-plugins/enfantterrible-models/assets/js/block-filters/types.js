// assets/js/types.js
/**
 * WordPress block filter definition that disables selection for specific blocks.
 *
 * This filter definition conforms to the WP_BlocksFilterDefinition shape and
 * hooks into the 'editor.BlockEdit' filter to wrap all block edit components
 * with selection prevention logic.
 *
 * @typedef {object} WP_BlocksFilterDefinition
 * @property {string} hook - The name of the WordPress filter hook to attach to
 * (e.g., `'editor.BlockContextualToolbar'`).
 * @property {string} namespace - A unique string used to namespace the filter,
 * which prevents conflicts with other plugins or themes.
 * (e.g., `'my-plugin/disable-toolbar'`).
 * @property {Function} callback - The function that modifies or replaces the
 * value passed through the filter hook.
 */
