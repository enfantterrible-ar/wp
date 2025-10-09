<?php
/**
 * Controller.php
 *
 * REST API controller for template endpoints in EnfantTerrible models.
 *
 * @package EnfantTerrible\Models\Rest\Endpoints\Templates
 */

namespace EnfantTerrible\Models\Rest\Endpoints\Templates;

use TenupFramework\Module;
use TenupFramework\ModuleInterface;
use EnfantTerrible\Models\Inc\LoggerFactory;
use EnfantTerrible\Models\Rest\Endpoints\Templates\GetHandler;
use EnfantTerrible\Models\Inc\Interfaces\ErrorHandlerInterface;
use EnfantTerrible\Models\Inc\Traits\ErrorHandlerTrait;
use Monolog\Logger;

/**
 * REST Controller for template endpoints.
 *
 * Handles registration of REST API routes for supported models and permission checks.
 */
class Controller implements ModuleInterface, ErrorHandlerInterface {
	use Module;
	use ErrorHandlerTrait;

	/**
	 * The logger instance.
	 *
	 * @var Logger
	 */
	private Logger $logger;

	/**
	 * Supported models.
	 *
	 * @var array
	 */
	private array $supported_models = [
		'fotoperiodismo',
	];

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->logger = LoggerFactory::get_logger( 'enfantterrible-models', 'rest.templates' );
	}

	/**
	 * Can this module be registered?
	 *
	 * @return bool
	 */
	public function can_register(): bool {
		return false;
	}

	/**
	 * Register any hooks and filters.
	 *
	 * @return void
	 */
	public function register(): void {
		add_action( 'rest_api_init', [ $this, 'register_template_endpoints' ] );
	}

	/**
	 * Register the template endpoints.
	 *
	 * @return void
	 */
	public function register_template_endpoints(): void {

		$get_handler = new GetHandler();

		register_rest_route(
			'enfantterrible-models/v1',
			'/templates/(?P<model>\w+)',
			[
				'methods'             => 'GET',
				'callback'            => [ $get_handler, 'handle' ],
				'permission_callback' => [ $this, 'check_permissions' ],
				'args'                => [
					'model' => [
						'validate_callback' => [ $this, 'validate_model' ],
						'sanitize_callback' => 'sanitize_key',
						'required'          => true,
					],
				],
			]
		);
	}

	/**
	 * Validate the model parameter.
	 *
	 * @param string           $param   The model parameter.
	 * @param \WP_REST_Request $request The request object.
	 *
	 * @return bool
	 */
	public function validate_model( $param, \WP_REST_Request $request ): bool|\WP_Error {
		$model              = $param;
		$is_model_supported = in_array( $model, $this->supported_models, true );
		$model_exists       = get_post_type_object( $model );

		if ( ! $is_model_supported || ! $model_exists ) {
			return $this->handle_error(
				'invalid_model',
				[
					'model' => $model,
					'route' => $request->get_route(),
					'user'  => get_current_user_id(),
				]
			);
		}

		return true; // REST validation callbacks must return bool
	}

	/**
	 * Checks if the current user has permission to view the requested model template.
	 *
	 * @param \WP_REST_Request $request The request object.
	 *
	 * @return bool|WP_Error Returns true if the user has permission, or a WP_Error object if not.
	 */
	public function check_permissions( $request ) {
		$model = $request->get_param( 'model' );

		$model_object = get_post_type_object( $model );

		if ( ! current_user_can( $model_object->cap->edit_posts ) ) {
			return $this->handle_error(
				'insufficient_permissions',
				[
					'model' => $model,
					'route' => $request->get_route(),
					'user'  => get_current_user_id(),
				]
			);
		}

		return true;
	}

	/**
	 * Returns an array of error scenarios with their handlers.
	 *
	 * @return array
	 */
	public function get_error_scenarios(): array {
		return [
			'invalid_model'            => function ( array $context ) {
				$this->logger->error(
					"Invalid model '{$context['model']}' requested.",
					$context
				);

				return new \WP_Error(
					'invalid_model',
					"Model '{$context['model']}' is not supported or does not exist.",
					[
						'status'  => 400,
						'context' => $context,
					]
				);
			},
			'insufficient_permissions' => function ( array $context ) {
				$this->logger->error(
					"User {$context['user']} lacks permissions for model '{$context['model']}'.",
					$context
				);

				return new \WP_Error(
					'insufficient_permissions',
					'You do not have permission to view this model template',
					[
						'status'  => 403,
						'context' => $context,
					]
				);
			},
		];
	}
}
