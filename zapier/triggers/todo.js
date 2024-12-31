const perform = async (z, bundle) => {
	const response = await z.request({
		url: `${bundle.authData.baseUrl}/todos`,
		method: 'GET',
	});
	return response.json;
};

module.exports = {
	key: 'new_todo',
	noun: 'Todo',
	display: {
		label: 'New Todo',
		description: 'Triggers when a new todo is created.'
	},
	operation: {
		perform,
		sample: {
			id: '1234',
			text: 'Sample todo item',
			completed: false,
			createdAt: '2023-07-20T10:00:00Z'
		}
	}
};