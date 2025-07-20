// authors-item.js

import { __ } from '@wordpress/i18n';
import { useBlockProps, BlockMover } from '@wordpress/block-editor';
import { TextControl, Button, Toolbar } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { trash as trashIcon } from '@wordpress/icons';
import { useEffect } from '@wordpress/element';
import { nanoid } from 'nanoid';

/** @typedef {import('@wordpress/element').WPElement} WPElement */

/**
 * Edit component for a single `authors-item` block.
 *
 * Responsibilities:
 * - Displays editable fields for author's name and URL.
 * - Generates a stable ID on first render.
 * - Provides inline toolbar for reordering or deleting the block.
 *
 * @param {object} props - Component props.
 * @param {string} props.clientId - Unique identifier for the block instance.
 * @param {{ id?: string, name?: string, url?: string }} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Callback to update block attributes.
 * @returns {WPElement} The rendered block editing interface.
 */
export const BlockEdit = ({ clientId, attributes, setAttributes }) => {
	const blockProps = useBlockProps({ className: 'author-item' });
	const { removeBlock } = useDispatch('core/block-editor');
	const { id, name, url } = attributes;

	/**
	 * On first mount, generate a unique ID if it doesn't exist.
	 * Runs only once due to empty dependency array.
	 */
	useEffect(() => {
		if (!id) {
			setAttributes({ id: nanoid() });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Returns a field updater function for the given attribute key.
	 *
	 * @param {string} key - The attribute key to update.
	 * @returns {(value: string) => void} The updater function.
	 */
	const updateField = (key) => (value) => setAttributes({ [key]: value });

	return (
		<div {...blockProps}>
			{/* Input fields for name and URL */}
			<div className="wp-block-enfantterrible-models-authors-item--control-wrapper">
				<TextControl
					label={__('Nombre', 'enfantterrible-models')}
					value={name || ''}
					onChange={updateField('name')}
				/>
				<TextControl
					label={__('Enlace', 'enfantterrible-models')}
					value={url || ''}
					onChange={updateField('url')}
				/>
			</div>
			{/* Inline block controls: delete and move */}
			<Toolbar
				className="wp-block-enfantterrible-models-authors-item--control-actions"
				label="Options"
				variant="unstyled"
				orientation="vertical"
			>
				<>
					{/* Delete the block */}
					<Button
						icon={trashIcon}
						label={__('Eliminar autorx', 'enfantterrible-models')}
						onClick={() => removeBlock(clientId, true)}
						isDestructive
					/>
					{/* Move the block up/down */}
					<BlockMover clientIds={[clientId]} hideDragHandle />
				</>
			</Toolbar>
		</div>
	);
};
