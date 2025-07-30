// authors.js

import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	Inserter,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { usePostMetaValue } from '@10up/block-components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

/** @typedef {import('@wordpress/element').WPElement} WPElement */

/**
 * Edit component for the `enfantterrible-models/authors` block.
 *
 * Responsibilities:
 * - Hydrate InnerBlocks with authors from post meta (`et_models_fotoperiodismo_authors`) on first render.
 * - Keep post meta in sync with InnerBlocks whenever they change.
 * - Provide UI for inserting additional `authors-item` blocks.
 *
 * @param {object} props - Component props.
 * @param {string} props.clientId - The unique client ID of this block instance.
 * @returns {WPElement} Rendered block edit interface.
 */
export const BlockEdit = ({ clientId }) => {
	/** @type {import('@wordpress/block-editor').BlockProps} */
	const blockProps = useBlockProps();

	/**
	 * Author data stored in post meta.
	 * @type {[Array<{ id: string, name: string, url: string }>, Function]}
	 */
	const [authors, setAuthors] = usePostMetaValue('et_models_fotoperiodismo_authors');

	/** Dispatch for replacing inner blocks. */
	const { replaceInnerBlocks } = useDispatch(blockEditorStore);

	/**
	 * The current inner blocks within this block.
	 * Updates whenever the block’s children change.
	 */
	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId),
		[clientId],
	);

	/** Tracks whether hydration has already occurred to avoid re-running it. */
	const hasHydrated = useRef(false);

	/**
	 * 1) HYDRATION EFFECT — Runs once on mount, if no inner blocks exist yet.
	 * Creates child blocks based on existing post meta.
	 */
	useEffect(() => {
		if (hasHydrated.current) return;
		if (!Array.isArray(authors)) return;

		// If there are already inner blocks, assume user-added or previously hydrated.
		if (innerBlocks.length > 0) {
			hasHydrated.current = true;
			return;
		}

		// Create a block for each author.
		const blocks = authors.map((author) =>
			wp.blocks.createBlock('enfantterrible-models/authors-item', {
				id: author.id,
				name: author.name,
				url: author.url,
			}),
		);

		replaceInnerBlocks(clientId, blocks, false);
		hasHydrated.current = true;
	}, [authors, innerBlocks, clientId, replaceInnerBlocks]);

	/**
	 * 2) SYNC EFFECT — Whenever children change, update the post meta.
	 * Only triggers after hydration has completed.
	 */
	useEffect(() => {
		if (!hasHydrated.current) return;

		// Extract author attributes from each block.
		const newAuthors = innerBlocks.map(({ attributes }) => ({
			id: attributes.id,
			name: attributes.name || '',
			url: attributes.url || '',
		}));

		// Avoid unnecessary writes by comparing content.
		if (JSON.stringify(newAuthors) !== JSON.stringify(authors)) {
			setAuthors(newAuthors);
		}
	}, [innerBlocks, authors, setAuthors]);

	/**
	 * Props and children for InnerBlocks rendering.
	 * Allows only `authors-item` blocks and disables the default inserter line.
	 */
	const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
		allowedBlocks: ['enfantterrible-models/authors-item'],
		templateLock: false,
		renderAppender: false,
	});

	return (
		<div {...innerBlocksProps}>
			<div className="wp-block-enfantterrible-models-authors-header">
				<p>Autorxs</p>
			</div>
			{children}
			<Inserter
				rootClientId={clientId}
				renderToggle={({ onToggle }) => (
					<Button
						onClick={onToggle}
						className="wp-block-enfantterrible-models-authors-add-button"
						variant="primary"
					>
						+ Agregar autorxs
					</Button>
				)}
			/>
		</div>
	);
};
