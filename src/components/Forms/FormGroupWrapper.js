import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { getValidatorResult, getPartialSchema } from '../../logic/validation'


const FormGroupWrapper = ({
  controlId,
  schemaId, as, type, placeholder, label, children,
  ignoreWhenLengthIslessThan = 1, rows,
  initialValue,
  onChange,
}= {}) => {
  const { t } = useTranslation()
  const schema = getPartialSchema(schemaId)
  const [isValid, setIsValid] = useState(null)
  const [valueLength, setValueLength] = useState(initialValue?.length || 0)
  const [errors, setErrors] = useState([])

  const handleChange = (event) => {
    setValueLength(event.target.value)
    const result = getValidatorResult({
      value: event.target.value,
      schema,
    })
    if (!isNaN(ignoreWhenLengthIslessThan) && event.target.value.length < ignoreWhenLengthIslessThan) {
      setIsValid(null)
    } else {
      setIsValid(result.valid)
    }
    setErrors(result.errors)
    onChange({ value: event.target.value, isValid: result.valid })
  }
  return (
    <Form.Group controlId={controlId ?? schemaId.replace(/[#/]/g, '-')}>
      <Form.Label>{t(label)} </Form.Label>
      <Form.Control as={as} type={type} rows={rows} placeholder={placeholder}
        onChange={handleChange}
        isInvalid={isValid === false}
        isValid={isValid === true}
        value={initialValue || ''}
      />
      {schema.maxLength && (
        <Form.Text className="text-muted">
          <span>{t('numbers.maxAllowedCharactersWithCount', { count: schema.maxLength })}&nbsp;</span>
          { valueLength.length ? (
            <span dangerouslySetInnerHTML={{
              __html: t('numbers.currentCharactersWithCount', { count: valueLength.length })
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
