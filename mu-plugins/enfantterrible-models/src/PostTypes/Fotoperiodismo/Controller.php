<?php
/**
 * Demo Post Type
 *
 * @package EnfantTerrible\Models\PostTypes\Fotoperiodismo
 */

declare(strict_types = 1);

namespace EnfantTerrible\Models\PostTypes\Fotoperiodismo;

use TenupFramework\ModuleInterface;
use TenupFramework\Module;

use EnfantTerrible\Models\Inc\LoggerFactory;
use Monolog\Logger;

use EnfantTerrible\Models\PostTypes\Fotoperiodismo\Inc\PostType as PostTypeRegistrar;
use EnfantTerrible\Models\PostTypes\Fotoperiodismo\Inc\Meta as MetaRegistrar;
use EnfantTerrible\Models\PostTypes\Fotoperiodismo\Inc\Blocks as BlocksRegistrar;
use EnfantTerrible\Models\PostTypes\Fotoperiodismo\Admin\AdminPage;
use EnfantTerrible\Models\PostTypes\Fotoperiodismo\Admin\AdminAssets;

/**
 * Fotoperiodismo post type.
 */
class Controller implements ModuleInterface {
	use Module;

	/**
	 * The model name.
	 *
	 * @var string
	 */
	private string $model_name = 'fotoperiodismo';

	/**
	 * The model type.
	 *
	 * @var string
	 */
	private string $model_type = 'post';

	/**
	 * Get the post type name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'fotoperiodismo';
	}

	/**
	 * Can the class be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return true;
	}

	/**
	 * Register the post type.
	 *
	 * @return void
	 */
	public function register() {
		$this->register_post_type();
		$this->register_meta();
		$this->register_admin_pages();
		$this->register_blocks();
	}

	/**
	 * Registers the post type.
	 *
	 * This method registers the post type using the PostTypeRegistrar.
	 *
	 * @return void
	 */
	public function register_post_type() {
		$post_type = new PostTypeRegistrar();
		$post_type->register();
	}

	/**
	 * Register the custom meta fields for the post type.
	 *
	 * This method registers all custom meta fields for the post type.
	 *
	 * @return void
	 */
	public function register_meta() {
		$meta = new MetaRegistrar();
		$meta->register();
	}

	/**
	 * Register the admin pages for the post type.
	 *
	 * This will register the admin page and enqueue the necessary assets.
	 *
	 * @return void
	 */
	public function register_admin_pages() {

		$admin_page   = new AdminPage();
		$admin_assets = new AdminAssets();

		$admin_page->register();
		$admin_assets->register();
	}

	/**
	 * Registers all blocks in the blocks directory.
	 *
	 * This method creates an instance of the BlocksRegistrar class and calls its register() method.
	 *
	 * @return void
	 */
	public function register_blocks() {
		$blocks = new BlocksRegistrar();
		$blocks->register();
	}
}
