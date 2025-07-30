// components/EmptyState.js
import { WPElement } from '@wordpress/element';

/**
 * Displays an empty state placeholder for the gallery block.
 *
 * Shows simple instructional text in a styled container.
 *
 * @returns {WPElement} Rendered empty state component
 *
 * @example
 * // Basic usage
 * <EmptyState />
 *
 * @example
 * // Within another component
 * {isEmpty && <EmptyState />}
 */
const EmptyState = () => {
	return (
		<div className="wp-block-enfantterrible-models-gallery__empty">
			<p>Arrastra y suelta imagenes aquí.</p>
		</div>
	);
};

export default EmptyState;
