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
				<p>Bajada</p>
			</div>
			<TextareaControl
				label="Bajada corta"
				value={shortDescription}
				onChange={setShortDescription}
			/>
			<TextareaControl
				label="Bajada larga"
				value={longDescription}
				onChange={setLongDescription}
			/>
		</div>
	);
};
