import Ajv from 'ajv'
import addFormats from 'ajv-formats'

/**
 * Validate a form against a schema usign Ajv.
 *
 * @param data - The data object to validate.
 * @param schema - The JSON schema to validate against.
 * @returns An object containing a boolean 'valid' and an array of 'errors'.
 */
function validateForm(data: any, schema: any) {
  const ajv = new Ajv({ allErrors: true })
  addFormats(ajv)
  const validate = ajv.compile(schema)
  const valid = validate(data)

  return { valid, errors: validate.errors }
}

export { validateForm }
