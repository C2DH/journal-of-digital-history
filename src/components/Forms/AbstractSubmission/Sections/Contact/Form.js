import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Col, Row, Button } from 'react-bootstrap'
import FormGroupWrapper from '../../GroupWrapper'
import Author from '../../../../../models/Author'


const FormAuthorContact = ({ onChange, onSelectAsAuthor, initialValue }) => {
  const { t } = useTranslation()
  const [parts, setParts] = useState([
    { id: 'firstname', isValid: null },
    { id: 'lastname', isValid: null },
    { id: 'email', isValid: null },
  ])
  const [author, setAuthor] = useState(new Author({...initialValue}))
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
    // handleChange is triggered whenever one of this component field gets updated.
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
      value: temporaryAuthor,
      isValid: temporaryAuthorIsValid && temporaryAuthor.email === repeatEmail,
    })
  }
  return (
    <div>
      <Row>
      <Col>
      <FormGroupWrapper
        schemaId='#/definitions/firstname'
        initialValue={author.firstname}
        label='pages.abstractSubmission.authorFirstName' ignoreWhenLengthIslessThan={5}
        onChange={(field) => handleChange({ id: 'firstname', ...field })}
      />
      </Col>
      <Col>
      <FormGroupWrapper
        id='contactLastName'
        initialValue={author.lastname}
        schemaId='#/definitions/lastname'
        label='pages.abstractSubmission.authorLastName' ignoreWhenLengthIslessThan={5}
        onChange={(field) => handleChange({ id: 'lastname', ...field })}
      />
      </Col>
      </Row>
      <FormGroupWrapper placeholder='affiliation'
        controlId='contact-affiliation'
        schemaId='#/definitions/affiliation'
        initialValue={author.affiliation}
        label='pages.abstractSubmission.authorAffiliation' ignoreWhenLengthIslessThan={1}
        onChange={(field) => handleChange({id: 'affiliation', ...field})}
      />
      <FormGroupWrapper
        id='contactEmail'
        initialValue={author.email}
        placeholder='your email' type='email'
        schemaId='#/definitions/email'
        label='pages.abstractSubmission.authorEmail' ignoreWhenLengthIslessThan={5}
        onChange={(field) => handleChange({ id: 'email', ...field })}
      >
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </FormGroupWrapper>
      <Form.Group>
        <Form.Label>{t('pages.abstractSubmission.authorEmailCheck')} </Form.Label>
        <Form.Control type='email' placeholder='write your email again'
          onChange={(event) => handleRepeatEmail(event.target.value)}
          isInvalid={repeatEmailIsValid === false}
          isValid={repeatEmailIsValid === true}
        />
      </Form.Group>
      <FormGroupWrapper placeholder='orcid identifier' type='url'
        controlId='contact-orcid'
        schemaId='#/definitions/orcid'
        initialValue={author.orcid}
        label='pages.abstractSubmission.authorOrcid' ignoreWhenLengthIslessThan={1}
        onChange={(field) => handleChange({id: 'orcid', ...field})}>
        <Form.Text className="text-muted" dangerouslySetInnerHTML={{
          __html: t('pages.abstractSubmission.authorOrcidHelpText')
        }}/>
      </FormGroupWrapper>
      <div className="text-right">
      <Button
        variant="outline-dark"
        size="sm"
        onClick={handleContactIsAuthorClick}>{t('forms.formAuthorContact.selectAsAuthor')} ＋
        </Button>
      </div>
    </div>
  )
}

export default FormAuthorContact
