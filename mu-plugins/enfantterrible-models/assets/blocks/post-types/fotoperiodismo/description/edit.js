import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextareaControl } from '@wordpress/components';

import { usePostMetaValue } from '@10up/block-components';

export const BlockEdit = () => {
	const props = useBlockProps();

	const [shortDescription, setShortDescription] = usePostMetaValue(
		'et_models_fotoperiodismo_desc_short',
	);

	const [longDescription, setLongDescription] = usePostMetaValue(
		'et_models_fotoperiodismo_desc_long',
	);

	return (
		<div {...props}>
			<div className="wp-block-enfantterrible-models-description-header">
				<p>{__('Bajada', 'enfantterrible-models')}</p>
			</div>
			<TextareaControl
				label={__('Bajada corta', 'enfantterrible-models')}
				value={shortDescription}
				onChange={setShortDescription}
			/>
			<TextareaControl
				label={__('Bajada larga', 'enfantterrible-models')}
				value={longDescription}
				onChange={setLongDescription}
			/>
		</div>
	);
};
