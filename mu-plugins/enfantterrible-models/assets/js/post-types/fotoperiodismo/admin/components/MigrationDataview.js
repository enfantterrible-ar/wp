import { useState } from '@wordpress/element';
import { DataViews } from '@wordpress/dataviews';
import { useSelect } from '@wordpress/data';

import { actions as dataviewsActions } from '../actions';

import MigrationStatusBadge from './MigrationStatusBadge';
import useEnrichedData from '../hooks/useEnrichedData';

const STATUSES = [
	{ value: 'draft', label: 'Draft' },
	{ value: 'future', label: 'Scheduled' },
	{ value: 'pending', label: 'Pending Review' },
	{ value: 'private', label: 'Private' },
	{ value: 'publish', label: 'Published' },
	{ value: 'trash', label: 'Trash' },
];

const MigrationDataview = () => {
	const siteLanguage = useSelect((select) => {
		return select('core').getSite()?.language;
	}, []);

	const [view, setView] = useState({
		type: 'table',
		perPage: 20,
		page: 1,
		sort: {
			field: 'date',
			direction: 'desc',
		},
		search: '',
		filters: [],
		layout: {},
		fields: ['title', 'date', 'status', 'migration_status'],
		selection: [],
	});

	const { data, totalItems, isLoading } = useEnrichedData(view);
	// console.log('Enriched data:', data);
	// DataViews field definitions
	const fields = [
		{
			id: 'title',
			label: 'Post',
			type: 'text',
			enableHiding: false,
			enableGlobalSearch: true,
			isDefault: true,
			render: ({ item }) => (
				<div>
					<strong>{item.title.raw}</strong>
					<div>
						ID: {item.id} •{' '}
						<a href={`/wp-admin/post.php?post=${item.id}&action=edit`}>Edit</a> •{' '}
						<a href={item.link} target="_blank" rel="noopener noreferrer">
							View
						</a>
					</div>
				</div>
			),
		},
		{
			id: 'date',
			label: 'Date',
			type: 'text',
			enableHiding: false,
			enableGlobalSearch: true,
			isDefault: true,
			render: ({ item }) => {
				const isoDate = item.date;
				const date = new Date(isoDate);
				const jsLocale = siteLanguage?.replace('_', '-'); // Convert es_ES to es-ES
				const formattedDate = date.toLocaleDateString(jsLocale);
				return <span>{formattedDate}</span>;
			},
		},
		{
			id: 'status',
			label: 'Status',
			type: 'text',
			enableHiding: false,
			enableGlobalSearch: true,
			isDefault: true,
			getValue: ({ item }) =>
				STATUSES.find(({ value }) => value === item.status)?.label ?? item.status,
			elements: STATUSES,
			filterBy: {
				operators: ['isAny'],
			},
			enableSorting: false,
		},
		{
			id: 'migration_status',
			label: 'Migration Status',
			type: 'text',
			render: ({ item }) => <MigrationStatusBadge item={item} />,
		},
	];

	const actions = dataviewsActions;

	return (
		<DataViews
			data={data}
			fields={fields}
			view={view}
			actions={actions}
			onChangeView={setView}
			paginationInfo={{
				totalItems,
				totalPages: Math.ceil(totalItems / view.perPage),
			}}
			defaultLayouts={{
				table: {
					showMedia: false,
					showTitle: true,
					showDescription: false,
				},
			}}
			getItemId={(item) => item.id}
		/>
	);
};

export default MigrationDataview;
