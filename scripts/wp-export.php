<?php
/**
 * One-shot WordPress -> JSON exporter for the Next.js migration.
 * Run:  podman compose --profile cli run --rm wp-cli wp eval-file /var/www/html/wp-content/uploads/_wbah_export.php
 * Output: wp-content/uploads/_export/*.json  (host-visible)
 */

$out_dir = WP_CONTENT_DIR . '/uploads/_export';
if ( ! is_dir( $out_dir ) ) {
	mkdir( $out_dir, 0775, true );
}

$home = untrailingslashit( home_url() );

function wbah_x_write( $dir, $name, $data ) {
	$json = wp_json_encode( $data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
	file_put_contents( "$dir/$name.json", $json );
	WP_CLI::log( sprintf( '  %-22s %8.1f KB', "$name.json", strlen( $json ) / 1024 ) );
}

/** Attachment -> portable shape. */
function wbah_x_image( $id ) {
	if ( ! $id ) {
		return null;
	}
	$file = get_post_meta( $id, '_wp_attached_file', true );
	if ( ! $file ) {
		return null;
	}
	$meta = wp_get_attachment_metadata( $id );
	return array(
		'file'   => $file, // e.g. 2026/07/foo.png  (relative to uploads root)
		'alt'    => (string) get_post_meta( $id, '_wp_attachment_image_alt', true ),
		'width'  => isset( $meta['width'] ) ? (int) $meta['width'] : null,
		'height' => isset( $meta['height'] ) ? (int) $meta['height'] : null,
	);
}

/** Path portion of a permalink, always leading+trailing slash. */
function wbah_x_path( $id ) {
	$url  = get_permalink( $id );
	$path = wp_parse_url( $url, PHP_URL_PATH );
	return $path ? $path : '/';
}

// ---------------------------------------------------------------- posts

$types   = array( 'post', 'page', 'faq', 'success_story', 'location', 'reason' );
$all     = array();
$counter = array();

foreach ( $types as $type ) {
	$ids = get_posts(
		array(
			'post_type'        => $type,
			'post_status'      => 'publish',
			'posts_per_page'   => -1,
			'fields'           => 'ids',
			'orderby'          => 'menu_order date',
			'order'            => 'ASC',
			'suppress_filters' => false,
		)
	);

	$items = array();
	foreach ( $ids as $id ) {
		$post = get_post( $id );

		// Render content through the_content so shortcodes/embeds/wpautop apply,
		// exactly as the live theme outputs it.
		$content = apply_filters( 'the_content', $post->post_content );

		$terms = array();
		foreach ( get_object_taxonomies( $type ) as $tax ) {
			if ( in_array( $tax, array( 'post_format' ), true ) ) {
				continue;
			}
			$tt = get_the_terms( $id, $tax );
			if ( $tt && ! is_wp_error( $tt ) ) {
				foreach ( $tt as $t ) {
					$terms[] = array(
						'taxonomy' => $tax,
						'name'     => $t->name,
						'slug'     => $t->slug,
					);
				}
			}
		}

		$excerpt = has_excerpt( $id )
			? get_the_excerpt( $id )
			: wp_trim_words( wp_strip_all_tags( strip_shortcodes( $post->post_content ) ), 40, '…' );

		$items[] = array(
			'id'        => (int) $id,
			'type'      => $type,
			'slug'      => $post->post_name,
			'path'      => wbah_x_path( $id ),
			'title'     => get_the_title( $id ),
			'excerpt'   => trim( wp_strip_all_tags( $excerpt ) ),
			'content'   => $content,
			'date'      => get_post_time( 'c', true, $id ),
			'modified'  => get_post_modified_time( 'c', true, $id ),
			'featured'  => wbah_x_image( (int) get_post_thumbnail_id( $id ) ),
			'terms'     => $terms,
			'parent'    => (int) $post->post_parent,
			'menuOrder' => (int) $post->menu_order,
			'template'  => (string) get_page_template_slug( $id ),
			'sourceUrl' => (string) get_post_meta( $id, '_wbah_source_url', true ),
		);
	}

	$counter[ $type ] = count( $items );
	$all[ $type ]     = $items;
	wbah_x_write( $out_dir, $type, $items );
}

// ---------------------------------------------------------------- taxonomies

$tax_out = array();
foreach ( array( 'category', 'faq_topic', 'location_area' ) as $tax ) {
	if ( ! taxonomy_exists( $tax ) ) {
		continue;
	}
	$terms = get_terms(
		array(
			'taxonomy'   => $tax,
			'hide_empty' => false,
		)
	);
	if ( is_wp_error( $terms ) ) {
		continue;
	}
	foreach ( $terms as $t ) {
		$link            = get_term_link( $t );
		$tax_out[ $tax ][] = array(
			'id'          => (int) $t->term_id,
			'name'        => $t->name,
			'slug'        => $t->slug,
			'description' => $t->description,
			'count'       => (int) $t->count,
			'path'        => is_wp_error( $link ) ? null : wp_parse_url( $link, PHP_URL_PATH ),
		);
	}
}
wbah_x_write( $out_dir, 'taxonomies', $tax_out );

// ---------------------------------------------------------------- menus

$menus = array();
foreach ( get_nav_menu_locations() as $location => $menu_id ) {
	if ( ! $menu_id ) {
		continue;
	}
	$items = wp_get_nav_menu_items( $menu_id );
	if ( ! $items ) {
		continue;
	}
	$flat = array();
	foreach ( $items as $it ) {
		$path = wp_parse_url( $it->url, PHP_URL_PATH );
		$host = wp_parse_url( $it->url, PHP_URL_HOST );
		$flat[] = array(
			'id'       => (int) $it->ID,
			'parent'   => (int) $it->menu_item_parent,
			'order'    => (int) $it->menu_order,
			'title'    => $it->title,
			'url'      => $it->url,
			'path'     => ( $host && wp_parse_url( home_url(), PHP_URL_HOST ) !== $host ) ? $it->url : ( $path ? $path : '/' ),
			'external' => (bool) ( $host && wp_parse_url( home_url(), PHP_URL_HOST ) !== $host ),
		);
	}
	$menus[ $location ] = $flat;
}
wbah_x_write( $out_dir, 'menus', $menus );

// ---------------------------------------------------------------- attachments (id -> file, for URL remap)

$att_ids = get_posts(
	array(
		'post_type'      => 'attachment',
		'post_status'    => 'inherit',
		'posts_per_page' => -1,
		'fields'         => 'ids',
	)
);
$atts = array();
foreach ( $att_ids as $id ) {
	$img = wbah_x_image( $id );
	if ( ! $img ) {
		continue;
	}
	$img['id']    = (int) $id;
	$img['title'] = get_the_title( $id );
	$atts[]       = $img;
}
wbah_x_write( $out_dir, 'attachments', $atts );

// ---------------------------------------------------------------- site meta

wbah_x_write(
	$out_dir,
	'site',
	array(
		'name'          => get_bloginfo( 'name' ),
		'description'   => get_bloginfo( 'description' ),
		'home'          => $home,
		'frontPageId'   => (int) get_option( 'page_on_front' ),
		'postsPageId'   => (int) get_option( 'page_for_posts' ),
		'uploadsPrefix' => wp_parse_url( wp_upload_dir()['baseurl'], PHP_URL_PATH ),
		'counts'        => $counter,
		'exportedAt'    => gmdate( 'c' ),
	)
);

WP_CLI::success( 'Exported: ' . wp_json_encode( $counter ) );
