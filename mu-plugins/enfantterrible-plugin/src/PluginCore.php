<?php
/**
 * PluginCore module.
 *
 * @package enfantterriblePlugin
 */

namespace enfantterriblePlugin;

use TenupFramework\ModuleInitialization;

/**
 * PluginCore module.
 *
 * @package enfantterriblePlugin
 */
class PluginCore {

	/**
	 * Default setup routine
	 *
	 * @return void
	 */
	public function setup() {
		add_action( 'init', [ $this, 'i18n' ] );
		add_action( 'init', [ $this, 'init' ], apply_filters( 'enfantterrible_plugin_init_priority', 8 ) );

		do_action( 'enfantterrible_plugin_loaded' );
	}

	/**
	 * Registers the default textdomain.
	 *
	 * @return void
	 */
	public function i18n() {
		$locale = apply_filters( 'plugin_locale', get_locale(), 'enfantterrible-plugin' );
		load_textdomain( 'enfantterrible-plugin', WP_LANG_DIR . '/enfantterrible-plugin/enfantterrible-plugin-' . $locale . '.mo' );
		load_plugin_textdomain( 'enfantterrible-plugin', false, plugin_basename( ENFANTTERRIBLE_PLUGIN_PATH ) . '/languages/' );
	}

	/**
	 * Initializes the plugin and fires an action other plugins can hook into.
	 *
	 * @return void
	 */
	public function init() {
		do_action( 'enfantterrible_plugin_before_init' );

		if ( ! class_exists( '\TenupFramework\ModuleInitialization' ) ) {
			add_action(
				'admin_notices',
				function () {
					$class = 'notice notice-error';

					printf(
						'<div class="%1$s"><p>%2$s</p></div>',
						esc_attr( $class ),
						wp_kses_post(
							__(
								'Please ensure the <a href="https://github.com/10up/wp-framework"><code>10up/wp-framework</code></a> composer package is installed.',
								'enfantterrible-plugin'
							)
						)
					);
				}
			);

			return;
		}

		ModuleInitialization::instance()->init_classes( ENFANTTERRIBLE_PLUGIN_INC );
		do_action( 'enfantterrible_plugin_init' );
	}

	/**
	 * Activate the plugin
	 *
	 * @return void
	 */
	public function activate() {
		// First load the init scripts in case any rewrite functionality is being loaded
		$this->init();
		flush_rewrite_rules();
	}

	/**
	 * Deactivate the plugin
	 *
	 * Uninstall routines should be in uninstall.php
	 *
	 * @return void
	 */
	public function deactivate() {
		// Do nothing.
	}

	/**
	 * Get an initialized class by its full class name, including namespace.
	 *
	 * @param string $class_name The class name including the namespace.
	 *
	 * @return false|\TenupFramework\ModuleInterface
	 */
	public static function get_module( $class_name ) {
		return \TenupFramework\ModuleInitialization::get_module( $class_name );
	}
}
