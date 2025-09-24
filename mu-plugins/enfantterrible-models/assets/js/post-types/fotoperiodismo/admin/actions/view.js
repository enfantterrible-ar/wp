export const view = {
	id: 'view',
	label: 'View Post',
	callback: (items) => {
		if (items.length === 1) {
			const { id } = items[0];
			window.open(`/wp-admin/post.php?post=${id}&action=edit`, '_blank');
		}
	},
};
