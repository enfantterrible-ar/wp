<?php
/**
 * REST API setup
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
 * Rest module.
 *
 * @package EnfantTerrible\Models\PostTypes\Fotoperiodismo\Inc
 */
class Rest implements ModuleInterface {

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
	 * Constructor for the Blocks class.
	 *
	 * Initializes the model name, model type, and logger instance.
	 */
	public function __construct() {
		$this->model_name = 'fotoperiodismo';
		$this->model_type = 'post';
		$this->logger     = LoggerFactory::get_logger( 'enfantterrible-models', 'fotoperiodismo.rest' );
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
		add_filter( 'rest_prepare_fotoperiodismo', [ $this, 'expose_carbon_fields' ], 10, 3 );
	}

	/**
	 * Expose Carbon Fields data via the REST API.
	 *
	 * This filters the `rest_prepare_fotoperiodismo` response to include Carbon Fields data.
	 *
	 * @param WP_REST_Response $response The response object.
	 * @param WP_Post          $post     The post object.
	 * @param WP_REST_Request  $request  The request object.
	 *
	 * @return WP_REST_Response
	 */
	public function expose_carbon_fields( $response, $post, $request ) {
		$field_map = [
			'_crb_enfantterrible_fotoperiodismo_gallery'   => [
				'type'   => 'repeater',
				'subkey' => 'value',
			],
			'_crb_enfantterrible_fotoperiodismo_authors'   => [
				'type'      => 'complex_repeater',
				'subfields' => [ 'nombre', 'link' ],
			],
			'_crb_enfantterrible_fotoperiodismo_desc_short' => [ 'type' => 'single' ],
			'_crb_enfantterrible_fotoperiodismo_desc_long' => [ 'type' => 'single' ],
		];

		$meta = get_post_meta( $post->ID );
		$data = $response->data['meta'] ?? [];

		foreach ( $field_map as $base_key => $config ) {
			switch ( $config['type'] ) {
				case 'single':
					$data[ $base_key ] = maybe_unserialize( $meta[ $base_key ][0] ?? '' );
					break;

				case 'repeater':
					// Flat array: _crb_gallery|||0|value
					$items = [];
					foreach ( $meta as $key => $value ) {
						if ( preg_match( '/^' . preg_quote( $base_key, '/' ) . '\|\|\|(\d+)\|' . preg_quote( $config['subkey'], '/' ) . '$/', $key, $m ) ) {
							$items[ (int) $m[1] ] = $value[0] ?? null;
						}
					}
					ksort( $items );
					$data[ $base_key ] = array_values( $items );
					break;

				case 'complex_repeater':
					$items = [];
					foreach ( $config['subfields'] as $subfield ) {
						foreach ( $meta as $key => $value ) {
							if ( preg_match(
								'/^' . preg_quote( $base_key, '/' ) . '\|' . preg_quote( $subfield, '/' ) . '\|(\d+)\|\d+\|value$/',
								$key,
								$m
							) ) {
								$items[ (int) $m[1] ][ $subfield ] = $value[0] ?? null;
							}
						}
					}
					ksort( $items );
					$data[ $base_key ] = array_values( $items );
					break;
			}
		}

		$response->data['meta'] = $data;

		return $response;
	}
}
