<?php
/**
 * GetHandler REST endpoint for retrieving templates for a given model.
 *
 * @package EnfantTerrible\Models\Rest\Endpoints\Templates
 */

namespace EnfantTerrible\Models\Rest\Endpoints\Templates;

use Monolog\Logger;
use EnfantTerrible\Models\Inc\LoggerFactory;
use EnfantTerrible\Models\Inc\Interfaces\ErrorHandlerInterface;
use EnfantTerrible\Models\Inc\Traits\ErrorHandlerTrait;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Handles GET requests for retrieving templates for a given model via REST API.
 */
class GetHandler implements ErrorHandlerInterface {

	use ErrorHandlerTrait;

	/**
	 * The logger instance.
	 *
	 * @var Logger
	 */
	private Logger $logger;

	/**
	 * Sets the logger instance with the given model name.
	 *
	 * @param string $model The model name.
	 */
	public function set_logger( string $model ): void {
		$this->logger = LoggerFactory::get_logger(
			'enfantterrible-models',
			"rest.templates.{$model}.get"
		);
	}

	/**
	 * Return the map of error scenarios this handler knows about.
	 *
	 * @return array<string, callable>
	 */
	public function get_error_scenarios(): array {
		return [
			'no_template'          => function ( array $context ) {
				$this->logger->error(
					"No template defined for model '{$context['model']}'.",
					$context
				);

				return new WP_Error(
					'no_template',
					"No template defined for model '{$context['model']}'",
					[
						'status'  => 404,
						'context' => $context,
					]
				);
			},
			'serialization_failed' => function ( array $context, ?\Throwable $exception = null ) {
				$this->logger->error(
					"Template serialization failed for '{$context['model']}': " .
					( $exception?->getMessage() ?? 'unknown' ),
					$context + [ 'exception' => $exception ]
				);

				return new WP_Error(
					'template_serialization_failed',
					"Failed to serialize template for model '{$context['model']}'.",
					[
						'status'    => 500,
						'context'   => $context,
						'exception' => $exception,
					]
				);
			},
		];
	}

	/**
	 * Handle GET request to retrieve a template.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response|WP_Error
	 */
	public function handle( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$model = $request->get_param( 'model' );

		if ( ! isset( $this->logger ) ) {
			$this->set_logger( $model );
		}

		$model_object = get_post_type_object( $model );

		if ( empty( $model_object->template ) ) {
			return $this->handle_error(
				'no_template',
				[
					'model' => $model,
					'route' => $request->get_route(),
					'user'  => get_current_user_id(),
				]
			);
		}

		try {
			$template = $model_object->template;
			$blocks   = array_map(
				fn( $block_config ) => \serialize_block(
					[
						'blockName'    => $block_config[0] ?? '',
						'attrs'        => $block_config[1] ?? [],
						'innerHTML'    => '',
						'innerContent' => [ '' ],
					]
				),
				$template
			);

			$rendered_template = implode( "\n\n", $blocks );

		} catch ( \Throwable $e ) {
			return $this->handle_error(
				'serialization_failed',
				[
					'model' => $model,
					'route' => $request->get_route(),
					'user'  => get_current_user_id(),
				],
				$e
			);
		}

		return new WP_REST_Response(
			[
				'success'    => true,
				'model'      => $model,
				'raw'        => $template,
				'serialized' => $rendered_template,
			],
			200
		);
	}
}
