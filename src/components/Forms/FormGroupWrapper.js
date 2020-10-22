import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { getValidatorResult, getPartialSchema } from '../../logic/validation'


const FormGroupWrapper = ({
  id,
  schemaId, as, type, placeholder, label, children, 
  ignoreWhenLengthIslessThan, rows, setFormErrors,
  onChange,
}) => {
  const { t } = useTranslation()
  const schema = getPartialSchema(schemaId)
  const [isValid, setIsValid] = useState(null)
  const [value, setValue] = useState('')
  const [errors, setErrors] = useState([])
  if (setFormErrors) {
    setFormErrors({ schemaId, label, pristine: true, errors: []})
  }
  const setPristine = () => {
    if (setFormErrors) {
      setFormErrors({ schemaId, label, pristine: true, errors: []})
    }
    onChange({ id, value: null })
    setIsValid(null)
    setErrors([])
  }

  const handleChange = (event) => {
    setValue(event.target.value)
    if (!isNaN(ignoreWhenLengthIslessThan) && event.target.value.length < ignoreWhenLengthIslessThan) {
      setPristine()
      return
    }
    const result = getValidatorResult({
      value: event.target.value,
      schema,
    })
    if (setFormErrors) {
      setFormErrors({ schemaId, label, errors: result.errors })
    }
    setIsValid(result.valid)
    setErrors(result.errors)
    onChange({ id, value: event.target.value, isValid: result.valid })
  }
  return (
    <Form.Group controlId={schemaId}>
      <Form.Label>{t(label)} </Form.Label>
      <Form.Control as={as} type={type} rows={rows} placeholder={placeholder}
        onChange={handleChange}
        isInvalid={isValid === false}
        isValid={isValid === true} 
      />
      {schema.maxLength && (
        <Form.Text className="text-muted">
          <span>{t('numbers.maxAllowedCharactersWithCount', { count: schema.maxLength })}&nbsp;</span>
          { value.length ? (
            <span dangerouslySetInnerHTML={{
              __html: t('numbers.currentCharactersWithCount', { count: value.length })
            }}/>
          ) : null}
        </Form.Text>
      )}
      { children }
      {errors.map((error, i) => (
        <Form.Text key={i}>{error.name} {error.argument}</Form.Text>
      ))}
    </Form.Group>
  )
}

export default FormGroupWrapper