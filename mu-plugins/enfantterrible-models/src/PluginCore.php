<?php
/**
 * PluginCore module.
 *
 * @package EnfantTerrible\Models
 */

namespace EnfantTerrible\Models;

use TenupFramework\ModuleInitialization;

/**
 * PluginCore module.
 *
 * @package EnfantTerrible\Models
 */
class PluginCore {

	/**
	 * Default setup routine
	 *
	 * @return void
	 */
	public function setup() {
		add_action( 'init', [ $this, 'i18n' ] );
		add_action( 'init', [ $this, 'init' ], apply_filters( 'enfantterrible_models_init_priority', 8 ) );

		do_action( 'enfantterrible_models_loaded' );
	}

	/**
	 * Registers the default textdomain.
	 *
	 * @return void
	 */
	public function i18n() {
		$locale = apply_filters( 'plugin_locale', get_locale(), 'enfantterrible-models' );
		load_textdomain( 'enfantterrible-models', WP_LANG_DIR . '/enfantterrible-models/enfantterrible-models-' . $locale . '.mo' );
		load_plugin_textdomain( 'enfantterrible-models', false, plugin_basename( ENFANTTERRIBLE_MODELS_PATH ) . '/languages/' );
	}

	/**
	 * Initializes the plugin and fires an action other plugins can hook into.
	 *
	 * @return void
	 */
	public function init() {
		do_action( 'enfantterrible_models_before_init' );

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
								'enfantterrible-models'
							)
						)
					);
				}
			);

			return;
		}
		ModuleInitialization::instance()->init_classes( ENFANTTERRIBLE_MODELS_INC );
		do_action( 'enfantterrible_models_init' );
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
