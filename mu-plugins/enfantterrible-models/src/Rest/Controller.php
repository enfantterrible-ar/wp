<?php
/**
 * Main plugin REST API handler
 *
 * @package EnfantTerrible\Models\Inc
 */

namespace EnfantTerrible\Models\Rest;

use EnfantTerrible\Models\Rest\Endpoints\Templates\Controller as TemplatesEndpoint;

use TenupFramework\Module;
use TenupFramework\ModuleInterface;
use EnfantTerrible\Models\Inc\LoggerFactory;
use Monolog\Logger;

/**
 * Main REST API handler for all models.
 *
 * @package EnfantTerrible\Models\Inc
 */
class Controller implements ModuleInterface {
	use Module;

	/**
	 * The logger instance.
	 *
	 * @var Logger
	 */
	private Logger $logger;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->logger = LoggerFactory::get_logger( 'enfantterrible-models', 'rest' );
	}

	/**
	 * Can this module be registered?
	 *
	 * @return bool
	 */
	public function can_register(): bool {
		return true; // This should be auto-registered
	}

	/**
	 * Register any hooks and filters.
	 *
	 * @return void
	 */
	public function register(): void {
		$endpoints = $this->get_endpoints();
		foreach ( $endpoints as $endpoint ) {
			$endpoint->register();
		}
	}

	/**
	 * Get an array of endpoints to register.
	 *
	 * @return array An array of endpoints to register.
	 */
	public function get_endpoints(): array {
		$templates = new TemplatesEndpoint();

		return [
			$templates,
		];
	}
}
