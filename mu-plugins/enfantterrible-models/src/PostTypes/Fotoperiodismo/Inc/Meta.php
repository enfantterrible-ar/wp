<?php
/**
 * Fotoperiodismo post type meta registration.
 *
 * @package EnfantTerrible\Models\Fotoperiodismo\Inc
 */

declare(strict_types = 1);

namespace EnfantTerrible\Models\PostTypes\Fotoperiodismo\Inc;

use TenupFramework\ModuleInterface;
use TenupFramework\Module;

use EnfantTerrible\Models\Inc\CustomFieldRegistrar;

use EnfantTerrible\Models\Inc\LoggerFactory;
use Monolog\Logger;

/**
 * Fotoperiodismo meta registration.
 */
class Meta implements ModuleInterface {

	use Module;

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
		$this->model_name = 'fotoperiodismo';
		$this->model_type = 'post';
		$this->logger     = LoggerFactory::get_logger( 'enfantterrible-models', 'fotoperiodismo.meta' );
	}
	/**
	 * Used to alter the order in which clases are initialized.
	 *
	 * Lower number will be initialized first.
	 *
	 * @note This has no correlation to the `init` priority. It's just a way to allow certain classes to be initialized before others.
	 *
	 * @return int The priority of the module.
	 */
	public function load_order(): int {
		return 5;
	}

	/**
	 * Checks if the module can be registered.
	 *
	 * This module is always registered, so we return true.
	 * If you want to conditionally register it, you can add logic here.
	 * For example, you could check if the post type is registered.
	 *
	 * Example:
	 * if ( ! post_type_exists( 'fotoperiodismo' ) ) {
	 *     return false;
	 * }
	 *
	 * @return bool
	 */
	public function can_register(): bool {
		return false;
	}

	/**
	 * Connects the Module with WordPress using Hooks and/or Filters.
	 *
	 * This method registers custom fields for the Fotoperiodismo post type.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'init', [ $this, 'register_fields' ], 10, 0 );
	}

	/**
	 * Registers custom fields for the Fotoperiodismo post type.
	 *
	 * This method uses the CustomFieldRegistrar to register multiple fields
	 * for the Fotoperiodismo post type.
	 *
	 * @return void
	 */
	public function register_fields() {

		$model_type = $this->model_type;
		$model_name = $this->model_name;

		if ( empty( $model_type ) || empty( $model_name ) ) {
			$this->logger->error(
				'Model type or name is empty.',
				[
					'model_type' => $model_type,
					'model_name' => $model_name,
				]
			);
			return;
		}

		CustomFieldRegistrar::register_many(
			$model_type,
			[
				'et_models_fotoperiodismo_images'     => [
					'object_subtype' => $model_name,
					'type'           => 'array',
					'single'         => true,
					'description'    => __( 'Array of image URLs.', 'enfantterrible-models' ),
					'show_in_rest'   => [
						'schema' => [
							'type'  => 'array',
							'items' => [ 'type' => 'string' ],
						],
					],
					'default'        => [],
				],
				'et_models_fotoperiodismo_desc_short' => [
					'object_subtype' => $model_name,
					'type'           => 'string',
					'single'         => true,
					'description'    => 'Descripción corta.',
					'show_in_rest'   => true,
					'default'        => '',
				],
				'et_models_fotoperiodismo_desc_long'  => [
					'object_subtype' => $model_name,
					'type'           => 'string',
					'single'         => true,
					'description'    => 'Descripción larga.',
					'show_in_rest'   => true,
					'default'        => '',
				],
				'et_models_fotoperiodismo_authors'    => [
					'object_subtype'    => $model_name,
					'type'              => 'array',
					'single'            => true,
					'description'       => 'An array of author objects with name and url',
					'show_in_rest'      => [
						'schema' => [
							'type'  => 'array',
							'items' => [
								'type'       => 'object',
								'properties' => [
									'name' => [
										'type'        => 'string',
										'description' => 'The author name',
									],
									'url'  => [
										'type'        => 'string',
										'format'      => 'uri',
										'description' => 'The author link URL',
									],
								],
								'required'   => [ 'name', 'url' ],
							],
						],
					],
					'sanitize_callback' => function ( $value ) {
						if ( ! is_array( $value ) ) {
							return [];
						}

						return array_values(
							array_filter(
								array_map(
									function ( $author ) {
										if ( ! is_array( $author ) ) {
											return null;
										}
										return [
											'name' => isset( $author['name'] ) ? sanitize_text_field( $author['name'] ) : '',
											'url'  => isset( $author['url'] ) ? esc_url_raw( $author['url'] ) : '',
										];
									},
									$value
								)
							)
						);
					},
					'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
				],
			]
		);
	}
}
