// components/index.js
/**
 * @typedef {import('@wordpress/element').Component} Component
 */
/**
 * Gallery Components Module
 *
 * A collection of components for building a media gallery interface.
 *
 * @module GalleryComponents
 *
 * @property {Component} MediaUpload - Pre-configured media uploader component
 * @property {Component} Grid - Main gallery grid container
 * @property {Component} GridTile - Individual gallery image tile
 * @property {Component} DropZone - Drag-and-drop upload area
 * @property {Component} EmptyState - Empty gallery placeholder
 *
 * @example
 * // Import all components
 * import { MediaUpload, Grid, GridTile } from './components';
 *
 * @example
 * // Import specific component
 * import { DropZone } from './components';
 */

import MediaUpload from './MediaUpload';
import Grid from './Grid';
import GridTile from './GridTile';
import DropZone from './DropZone';
import EmptyState from './EmptyState';

export { MediaUpload, GridTile, DropZone, Grid, EmptyState };
