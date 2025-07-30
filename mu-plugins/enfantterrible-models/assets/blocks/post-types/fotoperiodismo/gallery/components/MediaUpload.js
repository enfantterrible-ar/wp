// components/MediaUpload.js
import { MediaPlaceholder } from '@wordpress/block-editor';
import { WPElement } from '@wordpress/element';

/**
 * @typedef {object} MediaUploadProps
 * @property {(media: Array<object>) => void} onSelectImages - Callback when images are selected
 * @property {() => void} [onCloseUpload] - Callback when uploader is closed
 * @property {object} [props] - Additional props passed to MediaPlaceholder
 */

/**
 * Custom media upload component wrapping WordPress' MediaPlaceholder
 *
 * @description
 * - Pre-configured for gallery image uploads (accept="image/*")
 * - Supports multiple file selection
 * - Uses Spanish language labels by default
 * - Disables built-in drop zone (for use with custom drop zone implementation)
 * - Forwards all additional props to underlying MediaPlaceholder
 *
 * @param {MediaUploadProps} props - Component properties
 * @returns {WPElement} Configured MediaPlaceholder component
 *
 * @example
 * // Basic usage with required callback
 * <MediaUpload onSelectImages={(media) => handleSelection(media)} />
 *
 * @example
 * // With all callbacks
 * <MediaUpload
 *   onSelectImages={(media) => console.log('Selected:', media.length, 'images')}
 *   onCloseUpload={() => setUploaderOpen(false)}
 * />
 */
const MediaUpload = ({ onSelectImages, onCloseUpload, ...props }) => {
	return (
		<MediaPlaceholder
			icon="format-gallery"
			labels={{
				title: 'Subir Imagenes',
				instructions:
					'Puede subir imágenes manualmente, buscar en la Biblioteca de medios, o arrastrando y soltando una imagen en la sección inferior.',
			}}
			accept="image/*"
			className="wp-block-enfantterrible-models-gallery__uploader"
			multiple
			onSelect={onSelectImages}
			onClose={onCloseUpload}
			disableDropZone
			{...props}
		/>
	);
};

export default MediaUpload;
