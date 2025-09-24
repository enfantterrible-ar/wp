<?php
/**
 * Gutenberg Blocks setup
 *
 * @package EnfantTerrible\Models\PostTypes\Fotoperiodismo\Admin
 */

namespace EnfantTerrible\Models\PostTypes\Fotoperiodismo\Admin;

use TenupFramework\Assets\GetAssetInfo;
use TenupFramework\Module;
use TenupFramework\ModuleInterface;

/**
 * AdminPage module.
 *
 * @package EnfantTerrible\Models\PostTypes\Fotoperiodismo\Admin
 */
class AdminPage implements ModuleInterface {

	use Module;
	use GetAssetInfo;

	/**
	 * Arguments for configuring the admin page.
	 *
	 * @var array
	 */
	protected $args = [];

	/**
	 * Constructor for the AdminPage class.
	 *
	 * Initializes the admin page with default arguments for the page title,
	 * menu title, capability, menu slug, icon, and position. Merges these defaults
	 * with any existing arguments.
	 */
	public function __construct() {
		$args       = [
			'page_title' => 'Herramientas de Fotoperiodismo',
			'menu_title' => 'Herramientas',
			'capability' => 'manage_options',
			'menu_slug'  => 'fotoperiodismo-tools-page',
			'icon'       => 'dashicons-admin-generic',
			'position'   => 25,
		];
		$this->args = array_merge( $args, $this->args );
	}

	/**
	 * Returns the post type name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'fotoperiodismo';
	}

	/**
	 * Can this module be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return false;
	}

	/**
	 *
	 * Register any hooks and filters.
	 *
	 * @return void
	 */
	public function register() {
		$this->setup_asset_vars(
			dist_path: ENFANTTERRIBLE_MODELS_DIST_PATH,
			fallback_version: ENFANTTERRIBLE_MODELS_VERSION
		);

		add_action( 'admin_menu', [ $this, 'register_admin_menu' ], 10, 0 );
	}

	/**
	 * Registers an admin menu or submenu under a CPT.
	 *
	 * @return void
	 */
	public function register_admin_menu(): void {
		$args = $this->args;

		$parent_slug = 'edit.php?post_type=' . $this->get_name();

		add_submenu_page(
			$parent_slug,
			$args['page_title'],
			$args['menu_title'],
			$args['capability'],
			$args['menu_slug'],
			[ $this, 'render_admin_page' ]
		);
	}

	/**
	 * Renders the admin page.
	 *
	 * This function outputs the HTML for the admin page, including the
	 * necessary scripts and styles for the React application.
	 *
	 * @return void
	 */
	public function render_admin_page() {
		printf(
			'<div id="%s"></div>',
			esc_attr( $this->args['menu_slug'] )
		);
	}
}
