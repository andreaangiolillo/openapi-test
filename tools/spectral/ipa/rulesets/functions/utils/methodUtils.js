/**
 * Returns a list of all successful response schemas for the passed operation, i.e. for any 2xx response.
 *
 * @param {object} operationObject the object for the operation
 * @returns {Object[{schemaPath: Array<string>, schema: Object}]} all 2xx response schemas and the path to each schema
 */
export function getAllSuccessfulResponseSchemas(operationObject) {
  const path = [];

  const responses = operationObject['responses'];
  path.push('responses');

  const successfulResponseKey = Object.keys(responses).filter((k) => k.startsWith('2'))[0];
  path.push(successfulResponseKey);

  const responseContent = responses[successfulResponseKey]['content'];
  path.push('content');

  const result = [];
  Object.keys(responseContent).forEach((k) => {
    const schema = responseContent[k]['schema'];
    const schemaPath = path.concat([k]);
    if (schema) {
      result.push({
        schemaPath,
        schema,
      });
    }
  });
  return result;
}

/**
 * Gets the schema reference for a schema object. If the schema does not have a reference, undefined is returned.
 *
 * @param {object} schema the unresolved schema object
 * @returns {string} the schema ref
 */
export function getSchemaRef(schema) {
  if (schema.type === 'array' && schema.items) {
    return schema.items.$ref;
  }
  return schema.$ref;
}
