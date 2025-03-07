import {
  getResourcePathItems,
  hasGetMethod,
  isSingletonResource,
  isResourceCollectionIdentifier,
} from './utils/resourceEvaluation.js';
import { hasException } from './utils/exceptions.js';
import { getAllSuccessfulResponseSchemas } from './utils/methodUtils.js';
import { collectAdoption, collectAndReturnViolation, collectException } from './utils/collectionUtils.js';

const RULE_NAME = 'xgen-IPA-113-singleton-must-not-have-id';
const ERROR_MESSAGE = 'Singleton resources must not have a user-provided or system-generated ID.';

export default (input, opts, { path, documentInventory }) => {
  const resourcePath = path[1];

  if (!isResourceCollectionIdentifier(resourcePath)) {
    return;
  }

  const oas = documentInventory.resolved;
  const resourcePathItems = getResourcePathItems(resourcePath, oas.paths);

  if (isSingletonResource(resourcePathItems)) {
    if (hasException(input, RULE_NAME)) {
      collectException(input, RULE_NAME, path);
      return;
    }
    if (hasGetMethod(input)) {
      const resourceSchemas = getAllSuccessfulResponseSchemas(input['get']);
      if (resourceSchemas.some(({ schema }) => schemaHasIdProperty(schema))) {
        return collectAndReturnViolation(path, RULE_NAME, ERROR_MESSAGE);
      }
      collectAdoption(path, RULE_NAME);
    }
  }
};

function schemaHasIdProperty(schema) {
  if (Object.keys(schema).includes('properties')) {
    const propertyNames = Object.keys(schema['properties']);
    return propertyNames.includes('id') || propertyNames.includes('_id');
  }
  return false;
}
