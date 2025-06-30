<?php
/**
 * Demo Post Type
 *
 * @package EnfantTerrible\Models\Fotoperiodismo
 */

declare(strict_types = 1);

namespace EnfantTerrible\Models\PostTypes\Fotoperiodismo;

use TenupFramework\PostTypes\AbstractPostType;

use EnfantTerrible\Models\Inc\CustomFieldRegistrar;

/**
 * Fotoperiodismo post type.
 */
class PostType extends AbstractPostType {

	/**
	 * Get the post type name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'fotoperiodismo';
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
		return true;
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
	 * Run any code after the post type has been registered.
	 *
	 * @return void
	 */
	public function after_register() {
		// Register any hooks/filters you need.
		add_action(
			'init',
			function () {
				CustomFieldRegistrar::register_many(
					'post',
					[
						'et_models_fotoperiodismo_images'  => [
							'object_subtype' => $this->get_name(),
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
							'object_subtype' => $this->get_name(),
							'type'           => 'string',
							'single'         => true,
							'description'    => 'Descripción corta.',
							'show_in_rest'   => true,
							'default'        => '',
						],
						'et_models_fotoperiodismo_desc_long' => [
							'object_subtype' => $this->get_name(),
							'type'           => 'string',
							'single'         => true,
							'description'    => 'Descripción larga.',
							'show_in_rest'   => true,
							'default'        => '',
						],
						'et_models_fotoperiodismo_authors' => [
							'object_subtype'    => $this->get_name(),
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
										'required' => [ 'name', 'url' ],
									],
								],
							],
							'sanitize_callback' => function ( $value ) {
								if ( ! is_array( $value ) ) {
									return [];
								}

								return array_values( array_filter( array_map(
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
								) ) );
							},
							'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
						],
					]
				);
			}
		);
	}
}
