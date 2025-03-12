import abstractSchema from '../schemas/Abstract.json'
import { findDeep } from 'deepdash-es/standalone';
import { validate } from 'jsonschema'

const getValidatorResult = ({
  value = '',
  schema = {}
}) => validate(value, schema)

const getPartialSchema = (propertyId) => {
  const validator = findDeep(abstractSchema, (value, key) => key === '$id' && value === propertyId)
  if (!validator) {
    console.warn('cannot find any validator for the property <', propertyId, '> in the abstractSchema')
  }
  return validator?.parent ?? { type: 'string' }
}

const getValidatorResultWithAbstractSchema = (value) => validate(value, abstractSchema)

export {
  getValidatorResult,
  getValidatorResultWithAbstractSchema,
  getPartialSchema,
}
