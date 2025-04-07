# Audit

**Owner**: Martín García  
**Last Updated**: 01/04/2025  
**URL**: `https://github.com/enfantterrible-ar/wp/docs/AUDIT.md`  

---

## Templates


| ID    | Post Title             | Post Name              | Post Date           | Post Status |
|-------|------------------------|------------------------|---------------------|-------------|
| 32722 | CTA - Newsletter       | cta-newsletter         | 2023-10-14 20:15:26 | publish     |
| 32721 | CTA - Asociarse        | cta-asociarse          | 2023-10-14 20:14:56 | publish     |
| 19219 | Dossier - Individual   | dossier-individual     | 2022-03-28 21:16:08 | publish     |
| 8794  | Search Results         | resultados-de-busqueda | 2020-07-02 18:00:54 | publish     |
| 8793  | Archives - Author      | archives-author        | 2020-07-02 15:23:01 | publish     |
| 6131  | Archives - Fotogalería | fotogaleria-archive    | 2020-04-03 02:17:53 | publish     |
| 6124  | Single - Fotogalería   | single-fotogaleria     | 2020-04-02 18:50:12 | publish     |
| 5627  | Archives - Post        | archives-post          | 2020-03-10 13:24:46 | publish     |
| 5626  | Single - Post          | single-post            | 2020-03-10 13:19:37 | publish     |
| 5623  | Catch all              | catch-all              | 2020-03-10 13:09:28 | publish     |

### Considerations:

- **CTA - [**]**: these are reusable Oxygen components, nominally `templates` but functionally components.
- **Singles**:
    -  Post
    - Fotogalería
    - Dossier (post type not used at the time, but still holds valuable content).
- **Archives**:
    - Post
    - Fotogalerías
- **Search Results**
- **Catch All** (global layout; basically contains header, an output for the content, and a footer).

---

## Plugins

> [!IMPORTANT]
> The raw data is in [**`plugins_audit.csv`**](../docs/assets/plugins_audit.csv), with a formatted version in [**`plugins_audit.xlsx`**](../docs/assets/plugins_audit.xlsx), and a PDF export in [**`plugins_audit.pdf`**](../docs/assets/plugins_audit.pdf).

### Overall totals

**Total Plugins:** 
- 65 plugins

**By Action (Goal):**
- Deprecate: 22 plugins
- Migrate: 35 plugins
- Replace: 8 plugins

### Breakdown by goal

#### Deprecate (22 Plugins)

- **Custom (4 plugins)**
	- Camalote - Custom fonts
	- Camalote - Gutenberg Winden Integration
	- Camalote - Winden Easy Posts Fix
	- Winden - Flowbite extension

- **Third‑Party (18 plugins)**
	- Asset CleanUp: Page Speed Booster
	- Flying Images
	- Imsanity
	- Oxygen
	- Oxygen builder functions
	- Oxygen Gutenberg Integration
	- Winden
	- Custom Simple Rss
	- Featured Images in RSS for Mailchimp & More
	- Application Passwords
	- Duplicate Menu
	- Duplicate Page
	- Maintenance
	- Query Monitor
	- Regenerate Thumbnails
	- Under Construction
	- WP Rollback
	- WP STAGING WordPress Backup Plugin - Backup Duplicator & Migration

#### Replace (8 Plugins)

- **Custom (5 plugins)**
	- Camalote - Models
	- Camalote - Disable media sizes
	- Camalote - Ajax Load More extension
	- Camalote - Librerías globales
	- Librerías personalizadas de Enfant Terrible

- **Third‑Party (3 plugins)**
	- Advanced Custom Fields
	- Custom Post Type UI
	- Reading Time WP

### Migrate (35 plugins)
- Total: 35 plugins

###  Breakdown by status (must-use, drop-in)

#### Must-Use Plugins (8 plugins)
- GridPane Block Username Enumeration
- GridPane Disable XMLRPC
- GridPane Nginx Cache Purger
- GridPane Remove WP Version
- WP CLI Login Command Server
- WP fail2ban
- freesoul deactivate plugins [fdp]
- WP STAGING Optimizer

#### Drop‑in Plugins (1 plugin)
- Redis Object Cache Drop-In

### Summary of Usage, Patterns & Key Data

#### Deprecate Category Patterns:

- Many deprecate entries (especially among third‑party plugins) include notes like “70:30 for deprecation,” indicating a usage split where these plugins are less critical or underutilized.

- These plugins are slated for elimination, so we need to ensure that any dependencies or alternative solutions are identified before removal.

#### Replace Category Focus:

- The replace category largely involves custom plugins where in‑house functionality is preferred.

- This group includes custom post type registration and UX enhancements, suggesting that future development should focus on tighter integration with core systems.

#### Migrate Category:

- With 35 plugins marked for migration, this category is the largest.

- The strategy here is to keep these plugins “as‑is,” preserving their current functionality while potentially looking into future consolidation or optimization.

#### Non‑Active Entries (mu‑Plugins & Drop‑ins):

- These plugins (8 mu‑plugins and 1 drop‑in) are critical from an infrastructure standpoint.

#### General Considerations:

##### Functional Overlap

There appears to be overlap in optimization and utility functions, suggesting a potential for future consolidation after the initial deprecation/migration/replacement steps.

##### Update & Maintenance

Several plugins include recent WP.org update dates and 
version numbers. This indicates ongoing maintenance, which should be considered when planning transitions.

##### Workflow Impact

Specific plugins (e.g., Lazy Blocks in the migrate category) are noted as critical to content creation workflows and must be prioritized during any transition process.

---

## Code Snippets
### 1. Generador de placas CSS (d)

- **Purpose:**  
  Inject custom CSS into a specific page.

- **What It Does:**  
  Checks if the current page has the designated ID (15842) and, if so, outputs an inline `<style>` block. This block includes multiple `@font-face` declarations for the "Raleway" font across different Unicode ranges along with extensive CSS rules for layout, typography, sliders, buttons, and SVG dividers.

<details>
<summary><b>Code</b></summary>

```php

function generador_placas_css() {
	if (is_page(15842)) {
	?>
	<style>
		/* cyrillic-ext */
		@font-face {
			font-family: 'Raleway';
			font-style: normal;
			font-weight: 700;
			font-display: swap;
			src: url(https://fonts.gstatic.com/s/raleway/v22/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pbCFPrcVIT9d0c-dYA.woff) format('woff');
			unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
		}
		/* cyrillic */
		@font-face {
			font-family: 'Raleway';
			font-style: normal;
			font-weight: 700;
			font-display: swap;
			src: url(https://fonts.gstatic.com/s/raleway/v22/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pbCMPrcVIT9d0c-dYA.woff) format('woff');
			unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
		}
		/* vietnamese */
		@font-face {
			font-family: 'Raleway';
			font-style: normal;
			font-weight: 700;
			font-display: swap;
			src: url(https://fonts.gstatic.com/s/raleway/v22/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pbCHPrcVIT9d0c-dYA.woff) format('woff');
			unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
		}
		/* latin-ext */
		@font-face {
			font-family: 'Raleway';
			font-style: normal;
			font-weight: 700;
			font-display: swap;
			src: url(https://fonts.gstatic.com/s/raleway/v22/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pbCGPrcVIT9d0c-dYA.woff) format('woff');
			unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
		}
		/* latin */
		@font-face {
			font-family: 'Raleway';
			font-style: normal;
			font-weight: 700;
			font-display: swap;
			src: url(https://fonts.gstatic.com/s/raleway/v22/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pbCIPrcVIT9d0c8.woff) format('woff');
			unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
		}

		:root {
			--white: #F5F3F4;
			--light-gray: #D3D3D3;
			--gray: #B1A7A6;
		}
		* {
			box-sizing: border-box;
		}

		.post-select {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}

		.row {
			display:flex;
			/*flex-flow: row nowrap; */
			width:100%;
			max-width:640px;
			flex-direction: column-reverse;
			margin: 0 auto;
			padding: 16px;
			box-sizing: content-box;
			background-color: #F9F9FA;
		}
		.controls {
			padding:16px;
			display:flex;
			flex-direction:row;
			flex-wrap: wrap;
			justify-content:center;
			align-content: flex-start;
			align-items:center;
			position:relative;
			font-family: 'Arial', sans-serif;
		}

		.controls > * {
			width:100%;
		}

		.control-row {
			display: flex;
			align-items: flex-start;
			justify-content: center;
			flex-direction: row;
			padding: 8px;
		}

		.control-row .change-text,
		.control-row .highlight-select,
		.font-size-select > *,
		.post-select > *,
		.wide-select > *,
		.font-size-select > * {
			padding:8px;
		}

		.control-row .change-text,
		.control-row .highlight-select,
		.control-row .change-image {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}

		.change-text .textarea-change-text,
		.highlight-select .select-highlight{
			resize: none;
			width: 100%;
			font-family: inherit;
			padding: 8px;
			border-radius: 4px;
		}

		.wide-select,
		.font-size-select {
			align-items:flex-start;
		}

		.font-size-select input {
			margin:0 8px;
			padding: 4px 8px;
			border-radius:4px;
			border:1px solid var(--light-gray);
		}

		.wide-select,
		.font-size-select {
			display:flex;
			flex-direction:row-reverse;
			align-items:center;
		}

		.wide-select,
		.font-size-select,
		.font-buttons-select {
			width:auto;
		}

		.font-buttons-select input[type=checkbox],
		.font-buttons-select input[type=radio]{
			display: none;
		}

		.wide-select,
		.font-size-select {
			margin: -3px;
			margin-left: 1px;
		}
		.wide-select,
		.font-size-select,
		.font-buttons-select .label,
		.font-buttons-select .button {
			border: 1px solid var(--light-gray);
		}

		.font-buttons-select .label,
		.font-buttons-select .button {
			display: inline-flex;
			padding: 8px;
			margin: -3px;
		}
		.font-buttons-select input[type=checkbox]:checked + .label,
		.font-buttons-select input[type=radio]:checked + .label,
		.font-buttons-select .button:focus {
			background: var(--light-gray);
			border: 1px solid var(--gray);
		}


		.slider-wrapper {
			width:100px;
			padding:8px;
			padding-right: 16px;
			margin-right:auto;
		}
		/* the slider bar */
		.slider {
			position: relative;
			width: 100%;
			height: .5em;
			padding:0;
			padding-left:100%;
			max-height:.5em;
			background-color: #29e;
			border-radius: 0.5em;
			box-sizing: border-box;

			font-size: 1em;

			-ms-touch-action: none;
			touch-action: none;
		}

		/* the slider handle */
		.slider:before {
			content: "";
			display: block;
			position: relative;
			top: -.5em;
			width: 1.5em;
			height: 1.5em;
			margin-left: -.75em;
			border: solid 0.25em #fff;
			border-radius: 1em;
			background-color: inherit;

			box-sizing: border-box;
		}
		.download-button {
			margin: 16px auto;
			padding: 8px 16px;
			border-radius: 4px;
			border: none;
			background-color: #171122;
			cursor: pointer;
			color:#F9F9FA;
			font-family: 'Raleway', sans-serif;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: row;
		}

		.download-button svg {
			width: 24px;
			margin-right: 4px;
		}

		.wrapper {
			width:640px;
			height:800px;
			padding:32px;
			background:red;
			display:flex;
			justify-content:center;
			align-items:center;
			background-image:url(https://source.unsplash.com/random);
			background-size: cover;
			background-position: center;
			background-repeat:no-repeat;
			position:relative;
		}

		.row-stories-1 .wrapper,
		.row-stories-2 .wrapper,
		.row-stories-3 .wrapper {
			height: 1137.7px;
			width:640px;
			padding: 0;
			display: flex;
			flex-direction: column;
			background-image:unset;
			background:white;
			align-items: flex-start;
		}

		.row-stories-1 .wrapper-background,
		.row-stories-2 .wrapper-background,
		.row-stories-3 .wrapper-background {
			position: relative;
			height: 60%;
			width: 100%;
			background: white;
			background-image: url(https://source.unsplash.com/random);
			background-position: center;
			background-size: cover;
		}

		.footer {
			position:absolute;
			bottom:0px;
			left:32px;
			color:white;
			font-family:'Arial', sans-serif;
			font-size:24px;
			letter-spacing:1px;
			padding:8px;
			display: flex;
			align-content: center;
			align-items: center;
			width:90%;
		}

		.row-stories-1 .footer,
		.row-stories-2 .footer,
		.row-stories-3 .footer {
			color:black;
			position: relative;
			margin-bottom: 32px;
			margin-top: 0;
		}

		.footer span {
			position:relative;
			padding-left:32px;
			margin-left: -8px;
		}
		.footer svg {
			width: 24px;
			height: auto;
			fill: white;
			transform: rotate(45deg);
			position: absolute;
			left: 6px;
			top: -10px;
		}

		.row-stories-1 .footer svg,
		.row-stories-2 .footer svg,
		.row-stories-3 .footer svg {
			fill:black;
		}

		.overlay {
			position:absolute;
			top:0;
			left:0;
			right:0;
			bottom:0;
			background-color: hsla(0, 0%, 0%, 60%);
		}

		.row-stories-1 .overlay,
		.row-stories-2 .overlay,
		.row-stories-3 .overlay {
			display:none;
		}

		.wrapper-padding {
			display: flex;
			align-items: center;
			width:100%;
			height:100%;
			position:relative;
		}

		.row-stories-1 .wrapper-padding,
		.row-stories-2 .wrapper-padding,
		.row-stories-3 .wrapper-padding {
			height: 40%;
			padding: 32px;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			z-index: 999999999;
			margin-top: -1px;
			background-color: white;
		}

		.row-stories-1 .logo,
		.row-stories-2 .logo,
		.row-stories-3 .logo {
			position: relative;
			top: unset;
			right: unset;
			left:-16px;
			width: auto;
			display: block;
		}
		.logo {
			position: absolute;
			top: 0;
			right: 0;
			width: 64px;
			display: block;
		}
		.title {
			width:100%;
			position:relative;
			height:auto;
			font-family:'Raleway', sans-serif;
			font-weight:700;
			text-transform:uppercase;
			color:white;
			font-size:28px;
			line-height:2;
			display:inline-table;
			white-space: pre-wrap; 

		}

		.row-feed-2 .title,
		.row-feed-3 .title,
		.row-stories-2 .title,
		.row-stories-3 .title {
			font-size:20px;
		}

		.title p {
			margin:0;
			display:inline;
			padding: 0.25rem 0;
			overflow:hidden;
			background-color:#171122;
			box-shadow: 0.25rem 0 0 #171122, -0.25rem 0 0 #171122;
			-webkit-box-decoration-break: clone;
			-ms-box-decoration-break: clone;
			-o-box-decoration-break: clone;
			box-decoration-break: clone;
		}

		.title .highlight {
			background-color:#A1464A;
			box-shadow: 0.25rem 0 0 #A1464A, -0.25rem 0 0 #A1464A;
			padding-top: .25rem;
			padding-bottom: .25rem;
			-webkit-box-decoration-break: clone;
			-ms-box-decoration-break: clone;
			-o-box-decoration-break: clone;
			box-decoration-break: clone;
		}

		.title:after,
		.logo:after {
			opacity:0;
		}
		.title:hover:after,
		.logo:hover:after{
			content: "";
			position: absolute;
			left: -4px;
			top: -4px;
			right: -4px;
			bottom: -4px;
			border-width: 2px;
			border-style: dashed;
			border-color: gray;
			border-radius:2px;
			opacity:.5;

		}
		.ss-main{position:relative;display:inline-block;user-select:none;color:#666;width:100%}.ss-main .ss-single-selected{display:flex;cursor:pointer;width:100%;height:30px;padding:6px;border:1px solid #dcdee2;border-radius:4px;background-color:#fff;outline:0;box-sizing:border-box;transition:background-color .2s}.ss-main .ss-single-selected.ss-disabled{background-color:#dcdee2;cursor:not-allowed}.ss-main .ss-single-selected.ss-open-above{border-top-left-radius:0;border-top-right-radius:0}.ss-main .ss-single-selected.ss-open-below{border-bottom-left-radius:0;border-bottom-right-radius:0}.ss-main .ss-single-selected .placeholder{flex:1 1 100%;text-align:left;width:calc(100% - 30px);line-height:1em;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ss-main .ss-single-selected .placeholder,.ss-main .ss-single-selected .placeholder *{display:flex;align-items:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ss-main .ss-single-selected .placeholder *{width:auto}.ss-main .ss-single-selected .placeholder .ss-disabled{color:#dedede}.ss-main .ss-single-selected .ss-deselect{display:flex;align-items:center;justify-content:flex-end;flex:0 1 auto;margin:0 6px;font-weight:700}.ss-main .ss-single-selected .ss-deselect.ss-hide{display:none}.ss-main .ss-single-selected .ss-arrow{display:flex;align-items:center;justify-content:flex-end;flex:0 1 auto;margin:0 6px}.ss-main .ss-single-selected .ss-arrow span{border:solid #666;border-width:0 2px 2px 0;display:inline-block;padding:3px;transition:transform .2s,margin .2s}.ss-main .ss-single-selected .ss-arrow span.arrow-up{transform:rotate(-135deg);margin:3px 0 0}.ss-main .ss-single-selected .ss-arrow span.arrow-down{transform:rotate(45deg);margin:-3px 0 0}.ss-main .ss-multi-selected{display:flex;flex-direction:row;cursor:pointer;min-height:30px;width:100%;padding:0 0 0 3px;border:1px solid #dcdee2;border-radius:4px;background-color:#fff;outline:0;box-sizing:border-box;transition:background-color .2s}.ss-main .ss-multi-selected.ss-disabled{background-color:#dcdee2;cursor:not-allowed}.ss-main .ss-multi-selected.ss-disabled .ss-values .ss-disabled{color:#666}.ss-main .ss-multi-selected.ss-disabled .ss-values .ss-value .ss-value-delete{cursor:not-allowed}.ss-main .ss-multi-selected.ss-open-above{border-top-left-radius:0;border-top-right-radius:0}.ss-main .ss-multi-selected.ss-open-below{border-bottom-left-radius:0;border-bottom-right-radius:0}.ss-main .ss-multi-selected .ss-values{display:flex;flex-wrap:wrap;justify-content:flex-start;flex:1 1 100%;width:calc(100% - 30px)}.ss-main .ss-multi-selected .ss-values .ss-disabled{display:flex;padding:4px 5px;margin:2px 0;line-height:1em;align-items:center;width:100%;color:#dedede;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@keyframes scaleIn{0%{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}@keyframes scaleOut{0%{transform:scale(1);opacity:1}to{transform:scale(0);opacity:0}}.ss-main .ss-multi-selected .ss-values .ss-value{display:flex;user-select:none;align-items:center;font-size:12px;padding:3px 5px;margin:3px 5px 3px 0;color:#fff;background-color:#5897fb;border-radius:4px;animation-name:scaleIn;animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:both}.ss-main .ss-multi-selected .ss-values .ss-value.ss-out{animation-name:scaleOut;animation-duration:.2s;animation-timing-function:ease-out}.ss-main .ss-multi-selected .ss-values .ss-value .ss-value-delete{margin:0 0 0 5px;cursor:pointer}.ss-main .ss-multi-selected .ss-add{display:flex;flex:0 1 3px;margin:9px 12px 0 5px}.ss-main .ss-multi-selected .ss-add .ss-plus{display:flex;justify-content:center;align-items:center;background:#666;position:relative;height:10px;width:2px;transition:transform .2s}.ss-main .ss-multi-selected .ss-add .ss-plus:after{background:#666;content:"";position:absolute;height:2px;width:10px;left:-4px;top:4px}.ss-main .ss-multi-selected .ss-add .ss-plus.ss-cross{transform:rotate(45deg)}.ss-content{position:absolute;width:100%;margin:-1px 0 0;box-sizing:border-box;border:1px solid #dcdee2;z-index:1010;background-color:#fff;transform-origin:center top;transition:transform .2s,opacity .2s;opacity:0;transform:scaleY(0)}.ss-content.ss-open{display:block;opacity:1;transform:scaleY(1)}.ss-content .ss-search{display:flex;flex-direction:row;padding:8px 8px 6px}.ss-content .ss-search.ss-hide,.ss-content .ss-search.ss-hide input{height:0;opacity:0;padding:0;margin:0}.ss-content .ss-search input{display:inline-flex;font-size:inherit;line-height:inherit;flex:1 1 auto;width:100%;min-width:0;height:30px;padding:6px 8px;margin:0;border:1px solid #dcdee2;border-radius:4px;background-color:#fff;outline:0;text-align:left;box-sizing:border-box;-webkit-box-sizing:border-box;-webkit-appearance:textfield}.ss-content .ss-search input::placeholder{color:#8a8a8a;vertical-align:middle}.ss-content .ss-search input:focus{box-shadow:0 0 5px #5897fb}.ss-content .ss-search .ss-addable{display:inline-flex;justify-content:center;align-items:center;cursor:pointer;font-size:22px;font-weight:700;flex:0 0 30px;height:30px;margin:0 0 0 8px;border:1px solid #dcdee2;border-radius:4px;box-sizing:border-box}.ss-content .ss-addable{padding-top:0}.ss-content .ss-list{max-height:200px;overflow-x:hidden;overflow-y:auto;text-align:left}.ss-content .ss-list .ss-optgroup .ss-optgroup-label{padding:6px 10px;font-weight:700}.ss-content .ss-list .ss-optgroup .ss-option{padding:6px 6px 6px 25px}.ss-content .ss-list .ss-optgroup-label-selectable{cursor:pointer}.ss-content .ss-list .ss-optgroup-label-selectable:hover{color:#fff;background-color:#5897fb}.ss-content .ss-list .ss-option{padding:6px 10px;cursor:pointer;user-select:none}.ss-content .ss-list .ss-option *{display:inline-block}.ss-content .ss-list .ss-option.ss-highlighted,.ss-content .ss-list .ss-option:hover{color:#fff;background-color:#5897fb}.ss-content .ss-list .ss-option.ss-disabled{cursor:not-allowed;color:#dedede;background-color:#fff}.ss-content .ss-list .ss-option:not(.ss-disabled).ss-option-selected{color:#666;background-color:rgba(88,151,251,.1)}.ss-content .ss-list .ss-option.ss-hide{display:none}.ss-content .ss-list .ss-option .ss-search-highlight{background-color:#fffb8c}


		/* SVG DIVIDER */ 

		.custom-shape-divider-bottom-1630418329 {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			overflow: hidden;
			line-height: 0;
			transform: rotate(180deg);
		}

		.custom-shape-divider-bottom-1630418329 svg {
			position: relative;
			display: block;
			width: calc(161% + 1.3px);
			height: 120px;
		}

		.custom-shape-divider-bottom-1630418329 .shape-fill {
			fill: #FFFFFF;
		}
	</style>
	<?php
	}
}
add_action('wp_head', 'generador_placas_css');

```

</details>

### 2. Post - Cambiar valores de nota de tapa anteriores en caso de nuevo post (e)
- **Purpose:**  
  Maintain consistent meta values for featured notes and interviews within posts.

- **What It Does:**  
  On saving a post, the function examines specific meta fields to determine if a post is marked as a primary, secondary, or tertiary featured note or as an interview. Based on these flags, it resets conflicting meta fields and iterates through other posts to ensure that only one post retains a particular featured note status at any given time.

<details>
<summary><b>Code</b></summary>

```php
add_action( 'save_post', 'cambiar_valores_nota_tapa', 10,3 );

function cambiar_valores_nota_tapa ( $post_id, $savedPost, $update ) {

    // Only set for post_type = post
    if ( 'post' !== $savedPost->post_type ) {
        return;
    }

	// Check if post has desired meta value
	
	// Cuando se selecciona como nota de tapa, secundaria o terciaria...
	if ( get_post_meta( $savedPost->ID, 'nota_de_tapa_selector_primaria', true ) == '1' 
		or get_post_meta( $savedPost->ID, 'nota_de_tapa_selector_secundaria', true ) == '1' 
		or get_post_meta( $savedPost->ID, 'nota_de_tapa_selector_terciaria', true ) == '1'){

		// Se borran los valores meta de seccion entrevista
		update_post_meta( $savedPost->ID, 'nota_inicio_entrevista', '0' );
	}
	
	// Cuando se selecciona como entrevista...
	if ( get_post_meta( $savedPost->ID, 'nota_inicio_entrevista', true ) == '1' ){
		
		// Se borran los valores meta de nota de tapa, secundaria y terciaria
		update_post_meta( $savedPost->ID, 'nota_de_tapa_selector_primaria', '0' );
		update_post_meta( $savedPost->ID, 'nota_de_tapa_selector_secundaria', '0' );
		update_post_meta( $savedPost->ID, 'nota_de_tapa_selector_terciaria', '0' );
	}
	
	// Cuando se selecciona como nota de tapa...
	if ( get_post_meta( $savedPost->ID, 'nota_de_tapa_selector_primaria', true ) == '1' ){ 
        // Set the arguments for the query
        $args = array(
            'post_type' =>  'post',
			'numberposts' => -1,
			'posts_per_page' => -1,
        );
		
        $postsList = get_posts( $args );
        foreach ($postsList as $post) { //Remove the category from the found posts
            if ($post->ID == $post_id ) //but skip the just saved post
                  continue;
            update_post_meta( $post->ID, 'nota_de_tapa_selector_primaria', '0' );
        }
    }
	
	// Cuando se selecciona como nota de tapa secundaria...
    if ( get_post_meta( $savedPost->ID, 'nota_de_tapa_selector_secundaria', true ) == '1' ){ 
        // Set the arguments for the query
        $args = array(
            'post_type' =>  'post',
			'numberposts' => -1,
			'posts_per_page' => -1,
        );
		
        $postsList = get_posts( $args );
        foreach ($postsList as $post) { //Remove the category from the found posts
            if ($post->ID == $post_id ) //but skip the just saved post
                  continue;
            update_post_meta( $post->ID, 'nota_de_tapa_selector_secundaria', '0' );
        }
    }
	
	// Cuando se selecciona como nota de tapa terciaria...
    if ( get_post_meta( $savedPost->ID, 'nota_de_tapa_selector_terciaria', true ) == '1' ){ 
        // Set the arguments for the query
        $args = array(
            'post_type' =>  'post',
			'numberposts' => -1,
			'posts_per_page' => -1,
        );
		
        $postsList = get_posts( $args );
        foreach ($postsList as $post) { //Remove the category from the found posts
            if ($post->ID == $post_id ) //but skip the just saved post
                  continue;
            update_post_meta( $post->ID, 'nota_de_tapa_selector_terciaria', '0' );
        }
    }
}
```

</details>

### 3. Related posts (e)
- **Purpose:**  
  Retrieve posts that are related by category.

- **What It Does:**  
  Collects the category terms for a given post and constructs a query to fetch a specified number of random posts that share at least one of those categories, excluding the current post. This functionality aids in dynamically displaying related content.

<details>
<summary><b>Code</b></summary>

```php
function codeless_get_related_posts( $post_id, $related_count, $args = array() ) {
	$terms = get_the_terms( $post_id, 'category' );
	
	if ( empty( $terms ) ) $terms = array();
	
	$term_list = wp_list_pluck( $terms, 'slug' );
	
	$related_args = array(
	'post_type' => 'post',
	'posts_per_page' => $related_count,
	'post_status' => 'publish',
	'post__not_in' => array( $post_id ),
	'orderby' => 'rand',
	'tax_query' => array(
		array(
		'taxonomy' => 'category',
		'field' => 'slug',
		'terms' => $term_list
		)
	)
	);
	return new WP_Query( $related_args );
}
```
</details>

### 4. Borrar "Archivos:/Categoría:/Autor:/" (e)
- **Purpose:**  
  Simplify archive titles by removing extraneous labels.

- **What It Does:**  
  Filters the archive title output based on the archive type. For categories, tags, authors, post types, or custom taxonomies, it returns a clean title without the prefixes (e.g., "Archivos:", "Categoría:", or "Autor:"). This enhances the clarity and presentation of archive pages.

<details>
<summary><b>Code</b></summary>

```php
add_filter( 'get_the_archive_title', 'my_theme_archive_title' );
function my_theme_archive_title( $title ) {
    if ( is_category() ) {
        $title = single_cat_title( '', false );
    } elseif ( is_tag() ) {
        $title = single_tag_title( '', false );
    } elseif ( is_author() ) {
        $title = '<span class="vcard">' . get_the_author() . '</span>';
    } elseif ( is_post_type_archive() ) {
        $title = post_type_archive_title( '', false );
    } elseif ( is_tax() ) {
        $title = single_term_title( '', false );
    }

    return $title;
}

```
</details>

### 5. Registrar categoría de bloques - Bloques Enfant (e)
- **Purpose:**  
  Register a custom block category for the WordPress block editor.

- **What It Does:**  
  Merges a new block category titled “Enfant Terrible” into the existing block categories. This allows custom blocks to be organized and accessed under a dedicated category within the editor interface.

<details>
<summary><b>Code</b></summary>

```php
function bloques_enfant( $categories, $post ) {
	return array_merge(
		$categories,
		array(
			array(
				'slug' => 'bloques_enfant',
				'title' => __( 'Enfant Terrible', 'bloques_enfant' ),
			),
		)
	);
}

add_filter( 'block_categories', 'bloques_enfant', 10, 2);
```
</details>

### 6. Bajada como extracto (d)
- **Purpose:**  
  Automatically update the post excerpt using custom meta content.

- **What It Does:**  
  When a post is saved, the function checks for a custom meta field (typically holding summary text) and uses its sanitized content to update the post’s excerpt. It temporarily unhooks itself during the update process to prevent an infinite loop.

<details>
<summary><b>Code</b></summary>

```php
add_action('save_post', 'bajada_como_extracto', 50);

function bajada_como_extracto() {

    global $post;

    $post_id        = ( $post->ID ); // Current post ID
    // $notas_bajada   = get_field( 'notas_bajada', $post_id ); // ACF field
	$notas_bajada   = get_post_meta( $post_id, 'notas_bajada' );

    if ( ( !empty( $post_id ) ) AND ( !empty($notas_bajada) ) ) {

        $post_array     = array(

            'ID'            => $post_id,
            'post_excerpt'	=> $notas_bajada

        );

        remove_action('save_post', 'bajada_como_extracto', 50); // Unhook this function so it doesn't loop infinitely

        wp_update_post( $post_array );

        add_action( 'save_post', 'bajada_como_extracto', 50); // Re-hook this function

    }

}
```
</details>

### 7. Exclusión en búsqueda (e)
- **Purpose:**  
  Customize search queries to include specific content types.

- **What It Does:**  
  Modifies the default WordPress search query to include posts, pages, and additional custom post types (such as “ilustraciones”, “fotoperiodismo”, and “audiovisuales”), ensuring that the search results cover a broader range of content available on the site.

<details>
<summary><b>Code</b></summary>

```php
function mySearchFilter($query) {
	if ($query->is_search) {
	$query->set('post_type', array( 'post', 'page', 'ilustraciones', 'fotoperiodismo', 'audiovisuales' ));
	}
	return $query;
	}
add_filter('pre_get_posts','mySearchFilter');
```
</details>

### 8. Dashboard - Botones (d)
- **Purpose:**  
  Add a custom dashboard widget for quick access to documentation.

- **What It Does:**  
  Registers a dashboard widget in the WordPress admin area titled “Documentación”. This widget queries posts of the “documentacion” type and lists their titles, along with a clickable link directing administrators to the documentation management page.

<details>
<summary><b>Code</b></summary>

```php
/**
 * Add a widget to the dashboard.
 *
 * This function is hooked into the 'wp_dashboard_setup' action below.
 */
function enfantterrible_add_dashboard_widgets() {
	wp_add_dashboard_widget(
		'dashboard_widget_documentacion', // Widget slug.
		'Documentación', // Title.
		'dashboard_widget_documentacion_function' // Display function.
	);
}
add_action( 'wp_dashboard_setup', 'enfantterrible_add_dashboard_widgets' );

/**
 * Create the function to output the contents of your Dashboard Widget.
 */
function dashboard_widget_documentacion_function() {
	
	echo '<h2>Para ver cómo realizar ciertas funciones básicas, como:</h2><ul style="list-style: disc; padding: 0 32px;">';

	// WP_Query arguments
	$args = array(
		'post_type' => array( 'documentacion' ),
	);

	// The Query
	$docs = new WP_Query( $args );

	// The Loop
	if ( $docs->have_posts() ) {
		while ( $docs->have_posts() ) {
			$docs->the_post();
			// do something
			echo '<li>';
    		the_title();
		    echo '</li>';

		}
	} else {
		// no posts found
	}

	// Restore original Post Data
	wp_reset_postdata();
	echo '</ul><br><a href="https://enfantterrible.com.ar/wp-admin/edit.php?post_type=documentacion" style="margin: 0 auto; width: 30%; text-align: center; display: block; padding: 4px; background-color: #171122; border-radius: 4px; color: #f9f9fa; text-transform: uppercase; text-decoration: none; font-weight: 700">Hacer click acá</a>';

}
```
</details>

### 9. RSS - Bajada como Description (e)
- **Purpose:**  
  Customize the description content for RSS feed items.

- **What It Does:**  
  For RSS feed requests, the function replaces the standard excerpt with a sanitized version of content from a custom meta field. This ensures that each feed item features a tailored description drawn from the post’s meta data.

<details>
<summary><b>Code</b></summary>

```php
function add_feed_content($excerpt) {
	if(is_feed()) {
		$post_id        = get_the_ID(); // Current post ID
		$notas_bajada   = get_post_meta( $post_id, 'notas_bajada', true );
		$excerpt = '';
		$excerpt = '<p>'.sanitize_text_field($notas_bajada).'</p>';
		
		return $excerpt;
		}
}
add_filter('the_excerpt_rss', 'add_feed_content');
// add_filter('the_excerpt', 'add_feed_content');

/*
// add custom feed content
function add_feed_content($excerpt) {
	if(is_feed()) {
		global $post;
		$post_id        = ( $post->ID ); // Current post ID
		// $notas_bajada   = get_field( 'notas_bajada', $post_id ); // ACF field
		$notas_bajada   = get_post_meta( $post_id, 'notas_bajada', true );
		$excerpt = '';
		$excerpt = '<p>'.sanitize_text_field($notas_bajada).'</p>';
		
		return $excerpt;
		}
}
add_filter('the_excerpt_rss', 'add_feed_content');
// add_filter('the_excerpt', 'add_feed_content');

```
</details>

### 10. RSS - Imagen (e)
- **Purpose:**  
  Integrate featured images into RSS feed items.

- **What It Does:**  
  Adds a custom XML namespace for media elements to the RSS feed. For posts with a featured image, it outputs a `<media:content>` tag that includes the image URL and its dimensions, enhancing the visual appeal of the feed.

<details>
<summary><b>Code</b></summary>

```php
add_action('rss2_ns', 'rss2_imagen_namespace');
add_action('rss2_item', 'rss2_imagen_function');

function rss2_imagen_namespace(){
    echo 'xmlns:media="http://search.yahoo.com/mrss/"'."\n";
}

function rss2_imagen_function() {
  if (has_post_thumbnail($post->ID)){
    $thumbnail_ID = get_post_thumbnail_id($post->ID);
    $thumbnail = wp_get_attachment_image_src($thumbnail_ID, 'full');
    if (is_array($thumbnail)) {
      
	  echo '<media:content medium="image" url="' . $thumbnail[0]
        . '" width="' . $thumbnail[1] . '" height="' . $thumbnail[2] . '" />'."\n";
	  
		// echo '<media>'.$thumbnail[0].'</media>'."\n";
    }
  }
}
```
</details>

### 11. RSS - Limitar últimos 7 días y notas publicadas (no privadas, protegidas ni borradores) (e)
- **Purpose:**  
  Limit the RSS feed to recent and publicly published posts.

- **What It Does:**  
  Adjusts the RSS feed query by applying a date filter to include only posts from the current week. It also ensures that only posts with a published status (excluding private, password-protected, or draft posts) appear in the feed.

<details>
<summary><b>Code</b></summary>

```php
// filter the RSS feeds to show only the last calendar month. See: https://wordpress.stackexchange.com/questions/307064/limit-rss-feed-to-previous-calendar-month
function feedFilter($query) {
  if ($query->is_feed) {
	  $query->set( 'date_query', [ 
		  [ 
			  'after'     => 'this week', 
			  'inclusive' => true,
		  ]
	  ] );
	  $query-> set('post_status','publish');
	  $query-> set('has_password', FALSE);
  }

  return $query;
}
add_action('pre_get_posts','feedFilter');
```
</details>

### 12. RSS - Intervalo (e)
- **Purpose:**  
  Control the refresh interval for the RSS widget.

- **What It Does:**  
  Overrides the default caching duration for the WordPress RSS widget by setting the refresh interval to zero seconds, ensuring that the widget displays the most current feed content without delay.

<details>
<summary><b>Code</b></summary>

```php
// change refresh interval of wordpress rss widget
function wcs_rss_widget_refresh_interval( $seconds ) {
    return 0;
}
add_filter( 'wp_feed_cache_transient_lifetime', 'wcs_rss_widget_refresh_interval' );
```
</details>

### 13. Backend - CSS (d)
- **Purpose:**  
  Customize the visual styling of specific admin menu items.

- **What It Does:**  
  Outputs inline CSS within the WordPress admin area to alter the background color of designated menu items. This visual adjustment helps to emphasize or differentiate particular sections of the admin interface.

<details>
<summary><b>Code</b></summary>

```php
function enfantterrible_backend_menu_css() {
	if ( ! is_admin()) {
		return;
	} else {
		echo '
		<style>
			li#menu-posts-nodo_comunitario,
			li#menu-posts-fotoperiodismo,
			li#menu-posts-integrantes_enfant,
			li#menu-posts-cf_beneficios,
			li#menu-posts-ilustraciones,
			li#menu-posts-documentacion,
			li#menu-posts-certificaciones_web,
			li#menu-posts-audiovisuales, 
			li#toplevel_page_certificaciones-web-page,
			li#menu-posts-dossiers{
				background-color: #2E2244 !important;
			}
		</style>';
	};
}
add_action( 'admin_head', 'enfantterrible_backend_menu_css' );
```
</details>

### 14. Headers (e)
- **Purpose:**  
  Enhance site security through the use of specific HTTP headers.

- **What It Does:**  
  Hooks into the header-sending process to enforce security measures. One function sets the HTTP Strict Transport Security (HSTS) header to ensure secure connections over HTTPS, while another sets the X-Frame-Options header to “SAMEORIGIN” to protect against clickjacking. There is also a commented section hinting at the potential use of a Content Security Policy (CSP).

<details>
<summary><b>Code</b></summary>

```php
function headers_hsts() {
    header( 'Strict-Transport-Security: max-age=10886400' );
}
add_action( 'send_headers', 'headers_hsts' );

function headers_xframeoptions() {
	header( 'X-Frame-Options: SAMEORIGIN' );
}
add_action( 'send_headers', 'headers_xframeoptions' );

/*
function headers_csp() {
	header("Content-Security-Policy-Report-Only: <aquí tus directivas a probar>");
}
add_action( 'send_headers', 'headers_csp' );
*/
```
</details>

### 15. Components - Menu de secciones (d)

- **Purpose:**  
  Display a dynamic category-based navigation menu.

- **What It Does:**  
  Retrieves top-level categories and generates a navigation menu with links to each category. Additional static links for specific sections like "Entrevistas," "Fotoperiodismo," "Ilustraciones," and "Audiovisuales" are included. A footer version with a different color scheme is also available.

<details>
<summary><b>Code</b></summary>

```php
function components_menu_secciones() {
	?>
		<ul class="comp__menu">
			<?php
			$args = array(
				'parent' => 0,
				'exclude' => '1',
			);
			$categories = get_categories( $args );
			foreach ( $categories as $category ) {
				echo '<li><a href="' . get_category_link( $category->term_id ) . '" class="comp__cats is-red-light p-05 m-05 rounded-1">#' . $category->name . '' . '' . $category->description . '</a></li>';
			}
			?>
			<li><a href="tag/entrevista" class="comp__cats is-red-light p-05 m-05 rounded-1">#Entrevistas</a></li>
			<li><a href="/fotoperiodismo" class="comp__cats is-red-light p-05 m-05 rounded-1">#Fotoperiodismo</a></li>
			<li><a href="/ilustraciones" class="comp__cats is-red-light p-05 m-05 rounded-1">#Ilustraciones</a></li>
			<li><a href="/audiovisuales" class="comp__cats is-red-light p-05 m-05 rounded-1">#Audiovisuales</a></li>
		</ul>
	<?php
	
}

function components_menu_secciones_footer() {
	?>
		<ul class="comp__menu">
			<?php
			$args = array(
				'parent' => 0,
				'exclude' => '1',
			);
			$categories = get_categories( $args );
			foreach ( $categories as $category ) {
				echo '<li><a href="' . get_category_link( $category->term_id ) . '" class="is-black-light is-font-white p-05 m-05 rounded-1">#' . $category->name . '' . '' . $category->description . '</a></li>';
			}
			?>
			<li><a href="tag/entrevista" class="comp__cats is-black-light p-05 m-05 rounded-1">#Entrevistas</a></li>
			<li><a href="/fotoperiodismo" class="is-black-light is-font-white p-05 m-05 rounded-1">#Fotoperiodismo</a></li>
			<li><a href="/ilustraciones" class="is-black-light is-font-white p-05 m-05 rounded-1">#Ilustraciones</a></li>
			<li><a href="/audiovisuales" class="is-black-light is-font-white p-05 m-05 rounded-1">#Audiovisuales</a></li>
		</ul>
	<?php
}
```
</details>

### 16. Optimizacion - Sacar AddToAny de todos los lugares que no sean notas (e)
- **Purpose:**  
  Prevent the AddToAny plugin from loading on pages other than single posts.

- **What It Does:**  
  Hooks into `wp_enqueue_scripts` and checks if the current page is a single post. If not, it disables the AddToAny script and styles, ensuring they do not load on other pages, improving performance.

<details>
<summary><b>Code</b></summary>

```php
add_action( 'wp_enqueue_scripts', function() {
    // Your conditional goes here. For example:
    // Allow only on single posts (of any post type)
    if ( is_singular( 'post' ) ) return;

    // Remove AddToAny core script.
    // Note: This disables AddToAny's ability to load dynamically.
    add_filter( 'addtoany_script_disabled', '__return_true' );

    // Remove AddToAny plugin's JS & CSS.
    wp_dequeue_script( 'addtoany' );
    wp_dequeue_style( 'addtoany' );
}, 21);
```
</details>

### 17. Dashboard - Certificaciones Web (e)
- **Purpose:**  
  Provide an admin interface for managing website certifications.

- **What It Does:**  
  Adds a custom menu item in the WordPress admin panel under "Certificaciones Web." The page lists all certification entries with status indicators for tracking progress. It integrates jQuery UI Accordion for better content organization and uses Thickbox for modal-based editing. Additional UI enhancements include hiding unnecessary admin elements for a streamlined experience.

<details>
<summary><b>Code</b></summary>

```php
function certificaciones_web_menu() {
	add_menu_page(
        __( 'Certificaciones web', 'textdomain' ),
        'Certificaciones web',
		'manage_options',
		'certificaciones-web-page',
		'certificaciones_web_menu_contents',
		'dashicons-schedule',
		35
	);
}

add_action('wp_enqueue_scripts', 'load_accordion');
function load_accordion() {
	wp_enqueue_script('jquery-ui-accordion');
	?>
	<script>
		jQuery( function() {
			var icons = {
			  header: "dashicons dashicons-arrow-right",
			  activeHeader: "dashicons dashicons-arrow-down"
			};
			jQuery( ".accordion" ).accordion({
				collapsible: true,
				active: false,
				icons: icons,

			});
		} );
		
		jQuery( 'body' ).on( 'thickbox:removed', function() { location.reload(true) });
	</script>
	<?php
}

add_action( 'admin_menu', 'certificaciones_web_menu' );
function certificaciones_web_menu_contents() {

	// Thickbox
	
	add_thickbox();
	
	// WP_Query arguments
	$args = array(
		'post_type'              => 'certificaciones_web',
		'post_status'            => 'publish',
		'posts_per_page'			 => -1
	);

	// The Query
	$certificaciones_web_query = new WP_Query( $args );
	
	// HTML structure
	?>
	<style>
		.update-nag.notice.notice-warning.inline {
			display:none;
		}
		#adminmenuback {
			position:relative;
		}
		.certificaciones__top {
			width:100%;
			text-align:center;
			margin-left:auto;
			margin-right:auto;
			margin-top:64px;
		}
		.certificaciones__top h1 {
			margin:32px auto;
		}
		
		.certificaciones__nueva {
			padding: 8px 16px;
			color: #f9f9fa;
			background-color: #171122;
			border-radius: 32px;
			text-decoration: none;
		}
		
		.certificaciones__nueva:hover {
			color:white;
		}
				.colocado {
			background-color: #ffeaa7;
		}
		
		.certificado {
			background-color: #81ecec;
		}
		
		.tramitado {
			background-color: #fab1a0;
		}
		
		.certificaciones__colores {
			display: flex;
			justify-content: space-around;
			width: 100%;
			margin-left: auto;
			margin-right: auto;
			margin-top:32px;
			max-width: 300px;
			
		}
		
		.certificaciones__colores p {
			display:flex;
			align-items:center;
			margin:8px;
		}
		
		.certificaciones__colores span {
			width:24px;
			height:24px;
			margin-right: 8px;
			display:inline-block;
			
		}
		
		.certificaciones__row {
			width:100%;
			max-width:600px;
			margin-left:auto;
			margin-right:auto;
			background-color: #ebebeb;
		}
		
		.certificaciones__header {
			width:100%;
			background-color: #ebebeb;
			padding:8px;
			font-size:14px;
			font-weight:400;
			margin:0;
			box-sizing: border-box;
			position:relative;
		}
		.certificaciones__btn {
			position:absolute;
			top:0;
			bottom:0;
			right: 8px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		
		.certificaciones__btn a:first-child {
			margin-right:8px;
		}
		
		.certificaciones__data {
			padding:0 8px;
			width:100%;
		}
		
	</style>
	<div class="certificaciones__top">
		<h1>Certificaciones web</h1>
		<a href="https://enfantterrible.com.ar/wp-admin/post-new.php?post_type=certificaciones_web&TB_iframe=true&width=600&height=550" class="thickbox certificaciones__nueva" style="font-size:14px;">Agregar nueva</a>
		<div class="certificaciones__colores">
			<p><span class="colocado"></span>Colocado</p>
			<p><span class="certificado"></span>Certificado</p>
			<p><span class="tramitado"></span>Tramitado</p>
		</div>
	</div>
			
	<?php
	// The Loop
	if ( $certificaciones_web_query->have_posts() ) {
		while ( $certificaciones_web_query->have_posts() ) {
			$certificaciones_web_query->the_post();
			// do something
			?>
			
			<div class="accordion certificaciones__row">
				<h3 class="certificaciones__header <?php echo strtolower(end(get_field( 'certificaciones_estado' ))); ?>">
					Orden <?php echo esc_html( get_field( 'certificaciones_orden' ) ); ?> | De <?php echo esc_html( get_field( 'certificaciones_inicio' ) ); ?> a <?php echo esc_html( get_field( 'certificaciones_final' ) ); ?>
					<div class="certificaciones__btn">
						<a href="<?php echo get_edit_post_link(); ?>&TB_iframe=true&width=600&height=550" class="thickbox">Editar</a>
						<a href="<?php echo get_delete_post_link(); ?>" class="thickbox">Eliminar</a>
					</div>
				</h3>
				<div class="certificaciones__data">
					<p class="certificaciones__content">
						<b>Link: </b><?php echo esc_url( get_field( 'certificaciones_link' ) ); ?>
					</p>
					<p class="certificaciones__content">
						<b>Imagen: </b><a href="<?php echo esc_url( get_field( 'certificaciones_imagen' ) ); ?>" target=_blank>Link</a>
					</p>
					<p class="certificaciones__content"><b>Estado: </b>
						<?php
						$estado = get_field('certificaciones_estado');
						if( $estado ) { ?>
							<?php foreach( $estado as $estado ): ?>
							<span>✔️ <?php echo $estado; ?> </span>
							<?php endforeach; ?>
						<?php } else {
							echo 'Sin estado todavía';
						} ?>
					</p>
					<p class="certificaciones__content">
						<b>Notas y comentarios: </b><br />
						<?php if ( $certificaciones_notas = get_field( 'certificaciones_notas' ) ) {
							 echo $certificaciones_notas;
						} else {
							echo 'Sin notas ni comentarios.';
						} ?>
					</p>
					<p class="certificaciones__content"><b>Screenshot de inicio: </b>
						<?php if (get_field( 'certificacion_screenshot_inicio' )) { ?>
							<a href="<?php echo esc_url( get_field( 'certificacion_screenshot_inicio' ) ); ?>" target=_blank>Link</a>
						<?php
						} else {
							echo 'sin certificación todavía.';
						} ?>
					</p>
					<p class="certificaciones__content"><b>Screenshot de finalización: </b>
						<?php if (get_field( 'certificacion_screenshot_final' )) { ?>
							<a href="<?php echo esc_url( get_field( 'certificacion_screenshot_final' ) ); ?>" target=_blank>Link</a>
						<?php
						} else {
							echo 'sin certificación todavía.';
						} ?>
					</p>
					<p class="certificaciones__content"><b>Posición: </b>
						<?php if ( $certificaciones_posicion = get_field( 'certificaciones_posicion' ) ) {
								echo $certificaciones_posicion;
								} else {
								echo 'Sin posición establecida.';
						}
						?>
					</p>
				</div>
			</div>
			<?php
		}
	} else {
		echo '<p style="text-align:center">No hay certificaciones activas.</p>';
	}
	
	// Restore original Post Data
	wp_reset_postdata();
	load_accordion();
} 

function certificaciones_edit_screen() {
    if ( function_exists('get_current_screen')) {  
        $pt = get_current_screen()->post_type;
        if ( $pt != 'certificaciones_web') return;
		?>
			<style>
				#wpadminbar, #screen-meta-links, .update-nag.notice.notice-warning.inline, .wrap .wp-heading-inline+.page-title-action, #submitpost #minor-publishing {
					display:none;
				}
			</style>
		<?php
    }
}
add_action( 'current_screen', 'certificaciones_edit_screen' );
```
</details>

### 18. Generador de (otras) placas CSS (d)

- **Purpose:**
	Adds custom fonts and layout styles for a specific page.

- **What It Does:**  
	This function injects CSS styles when the user visits a particular page (ID: 18031). The styles include custom font definitions for the 'Raleway' typeface, defining multiple language subsets (Cyrillic, Vietnamese, Latin, etc.). Additionally, it applies various layout styles, including a structured flexbox-based grid system, controls for text and image customization, and a custom download button.

	The styles also define a .wrapper component that sets background images, a .footer with a distinctive shadow effect, and an .overlay that provides a semi-transparent background. Interactive elements, such as sliders and radio buttons, are styled for usability. Lastly, the .title class includes decorative elements with background color highlights and box-shadow effects for enhanced typography.

<details>
<summary><b>Code</b></summary>

```php
function generador_otras_placas_css() {
	if (is_page(18031)) {
?>
<style>
	/* cyrillic-ext */
	@font-face {
		font-family: 'Raleway';
		font-style: normal;
		font-weight: 700;
		font-display: swap;
		src: url(https://fonts.gstatic.com/s/raleway/v22/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pbCFPrcVIT9d0c-dYA.woff) format('woff');
		unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
	}
	/* cyrillic */
	@font-face {
		font-family: 'Raleway';
		font-style: normal;
		font-weight: 700;
		font-display: swap;
		src: url(https://fonts.gstatic.com/s/raleway/v22/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pbCMPrcVIT9d0c-dYA.woff) format('woff');
		unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
	}
	/* vietnamese */
	@font-face {
		font-family: 'Raleway';
		font-style: normal;
		font-weight: 700;
		font-display: swap;
		src: url(https://fonts.gstatic.com/s/raleway/v22/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pbCHPrcVIT9d0c-dYA.woff) format('woff');
		unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
	}
	/* latin-ext */
	@font-face {
		font-family: 'Raleway';
		font-style: normal;
		font-weight: 700;
		font-display: swap;
		src: url(https://fonts.gstatic.com/s/raleway/v22/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pbCGPrcVIT9d0c-dYA.woff) format('woff');
		unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
	}
	/* latin */
	@font-face {
		font-family: 'Raleway';
		font-style: normal;
		font-weight: 700;
		font-display: swap;
		src: url(https://fonts.gstatic.com/s/raleway/v22/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pbCIPrcVIT9d0c8.woff) format('woff');
		unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
	}

	:root {
		--white: #F5F3F4;
		--light-gray: #D3D3D3;
		--gray: #B1A7A6;
	}
	* {
		box-sizing: border-box;
	}

	.post-select {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.row {
		display:flex;
		/*flex-flow: row nowrap; */
		width:100%;
		max-width:640px;
		flex-direction: column-reverse;
		margin: 0 auto;
		padding: 16px;
		box-sizing: content-box;
		background-color: #F9F9FA;
	}
	.controls {
		padding:16px;
		display:flex;
		flex-direction:row;
		flex-wrap: wrap;
		justify-content:center;
		align-content: flex-start;
		align-items:center;
		position:relative;
		font-family: 'Arial', sans-serif;
	}

	.controls > * {
		width:100%;
	}

	.control-row {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		flex-direction: row;
		padding: 8px;
	}

	.control-row .change-text,
	.control-row .highlight-select,
	.font-size-select > *,
	.post-select > *,
	.wide-select > *,
	.font-size-select > * {
		padding:8px;
	}

	.control-row .change-text,
	.control-row .highlight-select,
	.control-row .change-image {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.change-text .textarea-change-text,
	.highlight-select .select-highlight{
		resize: none;
		width: 100%;
		font-family: inherit;
		padding: 8px;
		border-radius: 4px;
	}

	.wide-select,
	.font-size-select {
		align-items:flex-start;
	}

	.font-size-select input {
		margin:0 8px;
		padding: 4px 8px;
		border-radius:4px;
		border:1px solid var(--light-gray);
	}

	.wide-select,
	.font-size-select {
		display:flex;
		flex-direction:row-reverse;
		align-items:center;
	}

	.wide-select,
	.font-size-select,
	.font-buttons-select {
		width:auto;
	}

	.font-buttons-select input[type=checkbox],
	.font-buttons-select input[type=radio]{
		display: none;
	}

	.wide-select,
	.font-size-select {
		margin: -3px;
		margin-left: 1px;
	}
	.wide-select,
	.font-size-select,
	.font-buttons-select .label,
	.font-buttons-select .button {
		border: 1px solid var(--light-gray);
	}

	.font-buttons-select .label,
	.font-buttons-select .button {
		display: inline-flex;
		padding: 8px;
		margin: -3px;
	}
	.font-buttons-select input[type=checkbox]:checked + .label,
	.font-buttons-select input[type=radio]:checked + .label,
	.font-buttons-select .button:focus {
		background: var(--light-gray);
		border: 1px solid var(--gray);
	}


	.slider-wrapper {
		width:100px;
		padding:8px;
		padding-right: 16px;
		margin-right:auto;
	}
	/* the slider bar */
	.slider {
		position: relative;
		width: 100%;
		height: .5em;
		padding:0;
		padding-left:100%;
		max-height:.5em;
		background-color: #29e;
		border-radius: 0.5em;
		box-sizing: border-box;

		font-size: 1em;

		-ms-touch-action: none;
		touch-action: none;
	}

	/* the slider handle */
	.slider:before {
		content: "";
		display: block;
		position: relative;
		top: -.5em;
		width: 1.5em;
		height: 1.5em;
		margin-left: -.75em;
		border: solid 0.25em #fff;
		border-radius: 1em;
		background-color: inherit;

		box-sizing: border-box;
	}
	.download-button {
		margin: 16px auto;
		padding: 8px 16px;
		border-radius: 4px;
		border: none;
		background-color: #171122;
		cursor: pointer;
		color:#F9F9FA;
		font-family: 'Raleway', sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
	}

	.download-button svg {
		width: 24px;
		margin-right: 4px;
	}

	.wrapper {
		width:640px;
		height:800px;
		padding:32px;
		background:red;
		display:flex;
		justify-content:center;
		align-items:center;
		background-image:url(https://source.unsplash.com/random);
		background-size: cover;
		background-position: center;
		background-repeat:no-repeat;
		position:relative;
		overflow:hidden
	}

	.wrapper-border {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border: 16px solid #d75e62ff;
	}

	.row-stories-1 .wrapper,
	.row-stories-2 .wrapper,
	.row-stories-3 .wrapper {
		height: 1137.7px;
		padding: 0;
		display: flex;
		flex-direction: column;
		background-image:unset;
		background:white;
		align-items: flex-start;
	}

	.row-stories-1 .wrapper-background,
	.row-stories-2 .wrapper-background,
	.row-stories-3 .wrapper-background {
		position: relative;
		height: 60%;
		width: 100%;
		background: white;
		background-image: url(https://source.unsplash.com/random);
		background-position: center;
		background-size: cover;
	}

	.footer {
		position:absolute;
		bottom:-8px;
		left:16px;
		color:white;
		background:white;
		font-family:'Arial', sans-serif;
		font-size:24px;
		letter-spacing:1px;
		padding:8px;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
		width:100%;
		max-width:calc(640px - 32px);
		box-shadow: inset 0 7px 9px -7px rgba(0,0,0,1);	
	}

	.row-stories-1 .footer,
	.row-stories-2 .footer,
	.row-stories-3 .footer {
		color:black;
		position: relative;
		margin-bottom: 32px;
		margin-top: 0;
	}

	.footer span {
		position:relative;
		display: flex;
		padding:8px;
	}
	.footer svg {
		width: 96px;
		height: auto;
		fill: white;
	}

	.row-stories-1 .footer svg,
	.row-stories-2 .footer svg,
	.row-stories-3 .footer svg {
		fill:black;
	}

	.overlay {
		position:absolute;
		top:0;
		left:0;
		right:0;
		bottom:0;
		background-color: hsla(0, 0%, 0%, 60%);
	}

	.row-stories-1 .overlay,
	.row-stories-2 .overlay,
	.row-stories-3 .overlay {
		display:none;
	}

	.wrapper-padding {
		display: flex;
		align-items: center;
		width:100%;
		height:100%;
		position:relative;
	}

	.row-stories-1 .wrapper-padding,
	.row-stories-2 .wrapper-padding,
	.row-stories-3 .wrapper-padding {
		height: 40%;
		padding: 32px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		z-index: 999999999;
		margin-top: -1px;
		background-color: white;
	}

	.row-stories-1 .logo,
	.row-stories-2 .logo,
	.row-stories-3 .logo {
		position: relative;
		top: unset;
		right: unset;
		left:-16px;
		width: 64px;
		display: block;
	}
	.logo {
		position: absolute;
		top: 0;
		right: -8px;
		width: 64px;
		display: block;
	}
	.title {
		width:100%;
		max-width:600px;
		position:relative;
		height:auto;
		font-family:'Raleway', sans-serif;
		font-weight:700;
		text-transform:uppercase;
		color:white;
		font-size:28px;
		line-height:2;
		display:inline-table;
		white-space: pre-wrap; 

	}

	.row-feed-2 .title,
	.row-feed-3 .title,
	.row-stories-2 .title,
	.row-stories-3 .title {
		font-size:20px;
	}

	.title p {
		margin:0;
		display:inline;
		padding: 0.25rem 0;
		overflow:hidden;
		background-color:#171122;
		box-shadow: 0.25rem 0 0 #171122, -0.25rem 0 0 #171122;
		-webkit-box-decoration-break: clone;
		-ms-box-decoration-break: clone;
		-o-box-decoration-break: clone;
		box-decoration-break: clone;
	}

	.title .highlight {
		background-color:#d75e62ff;
		box-shadow: 0.25rem 0 0 #d75e62ff, -0.25rem 0 0 #d75e62ff;
		padding-top: .25rem;
		padding-bottom: .25rem;
		-webkit-box-decoration-break: clone;
		-ms-box-decoration-break: clone;
		-o-box-decoration-break: clone;
		box-decoration-break: clone;
	}

	.title:after,
	.logo:after {
		opacity:0;
	}
	.title:hover:after,
	.logo:hover:after{
		content: "";
		position: absolute;
		left: -4px;
		top: -4px;
		right: -4px;
		bottom: -4px;
		border-width: 2px;
		border-style: dashed;
		border-color: gray;
		border-radius:2px;
		opacity:.5;

	}
	.ss-main{position:relative;display:inline-block;user-select:none;color:#666;width:100%}.ss-main .ss-single-selected{display:flex;cursor:pointer;width:100%;height:30px;padding:6px;border:1px solid #dcdee2;border-radius:4px;background-color:#fff;outline:0;box-sizing:border-box;transition:background-color .2s}.ss-main .ss-single-selected.ss-disabled{background-color:#dcdee2;cursor:not-allowed}.ss-main .ss-single-selected.ss-open-above{border-top-left-radius:0;border-top-right-radius:0}.ss-main .ss-single-selected.ss-open-below{border-bottom-left-radius:0;border-bottom-right-radius:0}.ss-main .ss-single-selected .placeholder{flex:1 1 100%;text-align:left;width:calc(100% - 30px);line-height:1em;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ss-main .ss-single-selected .placeholder,.ss-main .ss-single-selected .placeholder *{display:flex;align-items:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ss-main .ss-single-selected .placeholder *{width:auto}.ss-main .ss-single-selected .placeholder .ss-disabled{color:#dedede}.ss-main .ss-single-selected .ss-deselect{display:flex;align-items:center;justify-content:flex-end;flex:0 1 auto;margin:0 6px;font-weight:700}.ss-main .ss-single-selected .ss-deselect.ss-hide{display:none}.ss-main .ss-single-selected .ss-arrow{display:flex;align-items:center;justify-content:flex-end;flex:0 1 auto;margin:0 6px}.ss-main .ss-single-selected .ss-arrow span{border:solid #666;border-width:0 2px 2px 0;display:inline-block;padding:3px;transition:transform .2s,margin .2s}.ss-main .ss-single-selected .ss-arrow span.arrow-up{transform:rotate(-135deg);margin:3px 0 0}.ss-main .ss-single-selected .ss-arrow span.arrow-down{transform:rotate(45deg);margin:-3px 0 0}.ss-main .ss-multi-selected{display:flex;flex-direction:row;cursor:pointer;min-height:30px;width:100%;padding:0 0 0 3px;border:1px solid #dcdee2;border-radius:4px;background-color:#fff;outline:0;box-sizing:border-box;transition:background-color .2s}.ss-main .ss-multi-selected.ss-disabled{background-color:#dcdee2;cursor:not-allowed}.ss-main .ss-multi-selected.ss-disabled .ss-values .ss-disabled{color:#666}.ss-main .ss-multi-selected.ss-disabled .ss-values .ss-value .ss-value-delete{cursor:not-allowed}.ss-main .ss-multi-selected.ss-open-above{border-top-left-radius:0;border-top-right-radius:0}.ss-main .ss-multi-selected.ss-open-below{border-bottom-left-radius:0;border-bottom-right-radius:0}.ss-main .ss-multi-selected .ss-values{display:flex;flex-wrap:wrap;justify-content:flex-start;flex:1 1 100%;width:calc(100% - 30px)}.ss-main .ss-multi-selected .ss-values .ss-disabled{display:flex;padding:4px 5px;margin:2px 0;line-height:1em;align-items:center;width:100%;color:#dedede;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@keyframes scaleIn{0%{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}@keyframes scaleOut{0%{transform:scale(1);opacity:1}to{transform:scale(0);opacity:0}}.ss-main .ss-multi-selected .ss-values .ss-value{display:flex;user-select:none;align-items:center;font-size:12px;padding:3px 5px;margin:3px 5px 3px 0;color:#fff;background-color:#5897fb;border-radius:4px;animation-name:scaleIn;animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:both}.ss-main .ss-multi-selected .ss-values .ss-value.ss-out{animation-name:scaleOut;animation-duration:.2s;animation-timing-function:ease-out}.ss-main .ss-multi-selected .ss-values .ss-value .ss-value-delete{margin:0 0 0 5px;cursor:pointer}.ss-main .ss-multi-selected .ss-add{display:flex;flex:0 1 3px;margin:9px 12px 0 5px}.ss-main .ss-multi-selected .ss-add .ss-plus{display:flex;justify-content:center;align-items:center;background:#666;position:relative;height:10px;width:2px;transition:transform .2s}.ss-main .ss-multi-selected .ss-add .ss-plus:after{background:#666;content:"";position:absolute;height:2px;width:10px;left:-4px;top:4px}.ss-main .ss-multi-selected .ss-add .ss-plus.ss-cross{transform:rotate(45deg)}.ss-content{position:absolute;width:100%;margin:-1px 0 0;box-sizing:border-box;border:1px solid #dcdee2;z-index:1010;background-color:#fff;transform-origin:center top;transition:transform .2s,opacity .2s;opacity:0;transform:scaleY(0)}.ss-content.ss-open{display:block;opacity:1;transform:scaleY(1)}.ss-content .ss-search{display:flex;flex-direction:row;padding:8px 8px 6px}.ss-content .ss-search.ss-hide,.ss-content .ss-search.ss-hide input{height:0;opacity:0;padding:0;margin:0}.ss-content .ss-search input{display:inline-flex;font-size:inherit;line-height:inherit;flex:1 1 auto;width:100%;min-width:0;height:30px;padding:6px 8px;margin:0;border:1px solid #dcdee2;border-radius:4px;background-color:#fff;outline:0;text-align:left;box-sizing:border-box;-webkit-box-sizing:border-box;-webkit-appearance:textfield}.ss-content .ss-search input::placeholder{color:#8a8a8a;vertical-align:middle}.ss-content .ss-search input:focus{box-shadow:0 0 5px #5897fb}.ss-content .ss-search .ss-addable{display:inline-flex;justify-content:center;align-items:center;cursor:pointer;font-size:22px;font-weight:700;flex:0 0 30px;height:30px;margin:0 0 0 8px;border:1px solid #dcdee2;border-radius:4px;box-sizing:border-box}.ss-content .ss-addable{padding-top:0}.ss-content .ss-list{max-height:200px;overflow-x:hidden;overflow-y:auto;text-align:left}.ss-content .ss-list .ss-optgroup .ss-optgroup-label{padding:6px 10px;font-weight:700}.ss-content .ss-list .ss-optgroup .ss-option{padding:6px 6px 6px 25px}.ss-content .ss-list .ss-optgroup-label-selectable{cursor:pointer}.ss-content .ss-list .ss-optgroup-label-selectable:hover{color:#fff;background-color:#5897fb}.ss-content .ss-list .ss-option{padding:6px 10px;cursor:pointer;user-select:none}.ss-content .ss-list .ss-option *{display:inline-block}.ss-content .ss-list .ss-option.ss-highlighted,.ss-content .ss-list .ss-option:hover{color:#fff;background-color:#5897fb}.ss-content .ss-list .ss-option.ss-disabled{cursor:not-allowed;color:#dedede;background-color:#fff}.ss-content .ss-list .ss-option:not(.ss-disabled).ss-option-selected{color:#666;background-color:rgba(88,151,251,.1)}.ss-content .ss-list .ss-option.ss-hide{display:none}.ss-content .ss-list .ss-option .ss-search-highlight{background-color:#fffb8c}


	/* SVG DIVIDER */ 

	.custom-shape-divider-bottom-1630418329 {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		overflow: hidden;
		line-height: 0;
		transform: rotate(180deg);
	}

	.custom-shape-divider-bottom-1630418329 svg {
		position: relative;
		display: block;
		width: calc(161% + 1.3px);
		height: 120px;
	}

	.custom-shape-divider-bottom-1630418329 .shape-fill {
		fill: #FFFFFF;
	}




</style>
<?php
	}
}
add_action('wp_head', 'generador_otras_placas_css');
```
</details>

### 19. Dossier - Parent Class (e)

- **Purpose:**  
Adds a CSS class to the `<body>` element for parent dossiers.

- **What It Does:**  
This filter checks if the current post is a singular 'dossiers' post and has no parent. If true, it adds the `parent-dossier` class to the body. This allows for custom styling and behavior targeting parent dossier pages.

<details>
<summary><b>Code</b></summary>

```php
add_filter( 'body_class', function( $classes ) {
	if ( is_singular('dossiers') && !has_post_parent() ) {
		// add comprehensive text followed by parent id number to the $classes array
		//$classes[] = 'parent-dossier';
		// return the $classes array
		//return $classes;
		return array_merge( $classes, array( 'parent-dossier' ) );
	}
	else {
		return $classes;
	}
});
```
</details>

### 20. Pipedream (e)

- **Purpose:**  
Adjusts HTTP headers for specific API requests.

- **What It Does:**  
When a `HEAD` request is made and the REST API has not been initialized, this action sets CORS headers (`Access-Control-Allow-Origin`), exposes the `Link` header, and limits allowed methods to `HEAD`. This ensures proper API behavior for external integrations.

<details>
<summary><b>Code</b></summary>

```php
add_action( 'send_headers', function() {
	if ( ! did_action('rest_api_init') && $_SERVER['REQUEST_METHOD'] == 'HEAD' ) {
		header( 'Access-Control-Allow-Origin: *' );
		header( 'Access-Control-Expose-Headers: Link' );
		header( 'Access-Control-Allow-Methods: HEAD' );
	}
} );
```
</details>

## 21. FB Domain Verification (e)
**Purpose:**  
Verifies the site with Facebook.

**What It Does:**  
This function inserts a meta tag in the `<head>` of the site containing a Facebook domain verification token. It confirms site ownership for Facebook services, such as business integrations and page verifications.

<details>
<summary><b>Code</b></summary>

```php
function fb_domain_verification() {
	?>
	<meta name="facebook-domain-verification" content="u9885veqe33t89c0e8rwhmmbw0sc5x" />
	<?php
}
add_action('wp_head', 'fb_domain_verification');
```
</details>

## 22. Close Comments (e)
**Purpose:**  
Disables WordPress comments site-wide.

**What It Does:**  
This ensures that comments are completely disabled, preventing both frontend and backend interactions:

- Redirects users away from the comments management page.  
- Removes the recent comments metabox from the dashboard.  
- Disables support for comments and trackbacks across all post types.  
- Closes comments and pings on all posts.  
- Hides existing comments from display.  
- Removes the comments page from the admin menu.  
- Removes comments-related links from the admin bar.  

<details>
<summary><b>Code</b></summary>

```php
add_action('admin_init', function () {
    // Redirect any user trying to access comments page
    global $pagenow;
     
    if ($pagenow === 'edit-comments.php') {
        wp_safe_redirect(admin_url());
        exit;
    }
 
    // Remove comments metabox from dashboard
    remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
 
    // Disable support for comments and trackbacks in post types
    foreach (get_post_types() as $post_type) {
        if (post_type_supports($post_type, 'comments')) {
            remove_post_type_support($post_type, 'comments');
            remove_post_type_support($post_type, 'trackbacks');
        }
    }
});
 
// Close comments on the front-end
add_filter('comments_open', '__return_false', 20, 2);
add_filter('pings_open', '__return_false', 20, 2);
 
// Hide existing comments
add_filter('comments_array', '__return_empty_array', 10, 2);
 
// Remove comments page in menu
add_action('admin_menu', function () {
    remove_menu_page('edit-comments.php');
});
 
// Remove comments links from admin bar
add_action('init', function () {
    if (is_admin_bar_showing()) {
        remove_action('admin_bar_menu', 'wp_admin_bar_comments_menu', 60);
    }
});
```
</details>

## 23. get_menu_array (e)
**Purpose:**  
Retrieves a structured array representation of a WordPress navigation menu.

**What It Does:**  
This function is useful for creating custom menu displays without relying on default WordPress menu functions:

- Fetches all menu items from a given menu.  
- Organizes them into a structured array, differentiating parent and child menu items.  
- Stores each menu item's ID, title, and URL.  
- Nesting is preserved, making it easier to render the menu in custom templates or JSON formats.  

<details>
<summary><b>Code</b></summary>

```php
function wp_get_menu_array($current_menu) {

    $array_menu = wp_get_nav_menu_items($current_menu);
	$menu = array();
	foreach ($array_menu as $m) {
		if (empty($m->menu_item_parent)) {
			$menu[$m->ID] = array();
			$menu[$m->ID]['ID'] 		= 	$m->ID;
			$menu[$m->ID]['title'] 		= 	$m->title;
			$menu[$m->ID]['url'] 		= 	$m->url;
			$menu[$m->ID]['children']	= 	array();
		}
	}
	$submenu = array();
	foreach ($array_menu as $m) {
		if ($m->menu_item_parent) {
			$submenu[$m->ID] = array();
			$submenu[$m->ID]['ID'] 		= 	$m->ID;
			$submenu[$m->ID]['title']	= 	$m->title;
			$submenu[$m->ID]['url'] 	= 	$m->url;
			$menu[$m->menu_item_parent]['children'][$m->ID] = $submenu[$m->ID];
		}
	}
    return $menu;
    
}
```
</details>

### 24. Backend - Usuarios (e)  
**Purpose:**  
- Removes the admin color scheme picker and hides specific profile options in the WordPress admin.  

**What It Does:**  
If the current user is in the WordPress admin, this function removes the admin color scheme picker and adds a script to hide certain personal options on profile-related pages (`profile.php` and `user-edit.php`). It:  
- Hides the "Visual Editor" and "Profile Picture" sections.  
- Moves specific ACF fields to different positions in the form.  
- Hides Rank Math's user meta box.  
Additionally, on the `users.php` page, it hides user avatars from the list view. This helps simplify the admin interface and remove unnecessary options for users.  

<details>
<summary><b>Code</b></summary>

```php
if( is_admin() ){
    remove_action( 'admin_color_scheme_picker', 'admin_color_scheme_picker' );
    add_action( 'admin_head', 'enfant_hide_personal_options' );
}

function enfant_hide_personal_options() {
	global $pagenow;
	if ($pagenow == 'profile.php' || $pagenow == 'user-edit.php') {
		?>
		<script type='text/javascript'>
			jQuery( document ).ready(function( $ ){
				$( '.user-rich-editing-wrap' ).parent().parent().hide();
				$( '.user-rich-editing-wrap' ).parent().parent().prev('h2').hide();
				$( '.user-profile-picture' ).hide();
				$( '.acf-field.acf-field-image.acf-field-60b8da318e38f' ).prependTo($('.user-user-login-wrap').parent());
				$( '.acf-field.acf-field-url.acf-field-60b8e1e1dff47' ).appendTo($('.user-facebook-wrap').parent());
				$( '.acf-field.acf-field-text.acf-field-60b8e39f8fb0d' ).prependTo($('.user-description-wrap').parent());
				$('.cmb2-wrap.form-table.rank-math-metabox-wrap.rank-math-metabox-frame').hide();
			} );
		</script>
		<?php
	}
	if ($pagenow == 'users.php') {
		?>
		<script type='text/javascript'>
			jQuery( document ).ready(function( $ ){
				$( '.avatar.avatar-32.photo').hide();
			} );
		</script>
		<?php
	}
}
```
</details>

---

| Name                                            | Description                                              | Group           | Goal      | Dependency          |
| ----------------------------------------------- | -------------------------------------------------------- | --------------- | --------- | ------------------- |
| Generador de placas CSS                         | Injects inline CSS on a specific page (ID: 15842)        | util            | deprecate | -                   |
| Post - Cambiar valores de nota de tapa          | Ensures only one featured note/interview per type exists | editorial       | replace   | -                   |
| Related posts                                   | Retrieves related posts by shared categories             | ux              | deprecate | -                   |
| Borrar "Archivos:/Categoría:/Autor:/"           | Removes prefixes from archive titles                     | ux              | replace   | -                   |
| Registrar categoría de bloques - Bloques Enfant | Adds a custom block category in the editor               | editorial       | replace   | Lazy Blocks         |
| Bajada como extracto                            | Auto-generates excerpts from custom meta                 | editorial       | replace   | ACF                 |
| Exclusión en búsqueda                           | Includes custom post types in search results             | editorial       | replace   | -                   |
| Dashboard - Botones                             | Adds a dashboard widget with links to documentation      | util            | deprecate | -                   |
| RSS - Bajada como Description                   | Replaces RSS description with custom meta content        | rss             | replace   | -                   |
| RSS - Imagen                                    | Adds featured image to RSS feeds                         | rss             | replace   | -                   |
| RSS - Últimos 7 días y publicadas               | Limits RSS to recent published posts only                | rss             | replace   | -                   |
| RSS - Intervalo                                 | Removes RSS widget cache interval                        | rss             | replace   | -                   |
| Backend - CSS                                   | Styles specific admin menu items                         | ux              | deprecate | -                   |
| Headers                                         | Adds security-related HTTP headers                       | util            | replace   | -                   |
| Components - Menu de secciones                  | Displays a category-based navigation menu                | ux              | deprecate | -                   |
| Optimizacion - AddToAny                         | Prevents AddToAny from loading outside of posts          | util            | replace   | AddToAny            |
| Dashboard - Certificaciones Web                 | Admin UI for certification tracking                      | content-types   | replace   | jQuery UI, Thickbox |
| Generador de (otras) placas CSS                 | Injects advanced styles on page ID 18031                 | util            | deprecate | -                   |
| Dossier - Parent Class                          | Adds a class to `<body>` for parent dossier posts        | content-types   | migrate   | -                   |
| Pipedream                                       | Adds CORS headers for HEAD API requests                  | util            | migrate   | -                   |
| FB Domain Verification                          | Adds FB domain verification meta tag                     | util            | migrate   | -                   |
| Close Comments                                  | Disables comments across the site                        | util            | replace   | -                   |
| get_menu_array                                  | Builds a structured array from a nav menu                | util            | deprecate | -                   |
| Backend - Usuarios                              | Hides profile options and avatars in admin               | user-management | replace   | ACF, jQuery         |
