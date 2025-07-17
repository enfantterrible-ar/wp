<?php
/**
 * Monolog logger factory for EnfantTerrible models plugin.
 *
 * Provides methods to create and configure Monolog logger instances
 * with plugin-specific and global handlers.
 *
 * @package EnfantTerrible\Models
 */

namespace EnfantTerrible\Models\Inc;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\ErrorLogHandler;
use Monolog\Processor\ProcessorInterface;
use Monolog\Formatter\LineFormatter;

/**
 * LoggerFactory is responsible for creating and managing Monolog logger instances
 * with appropriate handlers and processors for plugin-specific and global logging.
 */
class LoggerFactory {


	/**
	 * Stores logger instances keyed by plugin slug and channel.
	 *
	 * @var array
	 */
	private static $loggers = [];

	/**
	 * Get a Monolog logger instance.
	 *
	 * @param string $plugin_slug Plugin identifier, used for log file naming and context.
	 * @param string $channel Optional Monolog channel name.
	 * @return Logger
	 */
	public static function get_logger( string $plugin_slug, string $channel ): Logger {
		$key = $plugin_slug . '|' . $channel;

		if ( ! isset( self::$loggers[ $key ] ) ) {

			$logger = new Logger( $channel );

			$log_dir = defined( 'WP_CONTENT_DIR' ) ? WP_CONTENT_DIR : sys_get_temp_dir();

			$plugin_log_file = trailingslashit( $log_dir ) . $plugin_slug . '.log';
			$debug_log_file  = trailingslashit( $log_dir ) . 'debug.log';

			$handlers = [];

			if ( self::is_writable_log_dir( $plugin_log_file ) ) {
				$handlers[] = new StreamHandler( $plugin_log_file, Logger::DEBUG );
			}

			if ( self::is_writable_log_dir( $debug_log_file ) ) {
				$handlers[] = new StreamHandler( $debug_log_file, Logger::DEBUG );
			} else {
				$handlers[] = new ErrorLogHandler();
			}

			// Create a custom formatter that modifies the channel part:
			$output    = "[%datetime%] {$plugin_slug} [%channel%].%level_name%: %message% %context% %extra%\n";
			$formatter = new LineFormatter( $output, null, true, true );

			foreach ( $handlers as $handler ) {
				$handler->setFormatter( $formatter );
				$logger->pushHandler( $handler );
			}

			// Optional: add processor for extra context if needed
			$logger->pushProcessor(
				function ( $record ) use ( $plugin_slug ) {
					$record['extra']['plugin_slug'] = $plugin_slug;
					return $record;
				}
			);

			self::$loggers[ $key ] = $logger;
		}

		return self::$loggers[ $key ];
	}

	/**
	 * Checks if a log directory is writable, or if the file does not exist,
	 * checks if the containing directory is writable.
	 *
	 * @param string $file_path Path to a file that will be written to.
	 * @return bool True if the directory is writable, false otherwise.
	 */
	private static function is_writable_log_dir( string $file_path ): bool {
		global $wp_filesystem;

		if ( ! isset( $wp_filesystem ) || ! $wp_filesystem->is_dir( dirname( $file_path ) ) ) {
			require_once ABSPATH . '/wp-admin/includes/file.php';
			WP_Filesystem();
		}

		$dir         = dirname( $file_path );
		$is_dir      = $wp_filesystem->is_dir( $dir );
		$is_writable = $wp_filesystem->is_writable( $dir );
		$file_exists = $wp_filesystem->exists( $file_path );

		return ( $is_dir && $is_writable ) || ( ! $file_exists && $is_writable );
	}
}
