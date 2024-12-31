'use strict';

const test = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}/todos`,
    method: 'GET',
  });

  if (response.status !== 200) {
    throw new Error('The API Key or Base URL you supplied is invalid');
  }
  return response.json;
};

const handleBadResponses = (response, z, bundle) => {
  if (response.status === 401) {
    throw new z.errors.Error(
      'The API Key you supplied is incorrect',
      'AuthenticationError',
      response.status
    );
  }

  return response;
};

const includeApiKey = (request, z, bundle) => {
  if (bundle.authData.apiKey) {
    request.params = request.params || {};
    request.params.api_key = bundle.authData.apiKey;
  }

  return request;
};

module.exports = {
  config: {
    type: 'custom',
    fields: [
      {
        key: 'baseUrl',
        label: 'API Base URL',
        type: 'string',
        required: true,
        helpText: 'The base URL of your Todo API (e.g., http://localhost:3001/api)'
      },
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'string',
        required: true,
        helpText: 'The API Key from your Todo application'
      }
    ],
    test,
    connectionLabel: (z, bundle) => {
      return 'Todo App Connection';
    },
  },
  befores: [includeApiKey],
  afters: [handleBadResponses],
};

