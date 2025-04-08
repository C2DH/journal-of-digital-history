import { ErrorObject } from 'ajv'
import { ValidationErrors } from '../../interfaces/abstractSubmission'

/**
 * Transforms an array of AJV error objects into a structured object with paths as keys.
 * 
 * ### Example
 * Given an error object with an `instancePath` of `/contact/firstName`,
 * the method will categorize it as:
 * 
 * ```json
 * {
 *   "contact": {
 *     "firstName": [
 *       {
 *         "message": "Invalid value",
 *         "keyword": "type",
 *         "instancePath": "/contact/firstName",
 *         "schemaPath": "#/properties/contact/properties/firstName/type",
 *         "params": {
 *           "type": "string"
 *         }
 *       }
 *     ]
 *   }
 * }
 * ```
 * 
 * @param errors - An array of error objects conforming to the `ErrorObject` type. Defaults to an empty array.
 * @returns A `ValidationErrors` object where errors are organized hierarchically based on their `instancePath`.
 */
export const getErrors = (errors: ErrorObject[] = []): ValidationErrors => {
  return errors.reduce((acc: ValidationErrors, error) => {
    const fieldPath = error.instancePath.replace(/^\//, '')
    const pathParts = fieldPath.split('/')

    let current = acc

    pathParts.forEach((part, index) => {
      if (index === pathParts.length - 1) {
        // If it's the last part, push the error
        if (!current[part]) {
          current[part] = []
        }
        current[part].push({
          message: error.message || 'Invalid value',
          keyword: error.keyword,
          instancePath: error.instancePath,
          schemaPath: error.schemaPath,
          params: error.params,
        })
      } else {
        // If it's not the last part, ensure the object exists
        if (!current[part]) {
          current[part] = []
        }
        current = current[part] as unknown as ValidationErrors
      }
    })

    return acc
  }, {})
}

/**
 * Processes an array of error objects and categorizes them into header sections
 * based on the error's instance path.
 *
 * @param errors - An array of error objects, each containing an `instancePath` which indicates the location of the error.
 * @returns A set of unique section names as ['title', 'abstract', 'contact', 'contributors', 'github', 'termsAccepted'].
 */
export const requiredFieldErrors = (errors: ErrorObject[]) => {
  return errors.reduce((acc: Set<string>, error) => {
    const pathParts = error.instancePath.split('/').filter(Boolean)
    let section = pathParts[0] || 'general'

    if (section === 'contact') {
      const subfield = pathParts[1]
      if (['firstName', 'lastName', 'affiliation', 'email', 'orcidUrl'].includes(subfield)) {
        section = 'contact'
      } else if (['githubId', 'blueskyId', 'facebookId'].includes(subfield)) {
        section = 'github'
      }
    }

    acc.add(section)
    return acc
  }, new Set<string>())
}

/**
 * Add error section to an array of header sections based on github API error or confirmation email error.
 *
 * @param errors - A set of error headers.
 * @param section - The section to which the error belongs (e.g., 'github', 'contact').   
 * 
 *
 */
export const addErrorToSection = (
  errorHeaders: Set<string>,
  section: string,
) => {
  if (!errorHeaders[section]) {
    errorHeaders[section] = []
  }
  errorHeaders.add(section)
}

/**
 * Retrieves the error keyword associated with a specific field from a list of error objects.
 * 
 * @param errors - Array of error objects. If not provided, the default is an empty array.
 * @param field - Name of the field 
 * @returns The error keyword for the specified field, or `undefined` if no error 
 */
export const getErrorByField = (errors: ErrorObject[] = [], field: string): string => {
  return getErrors(errors)?.[field]?.[0]?.keyword
}

/**
 * Retrieves the error keyword associated with a specific subfield within a field from a list of error objects.
 *
 * @param errors - Array of error objects. If not provided, the default is an empty array.
 * @param field - Name of the field
 * @param subfield - Name of the subfield
 * @returns The error keyword as a string, or `undefined` if no error
 */
export const getErrorBySubfield = (
  errors: ErrorObject[] = [],
  field: string,
  subfield: string,
): string => {
  return getErrors(errors)?.[field]?.[subfield]?.[0]?.keyword
}

/**
 * Retrieves the error keyword for a specific field within a specific item (a dataset or a contributor) from a list of error objects.
 *
 * @param errors - Array of error objects. If not provided, the default is an empty array.
 * @param section - Name of the section (e.g., 'datasets', 'contributors')
 * @param item - Index of the item 
 * @param field - Name of the field
 * @returns The error keyword as a string, or `undefined` if no error
 */
export const getErrorByItemAndByField = (
  errors: ErrorObject[] = [],
  section: string,
  item: number,
  field: string,
): string => {
  return getErrors(errors)?.[section]?.[item]?.[field]?.[0]?.keyword
}
