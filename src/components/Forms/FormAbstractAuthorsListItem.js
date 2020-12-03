import React from 'react'
import FormGroupWrapper from './FormGroupWrapper'
import { Row, Col } from 'react-bootstrap'
import Author from '../../models/Author'

const FormAbstractAuthorsListItem = ({ item, onChange, className }) => {
  const handleChange = ({ id, isValid, value }) => {
    onChange({
      item: new Author({
        ...item,
        [id]: value,
        isValid,
      })
    })
  }
  return (
    <div className={className}>
      <Row>
        <Col><FormGroupWrapper
          controlId={['author', item.id, 'firstname'].join('-')}
          schemaId='#/definitions/firstname'
          label='pages.abstractSubmission.authorFirstName' ignoreWhenLengthIslessThan={1}
          initialValue={item.firstname}
          onChange={(field) => handleChange({id: 'firstname', ...field})}
        /></Col>
        <Col>
        <FormGroupWrapper
          controlId={['author', item.id, 'lastname'].join('-')}
          schemaId='#/definitions/lastname'
          label='pages.abstractSubmission.authorLastName' ignoreWhenLengthIslessThan={1}
          initialValue={item.lastname}
          onChange={(field) => handleChange({id: 'lastname', ...field})}
        /></Col>
      </Row>
      <Row>
        <Col>
          <FormGroupWrapper
            controlId={['author', item.id, 'affiliation'].join('-')} type='text'
            schemaId='#/definitions/affiliation'
            label='pages.abstractSubmission.authorAffiliation' ignoreWhenLengthIslessThan={1}
            onChange={(field) => handleChange({id: 'affiliation', ...field})}
            initialValue={item.affiliation}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormGroupWrapper placeholder='email' type='email'
            controlId={['author', item.id, 'email'].join('-')}
            schemaId='#/definitions/email'
            initialValue={item.email}
            label='pages.abstractSubmission.authorEmail' ignoreWhenLengthIslessThan={1}
            onChange={(field) => handleChange({id: 'email', ...field})}
          />
        </Col>
        <Col>
          <FormGroupWrapper placeholder='orcid identifier' type='url'
            controlId={['author', item.id, 'orcid'].join('-')}
            schemaId='#/definitions/orcid'
            initialValue={item.orcid}
            label='pages.abstractSubmission.authorOrcid' ignoreWhenLengthIslessThan={1}
            onChange={(field) => handleChange({id: 'orcid', ...field})}
          />
        </Col>
      </Row>
    </div>
  )
}

export default FormAbstractAuthorsListItem
