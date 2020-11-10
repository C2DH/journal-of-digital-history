import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Col, Row, Button } from 'react-bootstrap'
import FormGroupWrapper from './FormGroupWrapper'
import Author from '../../models/Author'


const FormAuthorContact = ({ onChange, onSelectAsAuthor }) => {
  const { t } = useTranslation()
  const [parts, setParts] = useState([
    { id: 'firstname', isValid: null },
    { id: 'lastname', isValid: null },
    { id: 'email', isValid: null },
  ])
  const [author, setAuthor] = useState(new Author())
  const [isAuthorValid, setAuthorIsValid] = useState(null)
  const [repeatEmail, setRepeatEmail] = useState('')
  const [repeatEmailIsValid, setRepeatEmailIsValid] = useState(null)

  const handleRepeatEmail = (value) => {
    setRepeatEmail(value)
    setRepeatEmailIsValid(author.email === value)
    onChange({
      value: author,
      isValid: isAuthorValid && author.email === value,
    })
  }

  const handleContactIsAuthorClick = () => {
    const isValid = !parts.some(d => !d.isValid);
    onSelectAsAuthor(new Author({
      ...author,
      id: 'contact',
      isValid,
    }))
  }

  const handleChange = ({ id, isValid, value }) => {
    // handleChangeis triggered whenever one of this component field gets updated.
    const _parts = parts.map((d) => {
      if (d.id === id) {
        return { ...d, value, isValid }
      }
      return { ...d }
    })
    // update related field in Author instance
    const temporaryAuthor = new Author({
      ...author,
      [id]: value,
    })
    const temporaryAuthorIsValid = _parts.some(d => !d.isValid);
    // store current state results
    setParts(_parts)
    setAuthorIsValid(temporaryAuthorIsValid)
    setAuthor(temporaryAuthor)
    // only if email changed
    if( id === 'email') {
      setRepeatEmailIsValid(temporaryAuthor.email === repeatEmail)
    }
    // try to send out the value
    onChange({
      value: author,
      isValid: temporaryAuthorIsValid && temporaryAuthor.email === repeatEmail,
    })
  }
  return (
    <div>
      <Row>
      <Col>
      <FormGroupWrapper
        schemaId='#/definitions/firstname'
        label='pages.abstractSubmission.authorFirstName' ignoreWhenLengthIslessThan={5}
        onChange={(field) => handleChange({ id: 'firstname', ...field })}
      />
      </Col>
      <Col>
      <FormGroupWrapper
        id='contactLastName'
        schemaId='#/definitions/lastname'
        label='pages.abstractSubmission.authorLastName' ignoreWhenLengthIslessThan={5}
        onChange={(field) => handleChange({ id: 'lastname', ...field })}
      />
      </Col>
      </Row>
      <FormGroupWrapper
        id='contactEmail'
        placeholder='your email' type='email'
        schemaId='#/definitions/email'
        label='pages.abstractSubmission.authorEmail' ignoreWhenLengthIslessThan={5}
        onChange={(field) => handleChange({ id: 'email', ...field })}
      >
        <Form.Text className="text-muted">
          We'll never share your email with anyone else
        </Form.Text>
      </FormGroupWrapper>
      <Form.Group>
        <Form.Label>{t('pages.abstractSubmission.authorEmailCheck')} </Form.Label>
        <Form.Control type='email' placeholder='write your email again'
          onChange={(event) => handleRepeatEmail(event.target.value)}
          isInvalid={repeatEmailIsValid === false}
          isValid={repeatEmailIsValid === true}
        />
        <Form.Text className="text-muted">
          Note: copy paste is disabled
        </Form.Text>
      </Form.Group>
      <div className="text-right">
      <Button 
        variant="outline-dark"
        size="sm"
        onClick={handleContactIsAuthorClick}>{t('forms.formAuthorContact.selectAsAuthor')} ＋
        </Button>
      </div>
      <pre>{JSON.stringify(author)}</pre>
    </div>
  )
}

export default FormAuthorContact
