/**
 * @file Block filter that disables selection and controls pointer events for specific block types.
 *
 * This filter wraps the BlockEdit component to automatically clear selection
 * when certain block types become selected and applies custom styling like
 * disabling pointer events, effectively making them non-selectable and/or
 * non-interactive in the WordPress block editor.
 */

/** @typedef {import('@wordpress/element').Component} Component */
/** @typedef {import('@wordpress/element').WPElement} WPElement */
/** @typedef {import('./types').WP_BlocksFilterDefinition} WP_BlocksFilterDefinition */

import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * @typedef {object} BlockRule
 * @property {boolean} [self=true] - Whether the block itself should be non-selectable
 * @property {boolean} [pointerEvents=true] - Whether the block should have pointer events
 * @property {string[]|Object.<string, BlockRule|true>} [children] - Rules for immediate children
 */

/**
 * Object mapping block names to their behavioral rules.
 *
 * Each entry can be:
 * - true: block is always non-selectable (equivalent to {self: true, pointerEvents: true})
 * - BlockRule object with the following properties:
 *   - self: boolean - whether the block itself is non-selectable
 *   - pointerEvents: boolean - whether the block should have pointer events enabled
 *   - children: string[] | object - immediate children rules, either array of block names or nested rules object
 *
 * Nested children rules apply only to immediate children, no deeper recursion.
 *
 * @type {Object.<string, true | BlockRule>}
 * @constant
 */
const NON_SELECTABLE_BLOCKS = {
	'enfantterrible-models/authors': true,
	'enfantterrible-models/authors-item': true,
	'enfantterrible-models/description': {
		self: true,
		// pointerEvents: true,
	},
	'enfantterrible-models/gallery': {
		self: true,
	},
};

/**
 * @typedef {object} BlockBehavior
 * @property {boolean} shouldDisableSelection - Whether selection should be disabled
 * @property {boolean} shouldDisablePointerEvents - Whether pointer events should be disabled
 */

/**
 * Determines the behavioral rules for a block based on its own rule or parent's children rules.
 *
 * Only immediate parent-child relationships are considered.
 *
 * @param {string} clientId - client ID of the block to test
 * @param {string} blockName - block name of the block to test
 * @param {object} rules - NON_SELECTABLE_BLOCKS rules object
 * @param {Function} getBlockParents - function(clientId) => parentClientIds[]
 * @param {Function} getBlockName - function(clientId) => blockName
 * @returns {BlockBehavior} object describing what behaviors should be applied
 */
function getBlockBehavior(clientId, blockName, rules, getBlockParents, getBlockName) {
	const behavior = {
		shouldDisableSelection: false,
		shouldDisablePointerEvents: false,
	};

	// Check if block has its own rule
	const ownRule = rules[blockName];
	if (ownRule === true) {
		behavior.shouldDisableSelection = true;
		behavior.shouldDisablePointerEvents = true;
		return behavior;
	}

	if (typeof ownRule === 'object') {
		if (ownRule.self === true) {
			behavior.shouldDisableSelection = true;
		}
		if (ownRule.pointerEvents === false) {
			behavior.shouldDisablePointerEvents = true;
		}
	}

	// Get immediate parent client ID
	const parents = getBlockParents(clientId);
	if (parents.length === 0) {
		return behavior;
	}

	// parents array is ordered from root to immediate parent
	const immediateParentClientId = parents[parents.length - 1];
	const parentName = getBlockName(immediateParentClientId);
	const parentRule = rules[parentName];

	// Check if parent has children rules that apply to this block
	if (typeof parentRule === 'object' && parentRule.children) {
		const childrenRules = parentRule.children;

		// Handle array format: ['core/image', 'core/paragraph']
		if (Array.isArray(childrenRules)) {
			if (childrenRules.includes(blockName)) {
				behavior.shouldDisableSelection = true;
				behavior.shouldDisablePointerEvents = true;
			}
		}

		// Handle object format with nested rules
		if (typeof childrenRules === 'object') {
			const childRule = childrenRules[blockName];

			if (childRule === true) {
				behavior.shouldDisableSelection = true;
				behavior.shouldDisablePointerEvents = true;
			} else if (typeof childRule === 'object') {
				if (childRule.self === true) {
					behavior.shouldDisableSelection = true;
				}
				if (childRule.pointerEvents === false) {
					behavior.shouldDisablePointerEvents = true;
				}
			}
		}
	}

	return behavior;
}

/**
 * Higher-order component that controls selection and pointer events for specific block types.
 *
 * When a block from the NON_SELECTABLE_BLOCKS configuration becomes selected,
 * this HOC automatically clears the selection, making the block effectively
 * non-selectable in the editor interface. It also applies CSS styles to
 * disable pointer events when configured.
 *
 * @param {Component} BlockEdit - The original BlockEdit component to wrap
 * @returns {Component} Enhanced BlockEdit component with behavior controls
 */
const disableBlockSelection = createHigherOrderComponent((BlockEdit) => {
	/**
	 * The actual component returned by the HOC
	 * @param {object} props - Block edit component props
	 * @param {string} props.clientId - Unique identifier for the block instance
	 * @param {string} props.name - Block type name
	 * @returns {WPElement} The enhanced BlockEdit component with behavior controls
	 */
	return (props) => {
		const { clientId, name } = props;
		const { clearSelectedBlock } = useDispatch('core/block-editor');

		const { isSelected, shouldDisableSelection, shouldDisablePointerEvents } = useSelect(
			(select) => {
				const blockEditor = select('core/block-editor');
				const selectedId = blockEditor.getSelectedBlockClientId();
				const isSelected = selectedId === clientId;

				const { shouldDisableSelection, shouldDisablePointerEvents } = getBlockBehavior(
					clientId,
					name,
					NON_SELECTABLE_BLOCKS,
					blockEditor.getBlockParents,
					blockEditor.getBlockName,
				);

				// Return only primitive values to preserve referential stability
				return {
					isSelected,
					shouldDisableSelection,
					shouldDisablePointerEvents,
				};
			},
			[clientId, name],
		);

		// Clear selection immediately when a non-selectable block becomes selected
		useEffect(() => {
			if (shouldDisableSelection && isSelected) {
				clearSelectedBlock();
			}
		}, [isSelected, shouldDisableSelection, clearSelectedBlock]);

		// Apply pointer events styling
		useEffect(() => {
			const blockElement = document.querySelector(`[data-block="${clientId}"]`);

			if (blockElement) {
				if (shouldDisablePointerEvents) {
					blockElement.style.pointerEvents = 'none';
					blockElement.style.userSelect = 'none';
					blockElement.classList.add('block-pointer-events-disabled');
				} else {
					blockElement.style.pointerEvents = '';
					blockElement.style.userSelect = '';
					blockElement.classList.remove('block-pointer-events-disabled');
				}
			}

			// Always return a cleanup function to satisfy ESLint
			return () => {
				if (blockElement) {
					blockElement.style.pointerEvents = '';
					blockElement.style.userSelect = '';
					blockElement.classList.remove('block-pointer-events-disabled');
				}
			};
		}, [shouldDisablePointerEvents, clientId]);

		return <BlockEdit {...props} />;
	};
}, 'disableBlockSelection');

/**
 * WordPress block filter definition that controls selection and pointer events for specific blocks.
 *
 * This filter definition conforms to the WP_BlocksFilterDefinition shape and
 * hooks into the 'editor.BlockEdit' filter to wrap all block edit components
 * with behavioral control logic.
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
