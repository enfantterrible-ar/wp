/**
 * @file Block filter that disables selection for specific block types.
 *
 * This filter wraps the BlockEdit component to automatically clear selection
 * when certain block types become selected, effectively making them non-selectable
 * in the WordPress block editor.
 */

/** @typedef {import('@wordpress/element').Component} Component */
/** @typedef {import('@wordpress/element').WPElement} WPElement */
/** @typedef {import('./types').WP_BlocksFilterDefinition} WP_BlocksFilterDefinition */

import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Array of block names that should not be selectable in the editor.
 * @type {string[]}
 * @constant
 */
const NON_SELECTABLE_BLOCKS = [
	'enfantterrible-models/authors',
	'enfantterrible-models/authors-item',
];

/**
 * Higher-order component that prevents selection of specific block types.
 *
 * When a block from the NON_SELECTABLE_BLOCKS array becomes selected,
 * this HOC automatically clears the selection, making the block
 * effectively non-selectable in the editor interface.
 *
 * @param {Component} BlockEdit - The original BlockEdit component to wrap
 * @returns {Component} Enhanced BlockEdit component with selection prevention
 */
const disableBlockSelection = createHigherOrderComponent((BlockEdit) => {
	/**
	 * The actual component returned by the HOC
	 * @param {object} props - Block edit component props
	 * @param {string} props.clientId - Unique identifier for the block instance
	 * @param {string} props.name - Block type name
	 * @returns {WPElement} The enhanced BlockEdit component with selection prevention
	 */
	return (props) => {
		const { clientId, name } = props;
		const { clearSelectedBlock } = useDispatch('core/block-editor');

		const isSelected = useSelect(
			(select) => {
				return select('core/block-editor').getSelectedBlockClientId() === clientId;
			},
			[clientId],
		);

		useEffect(() => {
			if (NON_SELECTABLE_BLOCKS.includes(name) && isSelected) {
				clearSelectedBlock();
			}
		}, [isSelected, name, clientId, clearSelectedBlock]);

		return <BlockEdit {...props} />;
	};
}, 'disableBlockSelection');

/**
 * WordPress block filter definition that disables selection for specific blocks.
 *
 * This filter definition conforms to the WP_BlocksFilterDefinition shape and
 * hooks into the 'editor.BlockEdit' filter to wrap all block edit components
 * with selection prevention logic.
 *
 * @type {WP_BlocksFilterDefinition}
 * @property {string} hook - The WordPress filter hook name
 * @property {string} namespace - Unique namespace to prevent conflicts
 * @property {Function} callback - The higher-order component that implements the filter
 */
export default {
	hook: 'editor.BlockEdit',
	namespace: 'enfantterrible-models/disable-selection',
	callback: disableBlockSelection,
};
