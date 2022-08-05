const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
  version: process.env.watsonAssistantVersion,
  authenticator: new IamAuthenticator({
    apikey: process.env.watsonAssistantApiKey,
  }),
  serviceUrl: 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/1f01df0e-8fb2-4e6b-9a5a-05a781894398',
});

module.exports = assistant