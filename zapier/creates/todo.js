const perform = async (z, bundle) => {
	const response = await z.request({
		method: 'POST',
		url: `${bundle.authData.baseUrl}/todos`,
		body: {
			text: bundle.inputData.text
		}
	});
	return response.json;
};

module.exports = {
	key: 'create_todo',
	noun: 'Todo',
	display: {
		label: 'Create Todo',
		description: 'Creates a new todo item.'
	},
	operation: {
		inputFields: [
			{
				key: 'text',
				label: 'Todo Text',
				type: 'string',
				required: true,
				helpText: 'Enter the text for the todo item'
			}
		],
		perform,
		sample: {
			id: '1234',
			text: 'Sample todo item',
			completed: false,
			createdAt: '2023-07-20T10:00:00Z'
		}
	}
};