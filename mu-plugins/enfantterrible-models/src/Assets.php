<?php
/**
 * Global Assets module.
 *
 * @package EnfantTerrible\Models
 */

namespace EnfantTerrible\Models;

use TenupFramework\Assets\GetAssetInfo;
use TenupFramework\Module;
use TenupFramework\ModuleInterface;

/**
 * Global Assets module.
 *
 * @package EnfantTerrible\Models
 */
class Assets implements ModuleInterface {

	use Module;
	use GetAssetInfo;

	/**
	 * Can this module be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return true;
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

		$this->register_admin_assets();
	}

	/**
	 * Registers the admin assets by attaching the actions to enqueue the scripts
	 * and styles.
	 *
	 * @return void
	 */
	public function register_admin_assets() {
		add_action( 'enqueue_block_editor_assets', [ $this, 'admin_block_editor_scripts' ] );
	}

	/**
	 * Enqueue scripts for admin.
	 *
	 * @return void
	 */
	public function admin_scripts() {
	}

	/**
	 * Enqueue styles for admin.
	 *
	 * @return void
	 */
	public function admin_styles() {
	}

	/**
	 * Enqueue block scripts for the admin.
	 *
	 * This function retrieves dependencies and version information for the block
	 * scripts and enqueues them in the admin area.
	 *
	 * @return void
	 */
	public function admin_block_editor_scripts() {		
		wp_enqueue_script(
			'enfantterrible_models_admin',
			ENFANTTERRIBLE_MODELS_URL . 'dist/js/block-filters.js',
			$this->get_asset_info( 'block-filters', 'dependencies' ),
			$this->get_asset_info( 'block-filters', 'version' ),
			true
		);
	}
}
