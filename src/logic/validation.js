import abstractSchema from '../schemas/Abstract.json'
import {validate} from 'jsonschema'
const getValidatorResultWithAbstractSchema = ({
  property = '',
  value = ''
}) => validate(value, {"$id": "#/properties/title",
    "type": "string",
    "title": "The title schema",
    "description": "An explanation about the purpose of this instance.",
    "default": "",
    "examples": [
        "article title"
    ],
    "minLength": 10,
    "maxLength": 100,
  })

export {
  getValidatorResultWithAbstractSchema
}