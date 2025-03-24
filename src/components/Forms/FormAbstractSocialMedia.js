import React, {useState} from 'react'
import FormGroupWrapper from './FormGroupWrapper'
import { Form, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { AuthorSocialMedia as SocialMedia } from '../../models/Author'

const FormAbstractSocialMedia = ({ initialValue }) => {
  const { t } = useTranslation()

  const [parts, setParts] = useState([
    { id: 'githubId', isValid: null }
  ])
  const [socialMedia, setSocialMedia] = useState(new SocialMedia({...initialValue}))

  const handleChange = ({ id, isValid, value }) => {
    const _parts = parts.map((d) => {
      if (d.id === id) {
        return { ...d, value, isValid }
      }
      return { ...d }
    })
    const temporarySocialMedia = new SocialMedia({
      ...socialMedia,
      [id]: value,
    })
    setParts(_parts)
    setSocialMedia(temporarySocialMedia)
  }
  return (
      <Row>
        <Col>
          <Form.Text className="text-muted">
            {t('pages.abstractSubmission.githubIdExplanation')}
          </Form.Text>
          <div className="my-3"></div>
          <FormGroupWrapper
            schemaId='#/definitions/githubId'
            initialValue={socialMedia.githubId}
            label='pages.abstractSubmission.githubId'
            placeholder= {t('pages.abstractSubmission.githubIdPlaceholder')}
            ignoreWhenLengthIslessThan={1}
            onChange={({ value, isValid }) =>
              handleChange({ id: 'githubId', value, isValid })
            }
          />
          <Form.Text className="text-muted" 
            dangerouslySetInnerHTML={{
            __html: t('pages.abstractSubmission.githubIdHelpText')
          }}/>
        </Col>
      </Row>
  )

}

export default FormAbstractSocialMedia
