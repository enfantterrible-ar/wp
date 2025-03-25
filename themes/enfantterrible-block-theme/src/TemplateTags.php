<?php
/**
 * TemplateTags module.
 *
 * @package enfantterribleBlockTheme
 */

namespace enfantterribleBlockTheme;

use TenupFramework\Module;
use TenupFramework\ModuleInterface;

/**
 * TemplateTags module.
 *
 * @package enfantterribleBlockTheme
 */
class TemplateTags implements ModuleInterface {

	use Module;

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
		add_action( 'wp_head', [ $this, 'add_viewport_meta_tag' ], 10, 0 );
	}

	/**
	 * Add viewport meta tag to head.
	 *
	 * @return void
	 */
	public function add_viewport_meta_tag() {
		?>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
		<?php
	}
}
