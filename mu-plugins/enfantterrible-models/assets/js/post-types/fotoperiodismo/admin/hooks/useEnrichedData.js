import { useState, useEffect, useRef, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { getMigrationInfo } from '../helpers/validate-migration';

const postStatusTranslations = {
	publish: 'publicado', // Example for Spanish
	draft: 'borrador',
	pending: 'pendiente',
	private: 'privado',
	// extend as needed
};

/**
 * Custom hook to fetch, transform, and enrich "fotoperiodismo" posts.
 *
 * @param {object} view - DataViews view params: perPage, page, search, sort.
 * @returns {object} { data: array, totalItems, isLoading }
 */
function useEnrichedData(view) {
	const queryArgs = useMemo(() => {
		const filters = {};
		view.filters.forEach((filter) => {
			if (filter.field === 'status' && filter.operator === 'isAny') {
				filters.status = filter.value;
			}
			if (filter.field === 'author' && filter.operator === 'is') {
				filters.author = filter.value;
			}
		});
		return {
			per_page: view.perPage,
			page: view.page,
			search: view.search,
			status: 'any',
			orderby: view.sort?.field || 'id',
			order: view.sort?.direction || 'desc',
			context: 'edit',
			...filters,
		};
	}, [view.filters, view.perPage, view.page, view.search, view.sort]);

	// Step 1: Fetch posts from WP core store using useSelect and the current view
	const { posts, totalItems, isLoading } = useSelect(
		(select) => {
			const { getEntityRecords, getEntityRecordsTotalItems, isResolving } = select('core');
			return {
				posts: getEntityRecords('postType', 'fotoperiodismo', queryArgs) || [],
				totalItems:
					getEntityRecordsTotalItems('postType', 'fotoperiodismo', queryArgs) || 0,
				isLoading: isResolving('getEntityRecords', [
					'postType',
					'fotoperiodismo',
					queryArgs,
				]),
			};
		},
		[queryArgs],
	);

	// console.log('Fetched posts:', posts);

	// Step 2: Transform posts to base shape
	const base = posts.map((post) => ({
		id: post.id,
		title: post.title,
		content: post.content,
		date: post.date,
		status: post.status,
		meta: post.meta,
		link: post.link,
		type: post.type,
	}));

	// Step 3: Async enrich base with migration_status using incremental enrichment
	const [enrichedMap, setEnrichedMap] = useState({});
	const cancelledRef = useRef(false);

	useEffect(() => {
		cancelledRef.current = false;

		base.forEach(async (item) => {
			const cached = enrichedMap[item.id];
			const { meta } = item;

			// Skip if cached and meta is unchanged by reference
			if (cached && cached._metaRef === meta) {
				return;
			}

			const migration_status = await getMigrationInfo(meta, item.content, item.type);

			if (!cancelledRef.current) {
				setEnrichedMap((prev) => ({
					...prev,
					[item.id]: { migration_status, _metaRef: meta },
				}));
			}
		});

		return () => {
			cancelledRef.current = true;
		};
	}, [base, enrichedMap]);

	// Step 4: Merge base with enrichment
	const data = base.map((item) => ({
		...item,
		migration_status: enrichedMap[item.id]?.migration_status,
	}));

	return { data, totalItems, isLoading };
}

export default useEnrichedData;
