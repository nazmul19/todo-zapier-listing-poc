const authentication = require('./authentication');
const createTodo = require('./creates/todo');
const newTodo = require('./triggers/todo');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  beforeRequest: [
    (request, z, bundle) => {
      request.headers['x-api-key'] = bundle.authData.apiKey;
      return request;
    }
  ],

  afterResponse: [],

  resources: {},

  triggers: {
    [newTodo.key]: newTodo
  },

  creates: {
    [createTodo.key]: createTodo
  },

  searches: {}
};
