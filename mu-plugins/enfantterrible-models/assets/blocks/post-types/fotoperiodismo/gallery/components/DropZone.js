// components/DropZone.js
import { MediaPlaceholder } from '@wordpress/block-editor';
import { useState, useRef, WPElement } from '@wordpress/element';
import useNotices from '../hooks/useNotices';

/**
 * @typedef {object} UploadState
 * @property {boolean} isUploading - Whether upload is in progress
 * @property {number} expectedCount - Number of files expected in this batch
 */

/**
 * @typedef {object} DropZoneProps
 * @property {(mediaObjects: Array<object>) => void} [onSelectImages] - Callback when images are selected * @property {Array<object>} onSelectImages.mediaObjects - Selected media items
 * @property {(fileCount: number) => void} [onUploadStart] - Callback when upload starts
 * @property {(mediaObjects: Array<object>) => void} [onUploadComplete] - Callback when upload completes
 * @property {Array<object>} onUploadComplete.mediaObjects - Successfully uploaded items
 * @property {Array<string>} [allowedTypes=['image']] - Allowed media MIME type prefixes (e.g. 'image')
 */

/**
 * Media drop zone component with upload tracking and notifications
 *
 * Features:
 * - Tracks upload progress and state
 * - Shows contextual notifications
 * - Validates media readiness (requires id and non-blob URLs)
 * - Handles both success and error cases
 *
 * @param {DropZoneProps} props - Component properties
 * @returns {WPElement} - The DropZone component
 *
 * @example
 * <DropZone
 *   onSelectImages={(media) => console.log('Selected:', media)}
 *   onUploadStart={(count) => console.log('Starting:', count)}
 *   onUploadComplete={(media) => console.log('Completed:', media)}
 *   allowedTypes={['image']}
 * />
 *
 */
const DropZone = ({
	onSelectImages,
	onUploadStart,
	onUploadComplete,
	allowedTypes = ['image'],
}) => {
	const [uploadState, setUploadState] = useState({ isUploading: false, expectedCount: 0 });

	const { generateNoticeId, showNotice, dismissNotice } = useNotices();
	const uploadingNoticeId = useRef(null);

	/**
	 * Handles pre-upload setup:
	 * - Sets upload state
	 * - Shows uploading notice
	 * - Triggers onUploadStart callback
	 * @param {FileList} files - Files to be uploaded
	 */
	const handleFilesPreUpload = (files) => {
		setUploadState({ isUploading: true, expectedCount: files.length });

		const noticeType = 'info';
		const noticeMessage = `Subiendo ${files.length} archivo${files.length !== 1 ? 's' : ''}...`;
		const noticeId = generateNoticeId(noticeType, noticeMessage);
		uploadingNoticeId.current = noticeId;

		showNotice(noticeType, noticeMessage, {
			id: noticeId,
			isDismissible: false,
			type: 'snackbar',
		});

		if (onUploadStart) {
			onUploadStart(files.length);
		}
	};

	/**
	 * Handles media selection with comprehensive state tracking:
	 * - Validates media readiness (id, non-blob URL)
	 * - Manages upload completion state
	 * - Shows success/error notices
	 * - Triggers onSelectImages and onUploadComplete callbacks
	 * @param {Array<object>} mediaObjects - Selected media objects
	 */
	const handleSelect = (mediaObjects) => {
		if (onSelectImages) {
			onSelectImages(mediaObjects);
		}

		setUploadState((currentState) => {
			// Ensure we're in an active upload state and have the expected number of objects
			if (
				!currentState.isUploading ||
				!mediaObjects ||
				mediaObjects.length === 0 ||
				mediaObjects.length !== currentState.expectedCount
			) {
				return currentState;
			}

			// Check if ALL media objects meet the "fully ready" criteria:
			// - Have an 'id'
			// - Have a 'url'
			// - The 'url' does NOT start with 'blob:'
			const allItemsAreReady = mediaObjects.every(
				(obj) =>
					obj.id && // Has an ID
					obj.url && // Has a URL
					!obj.url.startsWith('blob:'), // URL is not a temporary blob
			);

			if (!allItemsAreReady) {
				// If even ONE item is not fully ready, we do nothing and return.
				// We wait for a subsequent `onSelect` call when all items are finalized.
				return currentState; // Keep current state as upload is still in progress
			}

			// --- If we reach here, ALL items in mediaObjects are fully ready. ---
			// This means we can now definitively determine success or failure for the batch.

			// Dismiss the "Uploading..." notice now that the process is conclusive
			if (uploadingNoticeId.current) {
				dismissNotice(uploadingNoticeId.current);
				uploadingNoticeId.current = null;
			}

			// The `mediaObjects` array at this point contains only fully ready items.
			// So, `mediaObjects.length` should equal `currentState.expectedCount` if all succeeded.
			// If it doesn't, it implies a failure for some previously expected items that never materialized.
			if (mediaObjects.length === currentState.expectedCount) {
				// Success path
				if (onUploadComplete) {
					onUploadComplete(mediaObjects); // Pass the now fully ready media objects
				}
				showNotice(
					'success',
					`Se subieron exitosamente ${mediaObjects.length} archivo${mediaObjects.length !== 1 ? 's' : ''}.`,
					{
						type: 'snackbar',
					},
				);
			} else {
				// Failure path: `allItemsAreReady` was true, but the count still doesn't match `expectedCount`.
				// This means something unexpected happened or some files were silently dropped/failed without a blob URL.
				// Given the `every()` check, this scenario is less likely if MediaPlaceholder is reliable.
				const failedCount = currentState.expectedCount - mediaObjects.length;
				// Show warning notice (deferred)
				showNotice(
					'warning',
					`Se subieron ${mediaObjects.length} de ${currentState.expectedCount} archivo${mediaObjects.length !== 1 ? 's' : ''}. ${failedCount} fallaron.`,
					{
						type: 'snackbar',
					},
				);
			}

			// Reset upload state regardless of success or failure
			return { isUploading: false, expectedCount: 0 };
		});
	};

	return (
		<>
			{uploadState.isUploading && (
				<div className="wp-block-enfantterrible-models-gallery__uploading-glass" />
			)}
			<MediaPlaceholder
				icon="format-gallery"
				accept={allowedTypes.map((t) => `${t}/*`).join(',')}
				multiple
				onFilesPreUpload={handleFilesPreUpload}
				onSelect={handleSelect}
				disableMediaButtons
			/>
		</>
	);
};

export default DropZone;
