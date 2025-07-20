<?php
/**
 * Gutenberg Blocks setup
 *
 * @package EnfantTerrible\Models\PostTypes\Fotoperiodismo\Inc
 */

namespace EnfantTerrible\Models\PostTypes\Fotoperiodismo\Inc;

use TenupFramework\Assets\GetAssetInfo;
use TenupFramework\Module;
use TenupFramework\ModuleInterface;

use EnfantTerrible\Models\Inc\LoggerFactory;
use Monolog\Logger;


/**
 * Blocks module.
 *
 * @package EnfantTerrible\Models\PostTypes\Fotoperiodismo\Inc
 */
class Blocks implements ModuleInterface {

	use Module;
	use GetAssetInfo;

	/**
	 * The model name.
	 *
	 * @var string
	 */
	private string $model_name;

	/**
	 * The model type.
	 *
	 * @var string
	 */
	private string $model_type;

	/**
	 * The logger instance.
	 *
	 * @var Logger
	 */
	private Logger $logger;

	/**
	 * Constructor for the Meta class.
	 *
	 * Initializes the model name, model type, and logger instance.
	 */
	public function __construct() {
		$this->model_name  = 'fotoperiodismo';
		$this->model_type  = 'post';
		$this->logger      = LoggerFactory::get_logger( 'enfantterrible-models', 'fotoperiodismo.blocks' );
		$this->blocks_path = ENFANTTERRIBLE_MODELS_DIST_PATH . '/blocks/post-types/' . $this->model_name . '/';
	}

	/**
	 * Can this module be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return false;
	}

	/**
	 * Register any hooks and filters.
	 *
	 * @return void
	 */
	public function register() {
		$this->setup_asset_vars(
			dist_path: ENFANTTERRIBLE_MODELS_DIST_PATH,
			fallback_version: ENFANTTERRIBLE_MODELS_VERSION
		);
		add_action( 'init', [ $this, 'register_models_blocks' ] );
	}

	/**
	 * Automatically registers all blocks located within this model's blocks path.
	 *
	 * @return void
	 */
	public function register_models_blocks() {
		if ( ! file_exists( $this->blocks_path ) ) {
			return;
		}

		$block_json_files = glob( $this->blocks_path . '**/block.json', GLOB_BRACE );
		$block_names      = [];

		if ( empty( $block_json_files ) ) {
			return;
		}

		foreach ( $block_json_files as $filename ) {
			$block_folder = dirname( $filename );
			$block        = register_block_type_from_metadata( $block_folder );

			if ( ! $block ) {
				continue;
			}

			$block_names[] = $block->name;
		}

		add_filter(
			'allowed_block_types_all',
			function ( array|bool $allowed_blocks, \WP_Block_Editor_Context $context ) use ( $block_names ): array|bool {
				$allowed_post_types = [ $this->model_name ];

				if ( ! isset( $context->post ) || ! in_array( $context->post->post_type, $allowed_post_types, true ) ) {
					return $allowed_blocks;
				}

				if ( true === $allowed_blocks ) {
					return array_merge(
						[], // Add core blocks here if desired
						$block_names
					);
				}

				if ( is_array( $allowed_blocks ) ) {
					return array_merge( $allowed_blocks, $block_names );
				}

				return $allowed_blocks;
			},
			10,
			2
		);
	}
}
