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
use EnfantTerrible\Models\PostTypes\Fotoperiodismo\Inc\Rest as RestController;
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
	 * Post type registrar instance.
	 *
	 * @var PostTypeRegistrar|null
	 */
	private ?PostTypeRegistrar $post_type = null;

	/**
	 * Blocks registrar instance.
	 *
	 * @var BlocksRegistrar|null
	 */
	private ?BlocksRegistrar $blocks = null;

	/**
	 * Meta registrar instance.
	 *
	 * @var MetaRegistrar|null
	 */
	private ?MetaRegistrar $meta = null;

	/**
	 * REST controller instance.
	 *
	 * @var RestController|null
	 */
	private ?RestController $rest = null;

	/**
	 * Admin page instance.
	 *
	 * @var AdminPage|null
	 */
	private ?AdminPage $admin_page = null;

	/**
	 * Admin assets instance.
	 *
	 * @var AdminAssets|null
	 */
	private ?AdminAssets $admin_assets = null;

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
	 * Inits all the required components.
	 *
	 * This method initializes all the required components for the class,
	 * such as the blocks registrar, post type registrar, meta registrar,
	 * rest controller, admin page, and admin assets.
	 *
	 * @return void
	 */
	private function init() {
		$this->post_type    = new PostTypeRegistrar();
		$this->meta         = new MetaRegistrar();
		$this->blocks       = new BlocksRegistrar();
		$this->rest         = new RestController();
		$this->admin_page   = new AdminPage();
		$this->admin_assets = new AdminAssets();
	}


	/**
	 * Sets up custom logic for the model registration.
	 *
	 * This method sets up any custom logic required before registering the model,
	 * such as setting up the post type template.
	 *
	 * @return void
	 */
	private function setup() {
		$post_type = $this->post_type;
		$blocks    = $this->blocks;

		$blocks_template = $blocks->get_model_blocks_template();
		if ( ! empty( $blocks_template ) ) {
			$post_type->set_model_options( $blocks_template );
		}
	}

	/**
	 * Registers all the required components for the post type.
	 *
	 * This method registers all the required components for the post type,
	 * including the post type registrar, meta registrar, admin page,
	 * admin assets, blocks registrar, and rest controller.
	 *
	 * @return void
	 */
	private function register_components() {
		$this->post_type->register();
		$this->meta->register();
		$this->blocks->register();
		$this->rest->register();
		$this->admin_page->register();
		$this->admin_assets->register();
	}

	/**
	 * Register the model.
	 *
	 * @return void
	 */
	public function register() {
		$this->init();
		$this->setup();
		$this->register_components();
	}
}
