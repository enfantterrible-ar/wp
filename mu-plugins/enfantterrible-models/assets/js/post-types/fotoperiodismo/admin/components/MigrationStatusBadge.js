import { memo } from '@wordpress/element'; // Import memo
import { Spinner } from '@wordpress/components';

/**
 * Component to display migration status.
 * Shows spinner while status is loading, then displays badge.
 *
 * @param {{ migration_status: { status: string, message: string } }} item
 * @returns {React.ReactElement}
 */
const MigrationStatusBadge = ({ item }) => {
	const migrationStatus = item.migration_status || { status: 'checking', message: 'Checking...' };
	// console.log(`migrationStatus for ${item.id}:`, migrationStatus);
	return (
		<div className="migration-status-wrapper" style={{ position: 'relative' }}>
			<span
				className={`migration-badge migration-badge--${migrationStatus.status}`}
				title={migrationStatus.message}
			>
				{migrationStatus.message}
			</span>
		</div>
	);
};

export default memo(MigrationStatusBadge); // Wrap the component with memo
