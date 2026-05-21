const { complete, fail, pass, requireFiles, walk } = require('./qa-utils.cjs');

const schemaFiles = walk('api-contracts/schemas').filter((file) => file.endsWith('.json'));
const mockFiles = walk('api-contracts/mocks').filter((file) => file.endsWith('.json'));

complete('qa:api', [
  ...requireFiles([
    'api-contracts/openapi.yaml',
    'api-contracts/error-codes.json',
    'api-contracts/api-client-mapping.md',
  ], 'QA_API_FILE'),
  schemaFiles.length > 0 ? pass('QA_API_SCHEMA', `Found ${schemaFiles.length} schema files`) : fail('QA_API_SCHEMA', 'Missing JSON schema files', 'api-contracts/schemas'),
  mockFiles.length > 0 ? pass('QA_API_MOCK', `Found ${mockFiles.length} mock files`) : fail('QA_API_MOCK', 'Missing mock files', 'api-contracts/mocks'),
]);

