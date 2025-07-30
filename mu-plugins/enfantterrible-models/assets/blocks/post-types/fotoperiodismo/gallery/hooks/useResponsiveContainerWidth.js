import { useState, useLayoutEffect, useCallback, useRef, RefObject } from '@wordpress/element';

/**
 * @typedef {object} ContainerWidthMeasurement
 * @property {number} width - Current container width in pixels (debounced)
 * @property {(node: HTMLElement | null) => void} measureRef - Ref callback for attaching to elements
 * @property {RefObject<HTMLElement>} containerRef - Direct ref access to the container
 */

/**
 * Alias for the return type of the useNotices hook.
 *
 * @typedef {ContainerWidthMeasurement} UseContainerWidthMeasurement
 */

/**
 * Hook for responsive container width measurement with debounced updates.
 * Uses ResizeObserver when available, falls back to window resize events.
 * Provides multiple ways to access/attach to the measured element.
 *
 * @returns {UseContainerWidthMeasurement} Measurement results
 *
 * @example
 * // Basic usage with ref callback (recommended)
 * const { width, measureRef } = useResponsiveContainerWidth();
 * return <div ref={measureRef}>{width}px</div>;
 *
 * @example
 * // Using direct ref access
 * const { containerRef } = useResponsiveContainerWidth();
 * return <div ref={containerRef} />;
 */
const useResponsiveContainerWidth = () => {
	const containerRef = useRef(null);
	const [width, setWidth] = useState(0);
	const resizeTimeout = useRef(null);

	/**
	 * Debounced width measurement update
	 * @private
	 */
	const updateWidth = useCallback(() => {
		if (!containerRef.current) return;
		const newWidth = containerRef.current.getBoundingClientRect().width;

		if (resizeTimeout.current) {
			clearTimeout(resizeTimeout.current);
		}
		resizeTimeout.current = setTimeout(() => {
			setWidth((prev) => (Math.abs(prev - newWidth) > 1 ? newWidth : prev));
		}, 16);
	}, []);

	/**
	 * Sets up measurement observers and event listeners
	 * @private
	 */
	useLayoutEffect(() => {
		// Initial measurement
		updateWidth();

		let observer;
		if (window.ResizeObserver) {
			observer = new ResizeObserver(() => {
				updateWidth();
			});
			if (containerRef.current) observer.observe(containerRef.current);
		} else {
			window.addEventListener('resize', updateWidth, { passive: true });
		}

		return () => {
			if (observer) {
				observer.disconnect();
			} else {
				window.removeEventListener('resize', updateWidth);
			}
			if (resizeTimeout.current) {
				clearTimeout(resizeTimeout.current);
			}
		};
	}, [updateWidth]);

	/**
	 * Ref callback that attaches to elements and triggers measurement
	 * @callback measureRef
	 * @param {HTMLElement|null} node - DOM element to measure (or null when unmounting)
	 */
	const measureRef = useCallback(
		(node) => {
			containerRef.current = node;
			// Force re-measure when node changes
			updateWidth();
		},
		[updateWidth],
	);

	return [width, measureRef, containerRef];
};

export default useResponsiveContainerWidth;
