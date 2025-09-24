<?php
/**
 * Admin Assets module.
 *
 * @package EnfantTerrible\Models\PostTypes\Fotoperiodismo\Admin
 */

namespace EnfantTerrible\Models\PostTypes\Fotoperiodismo\Admin;

use TenupFramework\Assets\GetAssetInfo;
use TenupFramework\Module;
use TenupFramework\ModuleInterface;

/**
 * Admin Assets module.
 *
 * @package EnfantTerrible\Models\PostTypes\Fotoperiodismo\Admin
 */
class AdminAssets implements ModuleInterface {

	use Module;
	use GetAssetInfo;

	/**
	 * Can this module be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return false;
	}

	/**
	 * Register any hooks and filters.
	 *
	 * @return void
	 */
	public function register() {
		$this->setup_asset_vars(
			dist_path: ENFANTTERRIBLE_MODELS_PATH . 'dist/',
			fallback_version: ENFANTTERRIBLE_MODELS_VERSION
		);

		add_action( 'admin_enqueue_scripts', [ $this, 'admin_scripts' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'admin_styles' ] );
	}

	/**
	 * Enqueue scripts for admin.
	 *
	 * @return void
	 */
	public function admin_scripts() {
		$screen = get_current_screen();
		
		if ( $screen && 'fotoperiodismo_page_fotoperiodismo-tools-page' === $screen->id ) {
			wp_enqueue_script(
				'enfantterrible_models_fotoperiodismo_admin_page_script',
				ENFANTTERRIBLE_MODELS_URL . 'dist/js/post-types/fotoperiodismo/admin/fotoperiodismo-admin-page.js',
				$this->get_asset_info( 'post-types/fotoperiodismo/admin/fotoperiodismo-admin-page', 'dependencies' ),
				$this->get_asset_info( 'post-types/fotoperiodismo/admin/fotoperiodismo-admin-page', 'version' ),
				true
			);
		}

	}

	/**
	 * Enqueue styles for admin.
	 *
	 * @return void
	 */
	public function admin_styles() {
		$screen = get_current_screen();

		if ( $screen && 'fotoperiodismo_page_fotoperiodismo-tools-page' === $screen->id ) {
			// This is the source of truth for the entire component's dependencies.
			$deps = [];
	
			wp_enqueue_style(
				'enfantterrible_models_fotoperiodismo_admin_page_styles',
				ENFANTTERRIBLE_MODELS_URL . 'dist/css/post-types/fotoperiodismo/admin/fotoperiodismo-admin-page.css', // Note the corrected file name
				$deps,
				$this->get_asset_info( 'post-types/fotoperiodismo/admin/fotoperiodismo-admin-page', 'version' ),
			);
		}
	}
}
