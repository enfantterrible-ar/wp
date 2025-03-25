<?php
/**
 * Plugin Name:       enfantterrible Plugin Scaffold
 * Description:       A brief description of the plugin.
 * Version:           0.1.0
 * Requires at least: 4.9
 * Requires PHP:      8.2
 * Author:            10up
 * Author URI:        https://10up.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       enfantterrible-plugin
 * Domain Path:       /languages
 * Update URI:        https://github.com/10up/enfantterrible
 *
 * @package           enfantterriblePlugin
 */

// Useful global constants.
define( 'ENFANTTERRIBLE_PLUGIN_VERSION', '0.1.0' );
define( 'ENFANTTERRIBLE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'ENFANTTERRIBLE_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'ENFANTTERRIBLE_PLUGIN_INC', ENFANTTERRIBLE_PLUGIN_PATH . 'src/' );
define( 'ENFANTTERRIBLE_PLUGIN_DIST_URL', ENFANTTERRIBLE_PLUGIN_URL . 'dist/' );
define( 'ENFANTTERRIBLE_PLUGIN_DIST_PATH', ENFANTTERRIBLE_PLUGIN_PATH . 'dist/' );

$is_local_env = in_array( wp_get_environment_type(), [ 'local', 'development' ], true );
$is_local_url = strpos( home_url(), '.test' ) || strpos( home_url(), '.local' );
$is_local     = $is_local_env || $is_local_url;

if ( $is_local && file_exists( __DIR__ . '/dist/fast-refresh.php' ) ) {
	require_once __DIR__ . '/dist/fast-refresh.php';

	if ( function_exists( 'TenUpToolkit\set_dist_url_path' ) ) {
		TenUpToolkit\set_dist_url_path( basename( __DIR__ ), ENFANTTERRIBLE_PLUGIN_DIST_URL, ENFANTTERRIBLE_PLUGIN_DIST_PATH );
	}
}

// Bail if Composer autoloader is not found.
if ( ! file_exists( ENFANTTERRIBLE_PLUGIN_PATH . 'vendor/autoload.php' ) ) {
	throw new \Exception(
		'Vendor autoload file not found. Please run `composer install`.'
	);
}

require_once ENFANTTERRIBLE_PLUGIN_PATH . 'vendor/autoload.php';

$plugin_core = new \enfantterriblePlugin\PluginCore();

// Activation/Deactivation.
register_activation_hook( __FILE__, [ $plugin_core, 'activate' ] );
register_deactivation_hook( __FILE__, [ $plugin_core, 'deactivate' ] );

// Bootstrap.
$plugin_core->setup();
