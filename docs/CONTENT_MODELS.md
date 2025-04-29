# Content Models

**Owner**: Martín García  
**Last Updated**: 11/04/2025  
**URL**: `https://github.com/enfantterrible-ar/wp/docs/CONTENT_MODELS.md`  

---

## Overview

### All current post types

| name                 | label                 | description                                           | hierarchical | public | capability_type     |
|----------------------|-----------------------|-------------------------------------------------------|--------------|--------|---------------------|
| post                 | Posts                 |                                                       |              | 1      | post                |
| page                 | Pages                 |                                                       | 1            | 1      | page                |
| attachment           | Media                 |                                                       |              | 1      | post                |
| revision             | Revisions             |                                                       |              |        | post                |
| nav_menu_item        | Navigation Menu Items |                                                       |              |        | edit_theme_options  |
| custom_css           | Custom CSS            |                                                       |              |        | post                |
| customize_changeset  | Changesets            |                                                       |              |        | customize_changeset |
| oembed_cache         | oEmbed Responses      |                                                       |              |        | post                |
| user_request         | User Requests         |                                                       |              |        | post                |
| wp_block             | Patterns              |                                                       |              |        | block               |
| wp_template          | Templates             | Templates to include in your theme.                   |              |        | template            |
| wp_template_part     | Template Parts        | Template parts to include in your templates.          |              |        | post                |
| wp_global_styles     | Global Styles         | Global styles to include in themes.                   |              |        | post                |
| wp_navigation        | Navigation Menus      | Navigation menus that can be inserted into your site. |              |        | post                |
| wp_font_family       | Font Families         |                                                       |              |        | post                |
| wp_font_face         | Font Faces            |                                                       |              |        | post                |
| acf-taxonomy         | Taxonomies            |                                                       | 1            |        | post                |
| acf-post-type        | Post Types            |                                                       | 1            |        | post                |
| acf-field-group      | Field Groups          |                                                       | 1            |        | post                |
| acf-field            | Fields                |                                                       | 1            |        | post                |
| fotoperiodismo       | Fotoperiodismo        | Fotogalerías                                          |              | 1      | post                |
| cf_beneficios        | Locales y beneficios  |                                                       |              | 1      | post                |
| certificaciones_web  | Certificaciones web   |                                                       |              | 1      | post                |
| dossiers             | Dossiers              |                                                       | 1            | 1      | post                |
| lazyblocks           | Blocks                |                                                       |              |        | post                |
| lazyblocks_templates | Templates             |                                                       |              |        | post                |
| oxy_user_library     | Blocks                |                                                       |              | 1      | post                |
| rm_content_editor    | RM Content Editor     |                                                       |              |        | page                |

### Most critical

| name                | label               | description | hierarchical | public | capability_type |
|---------------------|---------------------|-------------|--------------|--------|------------------|
| post                | Posts               |             |              | 1      | post             |
| page                | Pages               |             | 1            | 1      | page             |
| attachment          | Media               |             |              | 1      | post             |
| fotoperiodismo      | Fotoperiodismo      | Fotogalerías|              | 1      | post             |
| cf_beneficios       | Locales y beneficios|             |              | 1      | post             |
| certificaciones_web | Certificaciones web |             |              | 1      | post             |
| dossiers            | Dossiers            |             | 1            | 1      | post             |

---

## Posts `post`

### Overview

Core post type. 
Posts is the most used post type in the WP instance. They are used as articles.

### Metadata

Posts contains certain metadata associated to it, which overall serves two purposes:

- Post specific values, like `notas_bajada` used in a custom block (via Lazy Blocks), which serves the purpose of an lead/excerpt.
- Front-end organization, like nota_de_tapa_\* or nota_inicio_entrevista.

<details>
<summary>
	<b>
		SQL query
	</b>
</summary>

```sql
SELECT DISTINCT meta_key
FROM wp_postmeta
WHERE post_id IN (
	SELECT ID FROM wp_posts WHERE post_type = 'post'
)
AND meta_key NOT LIKE '_oembed_%'
AND meta_key NOT LIKE '_ct_%'
AND meta_key NOT LIKE '%oxygen%'
AND meta_key NOT LIKE '_wp%'
AND meta_key NOT LIKE '%cmplz%'
AND meta_key NOT LIKE '%rank_math%'
AND meta_key NOT LIKE '%ocean%'
AND meta_key NOT LIKE '%elementor%'
AND meta_key NOT LIKE '%yoast%'
AND meta_key NOT LIKE '%sws%'
AND meta_key NOT LIKE '%lyte%'
AND meta_key NOT LIKE '%vcv%'
AND meta_key NOT LIKE '%swift%'
AND meta_key NOT LIKE '%enclos%'
AND meta_key NOT LIKE '%_eos_%'
AND meta_key NOT LIKE '%_dp_%'
AND meta_key NOT LIKE '%ping%'
AND meta_key NOT IN (
	'post_grid_post_settings',
	'_advads_ad_settings',
	'_edit_last',
	'_thumbnail_id',
	'_cff_oembed_done_checking',
	'_edit_lock',
	'xyz_fbap',
	'footnotes',
	'_mi_skip_tracking'
)
AND meta_value IS NOT NULL
AND meta_value != ''
AND meta_value != '%5B%5D';
```
</details>

| meta_key                          | source       |
|----------------------------------|--------------|
| notas_bajada                     | Lazy Blocks  |
| nota_de_tapa_selector_primaria   | ACF          |
| _nota_de_tapa_selector_primaria  | ACF          |
| nota_de_tapa_selector_secundaria | ACF          |
| _nota_de_tapa_selector_secundaria| ACF          |
| nota_de_tapa_selector_terciaria  | ACF          |
| _nota_de_tapa_selector_terciaria | ACF          |
| nota_inicio_entrevista           | ACF          |
| _nota_inicio_entrevista          | ACF          |
| nota_de_tapa_selector            | ACF          |
| _nota_de_tapa_selector           | ACF          |

> [!note]
> The featured nature of an article is defined by its meta value. 
> 
> If a post has a value of 1 in either `nota_de_tapa_selector_primaria`, `nota_de_tapa_selector_secundaria`, `nota_de_tapa_selector_terciaria`, the value of  `nota_inicio_entrevista` is set to 0.
> 
> The inverse also happens when `nota_inicio_entrevista` has a value of 1.
>
> When any of those scenarios happens,
> this triggers a method hooked to `save_post` hook.
> This method runs a query for all posts types,
> excluding the current one,
> and updates its meta value,
> so there is always only one post
> with a 1 value on its meta key.
>
> This process is rather expensive resource-wise,
> because it's highly unoptimized.
> Not only happens on server side,
> but the query itself is rather inefficient.
>
> [**See code snippet**](../docs/AUDIT.md#2-post---cambiar-valores-de-nota-de-tapa-anteriores-en-caso-de-nuevo-post-e).

---

## Pages `page`

### Overview

Core post type.
Page are mostly used for relatively static content,
like homepage.
They are mostly used by developers, with minimal input from editors or writers.

### Metadata

Page contains a single custom meta key, 
which is not really used anymore.
This meta key was used to output Complianz Privacy Policy.

<details>
<summary>
	<b>
		SQL query
	</b>
</summary>

```sql
SELECT DISTINCT meta_key
FROM wp_postmeta
WHERE post_id IN (
	SELECT ID FROM wp_posts WHERE post_type = 'page'
)
AND meta_key NOT LIKE '_oembed_%'
AND meta_key NOT LIKE '_ct_%'
AND meta_key NOT LIKE '%oxygen%'
AND meta_key NOT LIKE '_wp%'
AND meta_key NOT LIKE '%cmplz%'
AND meta_key NOT LIKE '%rank_math%'
AND meta_key NOT LIKE '%ocean%'
AND meta_key NOT LIKE '%elementor%'
AND meta_key NOT LIKE '%yoast%'
AND meta_key NOT LIKE '%sws%'
AND meta_key NOT LIKE '%lyte%'
AND meta_key NOT LIKE '%vcv%'
AND meta_key NOT LIKE '%swift%'
AND meta_key NOT LIKE '%enclos%'
AND meta_key NOT LIKE '%_eos_%'
AND meta_key NOT LIKE '%_dp_%'
AND meta_key NOT LIKE '%ping%'
AND meta_key NOT IN (
	'post_grid_post_settings',
	'_advads_ad_settings',
	'_edit_last',
	'_thumbnail_id',
	'_cff_oembed_done_checking',
	'_edit_lock',
	'xyz_fbap',
	'footnotes',
	'_mi_skip_tracking'
)
AND meta_value IS NOT NULL
AND meta_value != ''
AND meta_value != '%5B%5D';
```
</details>


| meta_key                        | source |
|---------------------------------|--------|
| politica_privacidad_contenido  | ACF    |
| _politica_privacidad_contenido | ACF    |

---

## Media `attachment`

### Overview

Core post type. 
Used mostly for uploaded content, most usually media.

### Metadata

Currently attachments have no custom meta keys registered.

## Fotoperiodismo `fotoperiodismo`

### Overview

Custom post type.
Fotoperiodismo post type is used for photojournalism pieces.

### Metadata

This post type uses meta key for:
- A piece description, both long and short version.
- A repeatable fields for authors, including name and an URL for reference.
- A repeatable field for the gallery itself, which is output as a gallery on front-end.

<details>
<summary>
	<b>
		SQL query
	</b>
</summary>

```sql
SELECT DISTINCT meta_key
FROM wp_postmeta
WHERE post_id IN (
    SELECT ID FROM wp_posts WHERE post_type = 'fotoperiodismo'
)
AND meta_key NOT LIKE '_oembed_%'
AND meta_key NOT LIKE '_ct_%'
AND meta_key NOT LIKE '%oxygen%'
AND meta_key NOT LIKE '_wp%'
AND meta_key NOT LIKE '%cmplz%'
AND meta_key NOT LIKE '%rank_math%'
AND meta_key NOT LIKE '%ocean%'
AND meta_key NOT LIKE '%elementor%'
AND meta_key NOT LIKE '%yoast%'
AND meta_key NOT LIKE '%sws%'
AND meta_key NOT LIKE '%lyte%'
AND meta_key NOT LIKE '%vcv%'
AND meta_key NOT LIKE '%swift%'
AND meta_key NOT LIKE '%enclos%'
AND meta_key NOT LIKE '%_eos_%'
AND meta_key NOT LIKE '%_dp_%'
AND meta_key NOT LIKE '%ping%'
AND meta_key NOT IN (
    'post_grid_post_settings',
    '_advads_ad_settings',
    '_edit_last',
    '_thumbnail_id',
    '_cff_oembed_done_checking',
    '_edit_lock',
    'xyz_fbap',
    'footnotes',
    '_mi_skip_tracking'
)
AND meta_value IS NOT NULL
AND meta_value != ''
AND meta_value != '%5B%5D';
```
</details>

| meta_key                                                       | source             |
|----------------------------------------------------------------|--------------------|
| \_crb_enfantterrible_fotoperiodismo_authors\|\|\|0\|\_empty    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_authors\|\|\|0\|value      | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_authors\|\|\|1\|value      | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_authors\|link\|0\|0\|value | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_authors\|link\|1\|0\|value | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_authors\|nombre\|0\|0\|value | Camalote - Models |
| \_crb_enfantterrible_fotoperiodismo_authors\|nombre\|1\|0\|value | Camalote - Models |
| \_crb_enfantterrible_fotoperiodismo_desc_long                 | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_desc_short                | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|0\|\_empty   | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|0\|value     | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|1\|value     | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|10\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|11\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|12\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|13\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|14\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|15\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|16\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|17\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|18\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|19\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|2\|value     | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|20\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|21\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|22\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|23\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|24\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|25\|value    | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|3\|value     | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|4\|value     | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|5\|value     | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|6\|value     | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|7\|value     | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|8\|value     | Camalote - Models  |
| \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|9\|value     | Camalote - Models  |
| \_fotogaleria_autor                                           | ACF                |
| \_fotogaleria_autor_link                                      | ACF                |
| \_fotogaleria_descripcion                                     | ACF                |
| \_fotogaleria_descripcion_corta                               | ACF                |
| fotogaleria_autor                                             | ACF                |
| fotogaleria_autor_link                                        | ACF                |
| fotogaleria_descripcion                                       | ACF                |
| fotogaleria_descripcion_corta                                 | ACF                |


> [!note]
> Currently ACF is not used. 
> It is included in the results because of the nature of the SQL query, 
> but currently Camalote - Models handles the registration.

___


## Locales y beneficios `cf_beneficios`

### Overview

Custom post type.
This post type is mostly used to output data regarding alliances the organization has,
and which current subscribers can access.

### Metadata

This post type metadata includes:
- Alliance logo
- Name
- Description
- Market/niche
- Benefits (for current subscribers)
- Contact, including:
  - Phone number
  - Facebook profile
  - Instagram profile
  - Email
- Pack (which defines the alliance type; not really used anymore because of its fluid nature).

<details>
<summary>
	<b>
		SQL query
	</b>
</summary>

```sql
SELECT DISTINCT meta_key
FROM wp_postmeta
WHERE post_id IN (
    SELECT ID FROM wp_posts WHERE post_type = 'cf_beneficios'
)
AND meta_key NOT LIKE '_oembed_%'
AND meta_key NOT LIKE '_ct_%'
AND meta_key NOT LIKE '%oxygen%'
AND meta_key NOT LIKE '_wp%'
AND meta_key NOT LIKE '%cmplz%'
AND meta_key NOT LIKE '%rank_math%'
AND meta_key NOT LIKE '%ocean%'
AND meta_key NOT LIKE '%elementor%'
AND meta_key NOT LIKE '%yoast%'
AND meta_key NOT LIKE '%sws%'
AND meta_key NOT LIKE '%lyte%'
AND meta_key NOT LIKE '%vcv%'
AND meta_key NOT LIKE '%swift%'
AND meta_key NOT LIKE '%enclos%'
AND meta_key NOT LIKE '%_eos_%'
AND meta_key NOT LIKE '%_dp_%'
AND meta_key NOT LIKE '%ping%'
AND meta_key NOT IN (
    'post_grid_post_settings',
    '_advads_ad_settings',
    '_edit_last',
    '_thumbnail_id',
    '_cff_oembed_done_checking',
    '_edit_lock',
    'xyz_fbap',
    'footnotes',
    '_mi_skip_tracking'
)
AND meta_value IS NOT NULL
AND meta_value != ''
AND meta_value != '%5B%5D';
```
</details>

| meta_key                                                                  | source |
|---------------------------------------------------------------------------|--------|
| cf_locales-y-beneficios_imagen                                            | ACF    |
| _cf_locales-y-beneficios_imagen                                          | ACF    |
| cf_locales-y-beneficios_nombre                                            | ACF    |
| _cf_locales-y-beneficios_nombre                                          | ACF    |
| _cf_locales-y-beneficios_descripcion                                     | ACF    |
| _cf_locales-y-beneficios_rubro                                           | ACF    |
| cf_locales-y-beneficios_beneficio                                         | ACF    |
| _cf_locales-y-beneficios_beneficio                                       | ACF    |
| cf_locales-y-beneficios_contacto                                          | ACF    |
| _cf_locales-y-beneficios_contacto                                        | ACF    |
| cf_locales-y-beneficios_pack                                              | ACF    |
| _cf_locales-y-beneficios_pack                                            | ACF    |
| _cf_locales-y-beneficios_contacto-grupo_cf_locales-y-beneficios_telefono | ACF    |
| _cf_locales-y-beneficios_contacto-grupo_cf_locales-y-beneficios_facebook | ACF    |
| _cf_locales-y-beneficios_contacto-grupo_cf_locales-y-beneficios_instagram| ACF    |
| _cf_locales-y-beneficios_contacto-grupo_cf_locales-y-beneficios_email    | ACF    |
| _cf_locales-y-beneficios_contacto-grupo                                  | ACF    |

> [!note]
> Currently all subscribers are decoupled from the WP instance,
> via third party payment gateway.
> In the future, this could be tackled inside the WP instance.

___


## Certificaciones web `certificaciones_web`

### Overview

Custom post type.
This post type is used as ad slots,
with a set of complementary data for better tracking.

### Metadata

This post type metadata includes:
- Order code
- Status
- Start date
- End Date
- Asset (an image)
- Position
- Visibility
- Start screenshot
- End screenshot
- Notes

<details>
<summary>
	<b>
		SQL query
	</b>
</summary>

```sql
SELECT DISTINCT meta_key
FROM wp_postmeta
WHERE post_id IN (
    SELECT ID FROM wp_posts WHERE post_type = 'certificaciones_web'
)
AND meta_key NOT LIKE '_oembed_%'
AND meta_key NOT LIKE '_ct_%'
AND meta_key NOT LIKE '%oxygen%'
AND meta_key NOT LIKE '_wp%'
AND meta_key NOT LIKE '%cmplz%'
AND meta_key NOT LIKE '%rank_math%'
AND meta_key NOT LIKE '%ocean%'
AND meta_key NOT LIKE '%elementor%'
AND meta_key NOT LIKE '%yoast%'
AND meta_key NOT LIKE '%sws%'
AND meta_key NOT LIKE '%lyte%'
AND meta_key NOT LIKE '%vcv%'
AND meta_key NOT LIKE '%swift%'
AND meta_key NOT LIKE '%enclos%'
AND meta_key NOT LIKE '%_eos_%'
AND meta_key NOT LIKE '%_dp_%'
AND meta_key NOT LIKE '%ping%'
AND meta_key NOT IN (
    'post_grid_post_settings',
    '_advads_ad_settings',
    '_edit_last',
    '_thumbnail_id',
    '_cff_oembed_done_checking',
    '_edit_lock',
    'xyz_fbap',
    'footnotes',
    '_mi_skip_tracking'
)
AND meta_value IS NOT NULL
AND meta_value != ''
AND meta_value != '%5B%5D';
```
</details>


| meta_key                         | source |
|----------------------------------|--------|
| certificaciones_orden            | ACF    |
| _certificaciones_orden           | ACF    |
| certificaciones_link             | ACF    |
| _certificaciones_link            | ACF    |
| certificaciones_inicio           | ACF    |
| _certificaciones_inicio          | ACF    |
| certificaciones_final            | ACF    |
| _certificaciones_final           | ACF    |
| certificaciones_imagen           | ACF    |
| _certificaciones_imagen          | ACF    |
| certificaciones_estado           | ACF    |
| _certificaciones_estado          | ACF    |
| _certificaciones_notas           | ACF    |
| certificacion_screenshot_inicio  | ACF    |
| _certificacion_screenshot_inicio | ACF    |
| certificacion_screenshot_final   | ACF    |
| _certificacion_screenshot_final  | ACF    |
| certificaciones_posicion         | ACF    |
| _certificaciones_posicion        | ACF    |
| certificaciones_visibilidad      | ACF    |
| _certificaciones_visibilidad     | ACF    |
| certificaciones_notas            | ACF    |

___

## Dossiers `dossiers`

### Overview

Custom post type.
This post type is used for specific content collections,
that work around a specific subject or context.

It is basically a regular `post` post type,
managed through hierarchical relationship with its children.

So basically a `dossiers` is defined as a post type 
that includes its childrens.
The top level `dossiers` works as the parent and archive.

### Metadata

This post type metadata includes:
- An excerpt for top level `dossiers`.
- A featured image for top level `dossiers`.
- An excerpt for each individual `dossiers` children.
- An authors field for each individual `dossiers` children, including:
  - Name
  - URL (for reference)
- A field that sets whether is an interview or not.

<details>
<summary>
	<b>
		SQL query
	</b>
</summary>

```sql
SELECT DISTINCT meta_key
FROM wp_postmeta
WHERE post_id IN (
    SELECT ID FROM wp_posts WHERE post_type = 'dossiers'
)
AND meta_key NOT LIKE '_oembed_%'
AND meta_key NOT LIKE '_ct_%'
AND meta_key NOT LIKE '%oxygen%'
AND meta_key NOT LIKE '_wp%'
AND meta_key NOT LIKE '%cmplz%'
AND meta_key NOT LIKE '%rank_math%'
AND meta_key NOT LIKE '%ocean%'
AND meta_key NOT LIKE '%elementor%'
AND meta_key NOT LIKE '%yoast%'
AND meta_key NOT LIKE '%sws%'
AND meta_key NOT LIKE '%lyte%'
AND meta_key NOT LIKE '%vcv%'
AND meta_key NOT LIKE '%swift%'
AND meta_key NOT LIKE '%enclos%'
AND meta_key NOT LIKE '%_eos_%'
AND meta_key NOT LIKE '%_dp_%'
AND meta_key NOT LIKE '%ping%'
AND meta_key NOT IN (
    'post_grid_post_settings',
    '_advads_ad_settings',
    '_edit_last',
    '_thumbnail_id',
    '_cff_oembed_done_checking',
    '_edit_lock',
    'xyz_fbap',
    'footnotes',
    '_mi_skip_tracking'
)
AND meta_value IS NOT NULL
AND meta_value != ''
AND meta_value != '%5B%5D';
```
</details>

| meta_key                | source       |
|-------------------------|--------------|
| dossier_archivo_bajada  | Lazy Blocks  |
| _dossier_archivo_bajada | Lazy Blocks  |
| dossier_bajada          | Lazy Blocks  |
| dossier_autorxs         | Lazy Blocks  |
| dossier_es_entrevista   | Lazy Blocks  |
| dossier_archivo_imagen  | Lazy Blocks  |

---

## Artículos Invitados `articulos-invitados`

### Overview

Custom post type.
This post type is used for guest articles,
mostly from third party link building strategies.

It is basically a regular `post` post type.

### Metadata

This post type metadata inherits a custom field from `post`,
which is `notas_bajada`.

> [!note]
> `notas_bajada` custom field should be migrated to a more
> semantic approach. 

<details>
<summary>
	<b>
		SQL query
	</b>
</summary>

```sql
SELECT DISTINCT meta_key
FROM wp_postmeta
WHERE post_id IN (
    SELECT ID FROM wp_posts WHERE post_type = 'articulos-invitados'
)
AND meta_key NOT LIKE '_oembed_%'
AND meta_key NOT LIKE '_ct_%'
AND meta_key NOT LIKE '%oxygen%'
AND meta_key NOT LIKE '_wp%'
AND meta_key NOT LIKE '%cmplz%'
AND meta_key NOT LIKE '%rank_math%'
AND meta_key NOT LIKE '%ocean%'
AND meta_key NOT LIKE '%elementor%'
AND meta_key NOT LIKE '%yoast%'
AND meta_key NOT LIKE '%sws%'
AND meta_key NOT LIKE '%lyte%'
AND meta_key NOT LIKE '%vcv%'
AND meta_key NOT LIKE '%swift%'
AND meta_key NOT LIKE '%enclos%'
AND meta_key NOT LIKE '%_eos_%'
AND meta_key NOT LIKE '%_dp_%'
AND meta_key NOT LIKE '%ping%'
AND meta_key NOT IN (
    'post_grid_post_settings',
    '_advads_ad_settings',
    '_edit_last',
    '_thumbnail_id',
    '_cff_oembed_done_checking',
    '_edit_lock',
    'xyz_fbap',
    'footnotes',
    '_mi_skip_tracking'
)
AND meta_value IS NOT NULL
AND meta_value != ''
AND meta_value != '%5B%5D';
```
</details>

| meta_key                | source       |
|-------------------------|--------------|
| notas_bajada            | Lazy Blocks  |

---

## Table view

| post_type | meta_key                          | source       |
|----------------------------------|--------------|--------------------|
| post | notas_bajada                     | Lazy Blocks  |
| post | nota_de_tapa_selector_primaria   | ACF          |
| post | _nota_de_tapa_selector_primaria  | ACF          |
| post | nota_de_tapa_selector_secundaria | ACF          |
| post | _nota_de_tapa_selector_secundaria| ACF          |
| post | nota_de_tapa_selector_terciaria  | ACF          |
| post | _nota_de_tapa_selector_terciaria | ACF          |
| post | nota_inicio_entrevista           | ACF          |
| post | _nota_inicio_entrevista          | ACF          |
| post | nota_de_tapa_selector            | ACF          |
| post | _nota_de_tapa_selector           | ACF          |
| page | politica_privacidad_contenido  | ACF    |
| page | _politica_privacidad_contenido | ACF    |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_authors\|\|\|0\|\_empty    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_authors\|\|\|0\|value      | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_authors\|\|\|1\|value      | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_authors\|link\|0\|0\|value | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_authors\|link\|1\|0\|value | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_authors\|nombre\|0\|0\|value | Camalote - Models |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_authors\|nombre\|1\|0\|value | Camalote - Models |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_desc_long                 | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_desc_short                | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|0\|\_empty   | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|0\|value     | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|1\|value     | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|10\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|11\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|12\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|13\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|14\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|15\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|16\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|17\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|18\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|19\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|2\|value     | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|20\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|21\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|22\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|23\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|24\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|25\|value    | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|3\|value     | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|4\|value     | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|5\|value     | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|6\|value     | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|7\|value     | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|8\|value     | Camalote - Models  |
| fotoperiodismo | \_crb_enfantterrible_fotoperiodismo_gallery\|\|\|9\|value     | Camalote - Models  |
| fotoperiodismo | \_fotogaleria_autor                                           | ACF                |
| fotoperiodismo | \_fotogaleria_autor_link                                      | ACF                |
| fotoperiodismo | \_fotogaleria_descripcion                                     | ACF                |
| fotoperiodismo | \_fotogaleria_descripcion_corta                               | ACF                |
| fotoperiodismo | fotogaleria_autor                                             | ACF                |
| fotoperiodismo | fotogaleria_autor_link                                        | ACF                |
| fotoperiodismo | fotogaleria_descripcion                                       | ACF                |
| fotoperiodismo | fotogaleria_descripcion_corta                                 | ACF                |
| cf_beneficios | cf_locales-y-beneficios_imagen                                            | ACF    |
| cf_beneficios | _cf_locales-y-beneficios_imagen                                          | ACF    |
| cf_beneficios | cf_locales-y-beneficios_nombre                                            | ACF    |
| cf_beneficios | _cf_locales-y-beneficios_nombre                                          | ACF    |
| cf_beneficios | _cf_locales-y-beneficios_descripcion                                     | ACF    |
| cf_beneficios | _cf_locales-y-beneficios_rubro                                           | ACF    |
| cf_beneficios | cf_locales-y-beneficios_beneficio                                         | ACF    |
| cf_beneficios | _cf_locales-y-beneficios_beneficio                                       | ACF    |
| cf_beneficios | cf_locales-y-beneficios_contacto                                          | ACF    |
| cf_beneficios | _cf_locales-y-beneficios_contacto                                        | ACF    |
| cf_beneficios | cf_locales-y-beneficios_pack                                              | ACF    |
| cf_beneficios | _cf_locales-y-beneficios_pack                                            | ACF    |
| cf_beneficios | _cf_locales-y-beneficios_contacto-grupo_cf_locales-y-beneficios_telefono | ACF    |
| cf_beneficios | _cf_locales-y-beneficios_contacto-grupo_cf_locales-y-beneficios_facebook | ACF    |
| cf_beneficios | _cf_locales-y-beneficios_contacto-grupo_cf_locales-y-beneficios_instagram| ACF    |
| cf_beneficios | _cf_locales-y-beneficios_contacto-grupo_cf_locales-y-beneficios_email    | ACF    |
| cf_beneficios | _cf_locales-y-beneficios_contacto-grupo                                  | ACF    |
| certificaciones_web | certificaciones_orden            | ACF    |
| certificaciones_web | _certificaciones_orden           | ACF    |
| certificaciones_web | certificaciones_link             | ACF    |
| certificaciones_web | _certificaciones_link            | ACF    |
| certificaciones_web | certificaciones_inicio           | ACF    |
| certificaciones_web | _certificaciones_inicio          | ACF    |
| certificaciones_web | certificaciones_final            | ACF    |
| certificaciones_web | _certificaciones_final           | ACF    |
| certificaciones_web | certificaciones_imagen           | ACF    |
| certificaciones_web | _certificaciones_imagen          | ACF    |
| certificaciones_web | certificaciones_estado           | ACF    |
| certificaciones_web | _certificaciones_estado          | ACF    |
| certificaciones_web | _certificaciones_notas           | ACF    |
| certificaciones_web | certificacion_screenshot_inicio  | ACF    |
| certificaciones_web | _certificacion_screenshot_inicio | ACF    |
| certificaciones_web | certificacion_screenshot_final   | ACF    |
| certificaciones_web | _certificacion_screenshot_final  | ACF    |
| certificaciones_web | certificaciones_posicion         | ACF    |
| certificaciones_web | _certificaciones_posicion        | ACF    |
| certificaciones_web | certificaciones_visibilidad      | ACF    |
| certificaciones_web | _certificaciones_visibilidad     | ACF    |
| certificaciones_web | certificaciones_notas            | ACF    |
| dossiers | dossier_archivo_bajada  | Lazy Blocks  |
| dossiers | _dossier_archivo_bajada | Lazy Blocks  |
| dossiers | dossier_bajada          | Lazy Blocks  |
| dossiers | dossier_autorxs         | Lazy Blocks  |
| dossiers | dossier_es_entrevista   | Lazy Blocks  |
| dossiers | dossier_archivo_imagen  | Lazy Blocks  |
| articulos-invitados | notas_bajada            | Lazy Blocks  |