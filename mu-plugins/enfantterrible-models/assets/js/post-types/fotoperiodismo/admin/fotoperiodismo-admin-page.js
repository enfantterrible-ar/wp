import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import '@wordpress/core-data'; // This registers the 'core' store
import '../../../../css/post-types/fotoperiodismo/admin/fotoperiodismo-admin-page.scss';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { MigrationDataview } from './components';

domReady(() => {
	console.log('Meta Inspector loading...');
	const rootElement = document.getElementById('fotoperiodismo-tools-page');
	console.log('Root element:', rootElement);

	if (rootElement) {
		const root = createRoot(rootElement);
		root.render(
			<Tabs>
				<TabList>
					<Tab>Migration</Tab>
				</TabList>

				<TabPanel>
					<MigrationDataview />
				</TabPanel>
			</Tabs>,
		);
	} else {
		console.error('Root element not found');
	}
});
