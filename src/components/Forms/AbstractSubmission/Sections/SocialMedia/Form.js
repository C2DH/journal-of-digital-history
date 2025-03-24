import React, { useState, useCallback, useEffect } from 'react'
import FormGroupWrapper from '../../GroupWrapper'
import { Form, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { SocialMedia } from '../../../../../models/Author'

import { debounce } from '../../../../../logic/viewport'
// import { error } from 'ajv/dist/vocabularies/applicator/dependencies'

const FormAbstractSocialMedia = ({ initialValue, onChange }) => {
  const { t } = useTranslation()

  const [parts, setParts] = useState([{ id: 'githubId', isValid: null }])
  const [socialMedia, setSocialMedia] = useState(new SocialMedia({ ...initialValue }))
  const [isGithubIdValid, setIsGithubValid] = useState(false)

  const validateGithubUsername = async (value) => {
    // console.log("🚀 ~ file: Form.js:18 ~ value:", value)
    onChange({ value, isValid: true })
    return setIsGithubValid(true)
    // const url = `${process.env.REACT_APP_GITHUB_USERS_API_ENDPOINT}${value.githubId}`

    // try {
    //   const response = await fetch(url)
    //   console.info('[GithubAPI] Username response:', response)
    //   let userExist = response.ok
    //   setIsGithubValid(userExist)

    //   if (response.ok) {
    //     onChange({ id: 'githubId', value, isValid: true })
    //   } else {
    //     onChange({ id: 'githubId', value, isValid: false })
    //   }
    // } catch (error) {
    //   console.error('Error checking GitHub username:', error)
    // }
  }

  const debouncedValidateGithubUser = useCallback(debounce(validateGithubUsername, 1000), [])

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
    // console.log("🚀 ~ file: Form.js:49 ~ temporarySocialMedia:", temporarySocialMedia)
    setParts(_parts)
    setSocialMedia(temporarySocialMedia)

    if (id === 'githubId') {
      debouncedValidateGithubUser(temporarySocialMedia)
    } else {
      onChange({ id: 'socialMedia', value: temporarySocialMedia, isValid })
    }
  }

  useEffect(() => {}, [isGithubIdValid])

  return (
    <Row>
      <Col>
        <Form.Text className="text-muted">
          {t('pages.abstractSubmission.githubIdExplanation')}
        </Form.Text>
        <div className="my-3"></div>
        <FormGroupWrapper
          schemaId="#/definitions/githubId"
          initialValue={socialMedia.githubId}
          label="pages.abstractSubmission.githubId"
          placeholder={t('pages.abstractSubmission.githubIdPlaceholder')}
          ignoreWhenLengthIslessThan={1}
          onChange={({ value, isValid }) => {

            return handleChange({ id: 'githubId', value, isValid })
          }}
          isGithubIdValid={isGithubIdValid}
        />
        <Form.Text
          className="text-muted"
          dangerouslySetInnerHTML={{
            __html: t('pages.abstractSubmission.githubIdHelpText'),
          }}
        />
      </Col>
    </Row>
  )
}

export default FormAbstractSocialMedia
