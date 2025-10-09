<?php
/**
 * ErrorHandlerInterface file.
 *
 * Defines the interface for error handling in EnfantTerrible models.
 *
 * @package EnfantTerrible\Models
 */

namespace EnfantTerrible\Models\Inc\Interfaces;

use WP_Error;

/**
 * Defines a contract for classes that need error handling.
 */
interface ErrorHandlerInterface {
	/**
	 * Return the map of error scenarios this handler knows about.
	 *
	 * @return array<string, callable>
	 */
	public function get_error_scenarios(): array;

	/**
	 * Handle an error scenario.
	 *
	 * @param string          $scenario   Error scenario key.
	 * @param array           $context    Additional context for logging.
	 * @param \Throwable|null $exception Optional exception.
	 * @return \WP_Error
	 */
	public function handle_error( string $scenario, array $context = [], ?\Throwable $exception = null ): \WP_Error;
}
