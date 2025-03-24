import React from 'react'
import FormGroupWrapper from './FormGroupWrapper'
import { Row, Col } from 'react-bootstrap'
import AuthorSocialMedia from '../../models/Author'

const FormAbstractSocialMediaListItem = ({ item, onChange, className, initialValue }) => {
  const handleChange = ({ id, isValid, value }) => {
    onChange({
      item: new AuthorSocialMedia({
        ...item,
        [id]: value,
        isValid,
      })
    })
  }
  return (
    <div className={className}>
      <Row>
        <Col>
          <FormGroupWrapper
            as='input'
            schemaId='#/definitions/githubId'
            rows={3}
            initialValue={initialValue.githubId}
            label='pages.abstractSubmission.githubId'
            ignoreWhenLengthIslessThan={1}
            onChange={({ value, isValid }) =>
              handleChange({ id: 'githubId', value, isValid })
            }
          />
        </Col>
      </Row>
    </div>
  )
}

export default FormAbstractSocialMediaListItem
