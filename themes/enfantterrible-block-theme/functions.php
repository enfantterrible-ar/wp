<?php
/**
 * Theme constants and setup functions
 *
 * @package enfantterribleBlockTheme
 */

// Useful global constants.
define( 'ENFANTTERRIBLE_BLOCK_THEME_VERSION', '1.0.0' );
define( 'ENFANTTERRIBLE_BLOCK_THEME_TEMPLATE_URL', get_template_directory_uri() );
define( 'ENFANTTERRIBLE_BLOCK_THEME_PATH', get_template_directory() . '/' );
define( 'ENFANTTERRIBLE_BLOCK_THEME_DIST_PATH', ENFANTTERRIBLE_BLOCK_THEME_PATH . 'dist/' );
define( 'ENFANTTERRIBLE_BLOCK_THEME_DIST_URL', ENFANTTERRIBLE_BLOCK_THEME_TEMPLATE_URL . '/dist/' );
define( 'ENFANTTERRIBLE_BLOCK_THEME_INC', ENFANTTERRIBLE_BLOCK_THEME_PATH . 'src/' );
define( 'ENFANTTERRIBLE_BLOCK_THEME_BLOCK_DIST_DIR', ENFANTTERRIBLE_BLOCK_THEME_DIST_PATH . '/blocks/' );

// Require Composer autoloader if it exists.
if ( ! file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	throw new Exception( 'Please run `composer install` in your theme directory.' );
}

$is_local_env = in_array( wp_get_environment_type(), [ 'local', 'development' ], true );
$is_local_url = strpos( home_url(), '.test' ) || strpos( home_url(), '.local' );
$is_local     = $is_local_env || $is_local_url;

if ( $is_local && file_exists( __DIR__ . '/dist/fast-refresh.php' ) ) {
	require_once __DIR__ . '/dist/fast-refresh.php';

	if ( function_exists( 'TenUpToolkit\set_dist_url_path' ) ) {
		TenUpToolkit\set_dist_url_path( basename( __DIR__ ), ENFANTTERRIBLE_BLOCK_THEME_DIST_URL, ENFANTTERRIBLE_BLOCK_THEME_DIST_PATH );
	}
}

require_once __DIR__ . '/vendor/autoload.php';

require_once __DIR__ . '/template-tags.php';

$theme_core = new \enfantterribleBlockTheme\ThemeCore();
$theme_core->setup();
