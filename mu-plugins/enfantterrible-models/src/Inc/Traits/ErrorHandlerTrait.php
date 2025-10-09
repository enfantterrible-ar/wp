<?php
/**
 * Trait ErrorHandlerTrait
 *
 * Provides error handling functionality for EnfantTerrible models.
 *
 * @package EnfantTerrible\Models
 */

namespace EnfantTerrible\Models\Inc\Traits;

use WP_Error;
use EnfantTerrible\Models\Inc\Interfaces\ErrorHandlerInterface;

trait ErrorHandlerTrait {

	/**
	 * Handles an error scenario and returns a WP_Error object.
	 *
	 * @param string          $scenario The error scenario identifier.
	 * @param array           $context Optional context data for the error.
	 * @param \Throwable|null $exception Optional exception related to the error.
	 * @return WP_Error
	 * @throws \InvalidArgumentException If the scenario handler does not exist.
	 */
	public function handle_error( string $scenario, array $context = [], ?\Throwable $exception = null ): WP_Error {
		$scenarios = $this->get_error_scenarios();

		if ( ! isset( $scenarios[ $scenario ] ) ) {
			throw new \InvalidArgumentException( "Unknown error scenario: {$scenario}" );
		}

		return $scenarios[ $scenario ]( $context, $exception );
	}
}
