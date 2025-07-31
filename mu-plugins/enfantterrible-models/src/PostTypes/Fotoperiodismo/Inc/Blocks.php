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
	 * The model blocks path.
	 *
	 * @var string
	 */
	private string $blocks_path;

	/**
	 * The blocks object, containing its metadata via block.json declaration.
	 *
	 * @var array
	 */
	private array $blocks;

	/**
	 * Constructor for the Blocks class.
	 *
	 * Initializes the model name, model type, and logger instance.
	 */
	public function __construct() {
		$this->model_name  = 'fotoperiodismo';
		$this->model_type  = 'post';
		$this->logger      = LoggerFactory::get_logger( 'enfantterrible-models', 'fotoperiodismo.blocks' );
		$this->blocks_path = untrailingslashit( ENFANTTERRIBLE_MODELS_DIST_PATH ) . '/blocks/post-types/' . $this->model_name . '/';
		$this->blocks      = $this->set_model_blocks();
	}

	/**
	 * Can this module be registered?
	 *
	 * @return bool
	 */
	public function can_register(): bool {
			// This module is not intended for auto-registration via the framework.
		// Its 'register' method is called directly by a Controller class.
		return false;
	}

	/**
	 * Register any hooks and filters.
	 *
	 * @return void
	 */
	public function register(): void {
		$this->setup_asset_vars(
			dist_path: ENFANTTERRIBLE_MODELS_DIST_PATH,
			fallback_version: ENFANTTERRIBLE_MODELS_VERSION
		);
		add_action( 'init', [ $this, 'register_model_blocks' ] );
		add_action( 'init', [ $this, 'set_model_blocks_template' ] );
		add_action( 'init', [ $this, 'set_model_allowed_blocks' ] );
	}

	/**
	 * Automatically registers all blocks located within this model's blocks path.
	 *
	 * @return void
	 */
	public function register_model_blocks(): void {
		$blocks = $this->blocks;

		foreach ( $blocks as $block ) {
			$block_path   = ENFANTTERRIBLE_MODELS_PATH . $block['relative_path'];
			$block_folder = dirname( $block_path );
			$block        = register_block_type_from_metadata( $block_folder );

			if ( ! $block ) {
				$this->logger->error( 'Error registering block.', [ 'block_folder' => $block_folder ] );
			}
		}
	}

	/**
	 * Modifies the allowed block types for the Fotoperiodismo post type,
	 * allowing only the blocks registered by this module.
	 *
	 * @return void
	 */
	public function set_model_allowed_blocks(): void {
		$blocks_names = array_keys( $this->blocks );
		add_filter(
			'allowed_block_types_all',
			function ( array|bool $allowed_blocks, \WP_Block_Editor_Context $context ) use ( $blocks_names ): array|bool {
				$allowed_post_types = [ $this->model_name ];

				if ( ! isset( $context->post ) || ! in_array( $context->post->post_type, $allowed_post_types, true ) ) {
					return $allowed_blocks;
				}

				if ( true === $allowed_blocks ) {
					return array_merge(
						[], // Placeholder for adding a list of core blocks if desired.
						$blocks_names
					);
				}

				if ( is_array( $allowed_blocks ) ) {
					return array_merge( $allowed_blocks, $blocks_names );
				}

				return $allowed_blocks;
			},
			10,
			2
		);
	}

	/**
	 * Sets the default block template for the Fotoperiodismo post type.
	 *
	 * The template is built by iterating over the model's blocks, while excluding
	 * specific blocks from the template.
	 *
	 * @return void
	 */
	public function set_model_blocks_template(): void {
		$post_type_object = get_post_type_object( $this->model_name );
		$blocks_names     = array_keys( $this->blocks );

		// Blocks to exclude, stored in an array
		$excluded_blocks = [
			'enfantterrible-models/authors-item',
		];

		// Create the template array
		$template_blocks = array();
		foreach ( $blocks_names as $block_name ) {
			// Check if the current block name is in the excluded array
			if ( ! in_array( $block_name, $excluded_blocks ) ) {
				// Add the block to the template if it's not excluded
				$template_blocks[] = array( $block_name, array() );
			}
		}

		$post_type_object->template      = $template_blocks;
		$post_type_object->template_lock = 'all'; // Optional
	}


	/**
	 * Builds an array of model blocks metadata.
	 *
	 * @return array An associative array where keys are block names (string)
	 * and values are arrays containing the following keys:
	 * - 'relative_path' (string): The relative path to the block folder.
	 * - 'metadata' (object): The JSON-decoded block metadata.
	 */
	private function set_model_blocks(): array {
		$blocks_json_files = $this->get_model_blocks_json_files();

		if ( empty( $blocks_json_files ) ) {
			return [];
		}

		$blocks = [];

		foreach ( $blocks_json_files as $block_json ) {
			$block_content = file_get_contents( $block_json );

			if ( ! $block_content ) {
				$this->logger->error( 'Could not read block.json or file is empty.', [ 'file' => $block_json ] );
				continue;
			}

			$block_metadata  = json_decode( $block_content );
			$block_json_path = str_replace( ENFANTTERRIBLE_MODELS_PATH, '', $block_json );

			// Add JSON validation
			if ( json_last_error() !== JSON_ERROR_NONE || ! isset( $block_metadata->name ) ) {
				$this->logger->error( 'Invalid block.json', [ 'file' => $block_json ] );
				continue;
			}

			$blocks[ $block_metadata->name ] = [
				'relative_path' => $block_json_path,
				'metadata'      => $block_metadata,
			];
		}

		return $blocks;
	}

	/**
	 * Get an array of file paths to all block.json files in the blocks path.
	 *
	 * @return array File paths to block.json files, or an empty array on error.
	 */
	private function get_model_blocks_json_files(): array {

		$block_json_files = glob( $this->blocks_path . '**/block.json', GLOB_BRACE );

		if ( ! $block_json_files ) {
			$this->logger->error( 'No blocks found or path is invalid.', [ 'block_json_files' => $block_json_files ] );
			return [];
		}

		return $block_json_files;
	}
}
