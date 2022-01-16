<?php
/*
Plugin Name: Disable Widgets
Plugin URI: https://dennis-bitsch.de
Description: Adds a little checkbox to each widget to enable/disable the widget
Version: 1.0.0
Author: Dennis Bitsch
Author URI: https://dennis-bitsch.de
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: bitsch
Domain Path: /languages
*/

// exit if accessed directly
if(!defined('ABSPATH')) exit;

// check if class already exists
if(!class_exists('db_disable_widgets')):

class db_disable_widgets {

    public array $settings;

	public function __construct() {

        /** plugin settings */
		$this->settings = array(
			'version'	=> '1.0.0',
			'url'		=> plugin_dir_url( __FILE__ ),
			'path'		=> plugin_dir_path( __FILE__ )
		);

        /** load translation files */
        add_action('init', [$this, 'ddw_load_translation_file'], 99);

		/** register admin page / menu link */
        add_action('admin_menu', [$this, 'ddw_core_add_pages'], 13 );

        /** render checkbox under each widget form */
        add_action('in_widget_form', [$this, 'ddw_render_widgets_checkbox'], 10, 3);

        /** update checkbox */
        add_filter('widget_update_callback', [$this, 'ddw_update_widgets_checkbox'], 10, 3);

        /** filter widgets */
        add_filter( 'widget_display_callback', [$this, 'ddw_filter_widgets'], 10, 1 );
    }

    public function ddw_core_add_pages() {

        add_menu_page(
            __('Disable Widgets', 'bitsch'),
            __('Disable Widgets', 'bitsch'),
            'manage_options',
            'disable-widgets',
            array( $this, 'init_disable_widgets' )
        );
    }

    public function ddw_render_widgets_checkbox($widget, $return, $instance) {
        ?>
        <p>
            <input type="checkbox" class="checkbox" name="<?php echo $widget->get_field_name('enabled'); ?>" id="<?php echo $widget->get_field_name('enabled'); ?>" <?= (!empty($instance['enabled']) || !isset($instance['enabled']) ? 'checked' : '') ?> />
            <label for="<?php echo $widget->get_field_name('enabled'); ?>"><?= __('Enabled', 'bitsch') ?></label>
        </p>
        <?php
    }

    public function ddw_update_widgets_checkbox($instance, $new_instance, $old_instance) {
        $instance['enabled'] = (!empty($new_instance['enabled']) ? 1 : 0);
        return $instance;
    }

    public function ddw_filter_widgets($values) {
        return (is_page() && !empty($values["enabled"]) ? $values : false);
    }

    /**
     * Load plugin textdomain
     */
    function ddw_load_translation_file() {
        $plugin_path = dirname( plugin_basename( __FILE__ ) ) . '/languages/';
        load_plugin_textdomain( 'bitsch', false, $plugin_path );
    }
}
new db_disable_widgets();

/**
 * Check for required plugins
 */
function ddw_core_check_required_plugins() {
    if ( is_admin() && current_user_can( 'activate_plugins') && !is_plugin_active( 'db-disable-widgets/db-disable-widgets.php') ) {

        add_action('admin_notices', function() {
            echo '<div class="error"><p>This addon requires <em>Classic Widgets</em> to be installed and activated.</p></div>';
        });

        deactivate_plugins( plugin_basename( __FILE__) );
        if ( isset( $_GET['activate'] ) ) {
            unset( $_GET['activate'] );
        }
    }
}
add_action('admin_init', 'ddw_core_check_required_plugins');


/**
 * Plugin update check
 *
 * --> https://github.com/YahnisElsts/plugin-update-checker
 */


endif;