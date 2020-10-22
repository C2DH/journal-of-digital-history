import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Col, Row } from 'react-bootstrap'
import FormGroupWrapper from './FormGroupWrapper'


const FormAuthorContact = ({ groupId, onChange }) => {
  const { t } = useTranslation()
  const [ results, setResults ] = useState([
    { id: 'contactFirstName', value: null, label: 'pages.abstractSubmission.contactFirstName' },
    { id: 'contactLastName', value: null, label: 'pages.abstractSubmission.contactLastName' },
    { id: 'contactEmail', value: null, label: 'pages.abstractSubmission.contactEmail' }
  ])
  
  const [repeatEmail, setRepeatEmail] = useState('')
  const [repeatEmailIsValid, setRepeatEmailIsValid] = useState(null)
  const handleChange = ({ id, value, isValid }) => {
    const _results = results.map((d) => {
      if (d.id === id) {
        return { ...d, value, isValid }
      }
      return { ...d }
    })
    const _repeatEmailIsValid = repeatEmail === _results.find(d => d.id === 'contactEmail').value
    setRepeatEmailIsValid(_repeatEmailIsValid)
    setResults(_results)
    // output only if is valid
    const isGroupValid = _repeatEmailIsValid && !_results.some(d => !d.isValid)
    console.info('FormAuthorContact handleChange', id, value, isValid, 'group valid', isGroupValid, repeatEmail)
    
    if (isGroupValid) {
      onChange({
        id: groupId,
        value: _results.map(d => d.value),
        isValid: isGroupValid,
      })
    }
  }
  return (
    <div>
      <Row>
      <Col>
      <FormGroupWrapper
        id='contactFirstName'
        schemaId='#/properties/authors/items/anyOf/author/properties/firstname'
        label='pages.abstractSubmission.authorFirstName' ignoreWhenLengthIslessThan={5}
        onChange={handleChange}
      />
      </Col>
      <Col>
      <FormGroupWrapper
        id='contactLastName'
        schemaId='#/properties/authors/items/anyOf/author/properties/lastname'
        label='pages.abstractSubmission.authorLastName' ignoreWhenLengthIslessThan={5}
        onChange={handleChange}
      />
      </Col>
      </Row>
      <FormGroupWrapper 
        id='contactEmail'
        placeholder='your email' type='email'
        schemaId='#/properties/authors/items/anyOf/author/properties/email'
        label='pages.abstractSubmission.authorEmail' ignoreWhenLengthIslessThan={5}
        onChange={handleChange}
      >
        <Form.Text className="text-muted">
          We'll never share your email with anyone else
        </Form.Text>
      </FormGroupWrapper>
      <Form.Group>
        <Form.Label>{t('pages.abstractSubmission.authorEmailCheck')} </Form.Label>
        <Form.Control type='email' placeholder='write your email again'
          onChange={(event) => setRepeatEmail(event.target.value)}
          isInvalid={repeatEmailIsValid === false}
          isValid={repeatEmailIsValid === true} 
        />
        <Form.Text className="text-muted">
          Note: copy paste is disabled
        </Form.Text>
      </Form.Group>
    </div>
  )
}

export default FormAuthorContact