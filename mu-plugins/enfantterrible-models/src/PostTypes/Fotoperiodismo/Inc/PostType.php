<?php
/**
 * Demo Post Type
 *
 * @package EnfantTerrible\Models\PostTypes\Fotoperiodismo\Inc
 */

declare(strict_types = 1);

namespace EnfantTerrible\Models\PostTypes\Fotoperiodismo\Inc;

use TenupFramework\PostTypes\AbstractPostType;

use EnfantTerrible\Models\Inc\CustomFieldRegistrar;

use EnfantTerrible\Models\Inc\LoggerFactory;
use Monolog\Logger;

/**
 * Fotoperiodismo post type.
 */
class PostType extends AbstractPostType {

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
	 * The model options.
	 *
	 * @var array
	 */
	private array $model_options = [];

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
	 *
	 * @return void
	 */
	public function __construct() {
		$this->model_name = 'fotoperiodismo';
		$this->model_type = 'post';
		$this->logger     = LoggerFactory::get_logger( 'enfantterrible-models', 'fotoperiodismo.postType' );
	}

	/**
	 * Get the post type name.
	 *
	 * @return string
	 */
	public function get_name() {
		return $this->model_name;
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function get_singular_label() {
		return esc_html__( 'Fotogalería', 'enfantterrible-models' );
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function get_plural_label() {
		return esc_html__( 'Fotogalerías', 'enfantterrible-models' );
	}

	/**
	 * Get the menu icon for the post type.
	 *
	 * This can be a base64 encoded SVG, a dashicons class or 'none' to leave it empty so it can be filled with CSS.
	 *
	 * @see https://developer.wordpress.org/resource/dashicons/
	 *
	 * @return string
	 */
	public function get_menu_icon() {
		return 'dashicons-camera';
	}

	/**
	 * Can the class be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return false;
	}

	/**
	 * Returns the default supported taxonomies. The subclass should declare the
	 * Taxonomies that it supports here if required.
	 *
	 * @return array<string>
	 */
	public function get_supported_taxonomies() {
		return [
			'tenup-tax-demo',
		];
	}

	/**
	 * Default post type supported feature names.
	 *
	 * @return array<string>
	 */
	public function get_editor_supports() {
		$supports = [
			'title',
			'editor',
			'author',
			'thumbnail',
			'excerpt',
			'revisions',
			'custom-fields',
		];

		return $supports;
	}

	/**
	 * Merge the parent options with the model options.
	 *
	 * @return array<string, mixed> The merged options.
	 */
	public function get_options(): array {
		$options = parent::get_options();
		$options = array_merge(
			$options,
			$this->model_options
		);
		return $options;
	}

	/**
	 * Merge the given model options with the default options.
	 *
	 * The method merges the given model options with the default options
	 * and returns the merged array.
	 *
	 * @param array $args The model options to merge.
	 *
	 * @return array The merged model options.
	 */
	public function set_model_options( array $args ): array {
		if ( ! isset( $args['template'] ) ) {
			$this->logger->info( 'Called set_model_options() without template, using default options.' );
			return $args;
		}

		if ( ! isset( $args['template_lock'] ) ) {
			$this->logger->info( 'Called set_model_options() without template_lock, using default options.' );
			return $args;
		}

		$this->model_options = array_merge( $this->model_options, $args );

		return $this->model_options;
	}

	/**
	 * Register the post type.
	 *
	 * @return void
	 */
	// phpcs:ignore Generic.CodeAnalysis.UselessOverridingMethod.Found, Squiz.Commenting.FunctionComment.Missing -- Explicit override for registration control.
	public function register() {
		parent::register();
	}
}
