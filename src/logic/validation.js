import abstractSchema from '../schemas/Abstract.json'
import { findDeep } from 'deepdash-es/standalone'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'

const ajv = new Ajv({ allErrors: true, verbose: false })
addFormats(ajv)
ajvErrors(ajv)
const validate = ajv.compile(abstractSchema)

const getValidatorResult = ({ value = '', schema = {} }) => {
  return { isValid: validate(value, schema), errors: validate.errors }
}

const getPartialSchema = (propertyId) => {
  const validator = findDeep(abstractSchema, (value, key) => key === '$id' && value === propertyId)
  if (!validator) {
    console.warn(
      'cannot find any validator for the property <',
      propertyId,
      '> in the abstractSchema',
    )
  }

  return validator?.parent ?? { type: 'string' }
}

const getValidatorResultWithAbstractSchema = (value) => {
  validate(value, abstractSchema)
  return { instance: value, errors: validate.errors }
}

export { getValidatorResult, getValidatorResultWithAbstractSchema, getPartialSchema }
