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
					'object_subtype'    => $model_name,
					'type'              => 'object',
					'single'            => true,
					'description'       => __( 'Object of images.', 'enfantterrible-models' ),
					'show_in_rest'      => [
						'schema' => [
							'type'       => 'object',
							'properties' => [
								'images'      => [
									'type'        => 'array',
									'description' => 'Array of image objects with display data',
									'items'       => [
										'type'       => 'object',
										'properties' => [
											'key'   => [
												'type' => 'string',
												'description' => 'Unique identifier for the image in the gallery (e.g., "img-1")',
											],
											'url'   => [
												'type'   => 'string',
												'format' => 'uri',
												'description' => 'Full URL to the image file',
											],
											'alt'   => [
												'type'    => 'string',
												'description' => 'Alt text for the image',
												'default' => '',
											],
											'title' => [
												'type'    => 'string',
												'description' => 'Title/caption for the image',
												'default' => '',
											],
											'id'    => [
												'type' => 'integer',
												'description' => 'WordPress media attachment ID',
											],
											'size'  => [
												'type' => 'object',
												'properties' => [
													'width'  => [
														'type' => 'integer',
													],
													'height' => [
														'type' => 'integer',
													],
												],
											],
										],
										'required'   => [ 'id', 'url', 'key', 'size' ],
									],
									'default'     => [],
								],
								'layouts'     => [
									'type'       => 'object',
									'properties' => [
										'lg'  => [
											'type'  => 'array',
											'items' => [
												'type' => 'object',
												'properties' => [
													'i'    => [ 'type' => 'string' ],
													'x'    => [ 'type' => 'integer' ],
													'y'    => [ 'type' => 'integer' ],
													'w'    => [ 'type' => 'integer' ],
													'h'    => [ 'type' => 'integer' ],
													'minW' => [ 'type' => 'integer' ],
													'minH' => [ 'type' => 'integer' ],
													'maxW' => [ 'type' => 'integer' ],
													'maxH' => [ 'type' => 'integer' ],
													'static' => [ 'type' => 'boolean' ],
													'moved' => [ 'type' => 'boolean' ],
												],
											],
										],
										'md'  => [
											'type'  => 'array',
											'items' => [
												'type' => 'object',
												'properties' => [
													'i'    => [ 'type' => 'string' ],
													'x'    => [ 'type' => 'integer' ],
													'y'    => [ 'type' => 'integer' ],
													'w'    => [ 'type' => 'integer' ],
													'h'    => [ 'type' => 'integer' ],
													'minW' => [ 'type' => 'integer' ],
													'minH' => [ 'type' => 'integer' ],
													'maxW' => [ 'type' => 'integer' ],
													'maxH' => [ 'type' => 'integer' ],
													'static' => [ 'type' => 'boolean' ],
													'moved' => [ 'type' => 'boolean' ],
												],
											],
										],
										'sm'  => [
											'type'  => 'array',
											'items' => [
												'type' => 'object',
												'properties' => [
													'i'    => [ 'type' => 'string' ],
													'x'    => [ 'type' => 'integer' ],
													'y'    => [ 'type' => 'integer' ],
													'w'    => [ 'type' => 'integer' ],
													'h'    => [ 'type' => 'integer' ],
													'minW' => [ 'type' => 'integer' ],
													'minH' => [ 'type' => 'integer' ],
													'maxW' => [ 'type' => 'integer' ],
													'maxH' => [ 'type' => 'integer' ],
													'static' => [ 'type' => 'boolean' ],
													'moved' => [ 'type' => 'boolean' ],
												],
											],
										],
										'xs'  => [
											'type'  => 'array',
											'items' => [
												'type' => 'object',
												'properties' => [
													'i'    => [ 'type' => 'string' ],
													'x'    => [ 'type' => 'integer' ],
													'y'    => [ 'type' => 'integer' ],
													'w'    => [ 'type' => 'integer' ],
													'h'    => [ 'type' => 'integer' ],
													'minW' => [ 'type' => 'integer' ],
													'minH' => [ 'type' => 'integer' ],
													'maxW' => [ 'type' => 'integer' ],
													'maxH' => [ 'type' => 'integer' ],
													'static' => [ 'type' => 'boolean' ],
													'moved' => [ 'type' => 'boolean' ],
												],
											],
										],
										'xxs' => [
											'type'  => 'array',
											'items' => [
												'type' => 'object',
												'properties' => [
													'i'    => [ 'type' => 'string' ],
													'x'    => [ 'type' => 'integer' ],
													'y'    => [ 'type' => 'integer' ],
													'w'    => [ 'type' => 'integer' ],
													'h'    => [ 'type' => 'integer' ],
													'minW' => [ 'type' => 'integer' ],
													'minH' => [ 'type' => 'integer' ],
													'maxW' => [ 'type' => 'integer' ],
													'maxH' => [ 'type' => 'integer' ],
													'static' => [ 'type' => 'boolean' ],
													'moved' => [ 'type' => 'boolean' ],
												],
											],
										],
									],
								],
								'lastUpdated' => [
									'type'        => [ 'integer', 'null' ],
									'description' => 'Unix timestamp of last update',
									'default'     => null,
								],
							],
							'default'    => [
								'images'      => [],
								'layouts'     => [
									'lg'  => [],
									'md'  => [],
									'sm'  => [],
									'xs'  => [],
									'xxs' => [],
								],
								'lastUpdated' => null,
							],
						],
					],
					'auth_callback'     => function () {
						return current_user_can( 'edit_posts' );
					},
					'sanitize_callback' => [ $this, 'sanitize_gallery_data' ],
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
									'id'   => [ 'type' => 'string' ],
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
								'required'   => [ 'id','name', 'url' ],
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
											'id'   => isset( $author['id'] ) ? sanitize_text_field( $author['id'] ) : '',
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

	/**
	 * Sanitize gallery data before saving
	 */
	private function sanitize_gallery_data( $value ) {
		if ( ! is_array( $value ) && ! is_object( $value ) ) {
			return [
				'images'      => [],
				'layouts'     => (object) [],
				'lastUpdated' => null,
			];
		}

		$value = (array) $value;

		// Ensure required keys exist
		$sanitized = [
			'images'      => isset( $value['images'] ) ? $this->sanitize_images_array( $value['images'] ) : [],
			'layouts'     => isset( $value['layouts'] ) ? $this->sanitize_layouts_object( $value['layouts'] ) : (object) [],
			'lastUpdated' => isset( $value['lastUpdated'] ) ? ( is_numeric( $value['lastUpdated'] ) ? intval( $value['lastUpdated'] ) : null ) : null,
		];

		return $sanitized;
	}

	/**
	 * Sanitize images array
	 */
	private function sanitize_images_array( $images ) {
		if ( ! is_array( $images ) ) {
			return [];
		}

		$sanitized = [];
		foreach ( $images as $image ) {
			if ( ! is_array( $image ) && ! is_object( $image ) ) { continue;
			}

			$image       = (array) $image;
			$sanitized[] = [
				'key'   => sanitize_text_field( $image['key'] ?? '' ),
				'url'   => esc_url_raw( $image['url'] ?? '' ),
				'alt'   => sanitize_text_field( $image['alt'] ?? '' ),
				'title' => sanitize_text_field( $image['title'] ?? '' ),
				'id'    => absint( $image['id'] ?? 0 ), // Using absint for positive integers
				'size'  => [
					'width'  => absint( $image['size']['width'] ?? 0 ),
					'height' => absint( $image['size']['height'] ?? 0 ),
				],
			];
		}

		return $sanitized;
	}

	/**
	 * Sanitize layouts object
	 */
	public function sanitize_layouts_object( $layouts ) {
		if ( ! is_array( $layouts ) && ! is_object( $layouts ) ) {
			return (object) [];
		}

		$layouts   = (array) $layouts;
		$sanitized = [];

		foreach ( $layouts as $key => $layout_array ) {
			// Ensure $layout_array is an array before iterating through it
			if ( ! is_array( $layout_array ) ) {
				continue;
			}

			$sanitized_layout_array = [];
			foreach ( $layout_array as $layout_item ) {
				if ( ! is_array( $layout_item ) && ! is_object( $layout_item ) ) {
					continue;
				}
				$layout_item = (array) $layout_item;

				$sanitized_layout_array[] = [
					'i'      => sanitize_text_field( $layout_item['i'] ?? '' ),
					'x'      => intval( $layout_item['x'] ?? 0 ), // X can be 0 or positive, no need for absint
					'y'      => intval( $layout_item['y'] ?? 0 ), // Y can be 0 or positive, no need for absint
					'w'      => absint( $layout_item['w'] ?? 1 ), // Width should be non-negative
					'h'      => absint( $layout_item['h'] ?? 1 ), // Height should be non-negative
					'minW'   => absint( $layout_item['minW'] ?? 2 ), // Min width should be non-negative
					'minH'   => absint( $layout_item['minH'] ?? 2 ), // Min height should be non-negative
					'maxW'   => absint( $layout_item['maxW'] ?? 99999 ), // Max width should be non-negative
					'maxH'   => absint( $layout_item['maxH'] ?? 99999 ), // Max height should be non-negative
					'static' => (bool) ( $layout_item['static'] ?? false ), // Cast to boolean
					'moved'  => (bool) ( $layout_item['moved'] ?? false ),  // Cast to boolean
				];
			}
			// Sanitize the key for the layout (e.g., 'lg', 'md')
			$sanitized[ sanitize_key( $key ) ] = $sanitized_layout_array;
		}

		return (object) $sanitized;
	}
}
