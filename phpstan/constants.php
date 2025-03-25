<?php
/**
 * WP Constants used by PHPStan
 *
 * These should be updated to match constants that are set in any custom plugins or themes that will be anylised.
 *
 * @package TenUpPhpStan
 */

// Change these when you update the constants in the plugin.
define( 'ENFANTTERRIBLE_PLUGIN_VERSION', '0.1.0' );
define( 'ENFANTTERRIBLE_PLUGIN_URL', '' );
define( 'ENFANTTERRIBLE_PLUGIN_PATH', '' );
define( 'ENFANTTERRIBLE_PLUGIN_INC', ENFANTTERRIBLE_PLUGIN_PATH . 'includes/' );

// Change these when you update the constants in the theme.
define( 'ENFANTTERRIBLE_THEME_VERSION', '0.1.0' );
define( 'ENFANTTERRIBLE_THEME_TEMPLATE_URL', '' );
define( 'ENFANTTERRIBLE_THEME_PATH', '/' );
define( 'ENFANTTERRIBLE_THEME_DIST_PATH', ENFANTTERRIBLE_THEME_PATH . 'dist/' );
define( 'ENFANTTERRIBLE_THEME_DIST_URL', ENFANTTERRIBLE_THEME_TEMPLATE_URL . '/dist/' );
define( 'ENFANTTERRIBLE_THEME_INC', ENFANTTERRIBLE_THEME_PATH . 'includes/' );
define( 'ENFANTTERRIBLE_THEME_BLOCK_DIR', ENFANTTERRIBLE_THEME_INC . 'blocks/' );

define( 'ENFANTTERRIBLE_BLOCK_THEME_VERSION', '1.0.0' );
define( 'ENFANTTERRIBLE_BLOCK_THEME_TEMPLATE_URL', '' );
define( 'ENFANTTERRIBLE_BLOCK_THEME_PATH', '/' );
define( 'ENFANTTERRIBLE_BLOCK_THEME_DIST_PATH', ENFANTTERRIBLE_BLOCK_THEME_PATH . 'dist/' );
define( 'ENFANTTERRIBLE_BLOCK_THEME_DIST_URL', ENFANTTERRIBLE_BLOCK_THEME_TEMPLATE_URL . '/dist/' );
define( 'ENFANTTERRIBLE_BLOCK_THEME_INC', ENFANTTERRIBLE_BLOCK_THEME_PATH . 'includes/' );
define( 'ENFANTTERRIBLE_BLOCK_THEME_BLOCK_DIST_DIR', ENFANTTERRIBLE_BLOCK_THEME_DIST_PATH . '/blocks/' );
