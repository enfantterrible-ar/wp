<?php

namespace EnfantTerrible\Models\Inc;

class CustomFieldRegistrar {

    /**
     * Register a single meta field.
     *
     * @param string $object_type 'post', 'user', 'term', etc.
     * @param string $meta_key
     * @param array  $args
     */
    public static function register( string $object_type, string $meta_key, array $args = [] ): void {
        $defaults = [
            'type'         => 'string',
            'single'       => true,
            'show_in_rest' => true,
            'auth_callback' => fn() => current_user_can( 'edit_posts' ),
        ];

        register_meta( $object_type, $meta_key, array_merge( $defaults, $args ) );
    }

    /**
     * Register multiple meta fields at once.
     *
     * @param string $object_type
     * @param array  $fields [
     *     'meta_key' => [ 'type' => 'string', 'description' => '...' ],
     * ]
     */
    public static function register_many( string $object_type, array $fields ): void {
        foreach ( $fields as $meta_key => $args ) {
            self::register( $object_type, $meta_key, $args );
        }
    }
}
