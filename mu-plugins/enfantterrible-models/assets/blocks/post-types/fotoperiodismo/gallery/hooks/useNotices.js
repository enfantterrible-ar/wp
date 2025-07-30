import { useCallback } from 'react';
import { dispatch, select } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

// Module‑scoped singleton for all useNotices instances
const recentNotices = new Map();
const DUPLICATE_PREVENTION_DELAY = 500; // ms

/**
 * @typedef {object} NoticeManager
 * @property {function(string, string, object=): void} showNotice - Display a notice with a specified type, message, and optional options.
 * @property {function(string): void} dismissNotice - Remove a notice by its ID and clear it from duplicate tracking.
 * @property {function(string, string): string} generateNoticeId - Generate a unique ID for a notice based on its type and message.
 */

/**
 * Alias for the return type of the useNotices hook.
 *
 * @typedef {NoticeManager} UseNoticeManagerReturn
 */

/**
 * Custom hook for managing WordPress admin notices, preventing duplicates and allowing dismissal.
 *
 * This hook provides functionalities to display and manage notices within a WordPress
 * admin interface using the Gutenberg data layer.
 *
 * @description
 * This hook wraps WordPress’s `@wordpress/notices` store with:
 * - Automatic duplicate suppression within 500ms
 * - ID-based deduplication and manual dismissal
 * - Deterministic ID generation from notice type and message
 *
 * @example
 * const { showNotice } = useNotices();
 * showNotice('success', 'Gallery saved');
 *
 * @example
 * const { showNotice } = useNotices();
 * showNotice('error', 'Upload failed', {
 *   isDismissible: false,
 *   preventDuplicates: false,
 * });
 *
 * @example
 * const { generateNoticeId, showNotice } = useNotices();
 * const noticeId = generateNoticeId('warning', 'Unsaved changes');
 * showNotice('warning', 'Unsaved changes', { id: noticeId });
 *
 * @example
 * const { generateNoticeId, dismissNotice } = useNotices();
 * const noticeId = generateNoticeId('error', 'Upload failed');
 * dismissNotice(noticeId);
 *
 * @returns {UseNoticeManagerReturn} - Notice manager object with methods to handle admin notices.
 */

const useNotices = () => {
	/**
	 * Generates a unique notice ID based on type and message.
	 *
	 * The ID is formatted as: `[type]-[normalized-message]` where:
	 * - `[type]` is the original notice type
	 * - `[normalized-message]` is the message converted to lowercase with spaces replaced by hyphens
	 *
	 * @callback generateNoticeId
	 * @param {string} type - The notice type/severity (e.g., 'error', 'success')
	 * @param {string} message - The notice content text
	 * @returns {string} Generated notice ID in the format `[type]-[normalized-message]`
	 *
	 * @example
	 * generateNoticeId('Error', 'Save failed'); // Returns 'error-save-failed'
	 * generateNoticeId('Warning', 'Disk space low'); // Returns 'warning-disk-space-low'
	 */
	const generateNoticeId = useCallback(
		(type, message) => `${type}-${message.replace(/\s+/g, '-').toLowerCase()}`,
		[],
	);

	/**
	 * Determines if a notice with the given ID is a duplicate within a specified delay.
	 *
	 * This function checks if a notice has been shown recently based on its ID and a predefined
	 * duplicate prevention delay. If the notice was displayed within the delay period, it is
	 * considered a duplicate, and the function returns true. Otherwise, it updates the record
	 * of the notice's display time and returns false. The function also performs cleanup of
	 * outdated entries from the recent notices tracking map.
	 *
	 * @param {string} noticeId - The unique identifier of the notice to check.
	 * @returns {boolean} - Returns true if the notice is a duplicate, otherwise false.
	 */
	const isDuplicateNotice = (noticeId) => {
		const now = Date.now();
		const lastShown = recentNotices.get(noticeId);

		if (lastShown && now - lastShown < DUPLICATE_PREVENTION_DELAY) {
			return true;
		}

		recentNotices.set(noticeId, now);

		// Cleanup old entries
		for (const [id, timestamp] of recentNotices.entries()) {
			if (now - timestamp > DUPLICATE_PREVENTION_DELAY) {
				recentNotices.delete(id);
			}
		}

		return false;
	};

	/**
	 * Removes an existing notice by ID if found in the store.
	 *
	 * Retrieves current notices, checks for existence of the specified ID,
	 * and dispatches a removal action if found. Safe to call even if notice doesn't exist.
	 *
	 * @param {string} id - The unique identifier of the notice to remove
	 *
	 * @example
	 * removeExistingNotice('error-save-failed');
	 *
	 * @see {@link noticesStore} for store structure
	 * @see {@link module:@wordpress/notices|getNotices} for notice retrieval
	 * @see {@link module:@wordpress/notices|removeNotice} for removal dispatch
	 */
	const removeExistingNotice = (id) => {
		const notices = select(noticesStore).getNotices();
		const existing = notices.find((n) => n.id === id);
		if (existing) {
			dispatch(noticesStore).removeNotice(existing.id);
		}
	};

	/**
	 * Displays a notification with configurable options.
	 *
	 * @callback showNotice
	 * @param {string} type - The type/severity of the notice (e.g., 'error', 'warning', 'success')
	 * @param {string} message - The content message to display in the notice
	 * @param {object} [options] - Configuration options for the notice
	 * @param {boolean} [options.preventDuplicates=true] - Whether to prevent duplicate notices using ID
	 * @param {string} [options.id] - Custom unique identifier for the notice
	 * @param {boolean} [options.isDismissible=true] - Whether the notice can be dismissed by the user
	 * @param {...*} [options.rest] - Additional options to pass to the notice creation function
	 *
	 * @example
	 * showNotice('error', 'Failed to save data', {
	 *   id: 'save-error',
	 *   preventDuplicates: false,
	 *   isDismissible: false
	 *   ...rest
	 * });
	 */
	const showNotice = useCallback(
		(type, message, options = {}) => {
			const {
				preventDuplicates = true,
				id: customId,
				isDismissible = true,
				...rest
			} = options;

			const effectiveId = customId || generateNoticeId(type, message);

			if (preventDuplicates && isDuplicateNotice(effectiveId)) {
				return;
			}

			removeExistingNotice(effectiveId);

			dispatch(noticesStore).createNotice(type, message, {
				id: effectiveId,
				isDismissible,
				...rest,
			});
		},
		[generateNoticeId],
	);

	/**
	 * Dismisses a notice by removing it from both the store and recent tracking.
	 *
	 * Performs two main actions:
	 * 1. Dispatches removal from the notices store
	 * 2. Removes the notice ID from recent tracking to prevent immediate reappearance
	 *
	 * @callback dismissNotice
	 * @param {string} id - The unique identifier of the notice to dismiss
	 *
	 * @example
	 * dismissNotice('error-save-failed');
	 *
	 * @see {@link module:@wordpress/notices|removeNotice} for store removal implementation
	 * @see {@link recentNotices} for tracking context
	 */
	const dismissNotice = useCallback((id) => {
		dispatch(noticesStore).removeNotice(id);
		recentNotices.delete(id);
	}, []);

	return {
		showNotice,
		dismissNotice,
		generateNoticeId,
	};
};

export default useNotices;
