<?php
/**
 * Functions to register client-side assets (scripts and stylesheets) for the
 * Gutenberg block.
 *
 * @package gutenberg
 */

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * @see https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type/#enqueuing-block-scripts
 */
function repeatable_skeleton_block_init() {
	// Skip block registration if Gutenberg is not enabled/merged.
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}
	$dir = get_template_directory() . '/blocks';

	$index_js = 'repeatable-skeleton/index.js';
	wp_register_script(
		'repeatable-skeleton-block-editor',
		get_template_directory_uri() . "/blocks/$index_js",
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		filemtime( "$dir/$index_js" )
	);

	$editor_css = 'repeatable-skeleton/editor.css';
	wp_register_style(
		'repeatable-skeleton-block-editor',
		get_template_directory_uri() . "/blocks/$editor_css",
		array(),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'repeatable-skeleton/style.css';
	wp_register_style(
		'repeatable-skeleton-block',
		get_template_directory_uri() . "/blocks/$style_css",
		array(),
		filemtime( "$dir/$style_css" )
	);

	register_block_type( 'gutenberg/repeatable-skeleton', array(
		'editor_script' => 'repeatable-skeleton-block-editor',
		'editor_style'  => 'repeatable-skeleton-block-editor',
		'style'         => 'repeatable-skeleton-block',
	) );
}
add_action( 'init', 'repeatable_skeleton_block_init' );
