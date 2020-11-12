import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Form, Button, Col, Row, Jumbotron,Badge } from 'react-bootstrap'
import ReCAPTCHA from 'react-google-recaptcha'
import { useStore } from '../store'
import { getValidatorResultWithAbstractSchema } from '../logic/validation'
import Author from '../models/Author'
import Dataset from '../models/Dataset'
import FormGroupWrapper from '../components/Forms/FormGroupWrapper'
import FormGroupWrapperPreview from '../components/Forms/FormGroupWrapperPreview'
import FormAuthorContact from '../components/Forms/FormAuthorContact'
import FormAbstractGenericSortableList from '../components/Forms/FormAbstractGenericSortableList'
import AbstractSubmissionPreview from '../components/AbstractSubmissionPreview'
import { ReCaptchaSiteKey } from '../constants'

console.info('%cRecaptcha', 'font-weight:bold', ReCaptchaSiteKey)


const AbstractSubmission = (props) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState([])
  const [isPreviewMode, setPreviewMode] = useState(false)
  const temporaryAbstractSubmission = useStore((state) => state.temporaryAbstractSubmission);
  const setTemporaryAbstractSubmission = useStore((state) => state.setTemporaryAbstractSubmission);
  // const [authors, setAuthors] = useState([])
  const recaptchaRef = React.useRef();
  const [ results, setResults ] = useState([
    { id: 'title', value: temporaryAbstractSubmission.title, label: 'pages.abstractSubmission.articleTitle' },
    { id: 'abstract', value: temporaryAbstractSubmission.abstract, label: 'pages.abstractSubmission.articleAbstract' },
    { id: 'contact', value: temporaryAbstractSubmission.contact, label: 'pages.abstractSubmission.articleContact' },
    { id: 'authors', value: temporaryAbstractSubmission.authors, label: 'pages.abstractSubmission.AuthorsSectionTitle' },
    { id: 'datasets', value: temporaryAbstractSubmission.datasets, label: 'pages.abstractSubmission.DataSectionTitle' }
  ])
  // console.info('temporaryAbstractSubmission', temporaryAbstractSubmission)
  useEffect(() => {
    // Update the document title using the browser API
    useStore.setState({ backgroundColor: 'var(--light)' });
  });
  const handleSubmit = async(event) => {
    event.preventDefault();
    const submission = results.reduce((acc, el) => {
      acc[el.id] = el.value
      return acc
    } , {})
    const result = getValidatorResultWithAbstractSchema(submission)
    setErrors(result.errors)
    setTemporaryAbstractSubmission(submission)
    console.info('handleSubmit', submission, result.valid)
    if (result.valid) {
      const token = await recaptchaRef.current.executeAsync()
      console.info('%cRecaptcha', 'font-weight:bold', 'token:', token)
    }
  }

  const handleChange = ({ id, value, isValid }) => {
    const _results = results.map((d) => {
      if (d.id === id) {
        return { ...d, value, isValid }
      }
      return { ...d }
    })
    const submission = _results.reduce((acc, el) => {
      acc[el.id] = el.value
      return acc
    } , {})
    setTemporaryAbstractSubmission(submission)
    setResults(_results)
  }

  const handleAddContactAsAuthor = (author) => {
    console.info('@todo', author)
    // setAuthors(authors.filter(d => d.id !== author.id).concat([author]))
  }

  const handleRecaptchaChange = (e) => {
    console.info(e)
  }
  
  const handleToggleMode = (mode) => {
    setPreviewMode(mode)
  }
  
  return (
    <Container className="page mb-5">
      <Row>
        <Col md={{span: 6, offset:2}}>
          <h1 className="my-5">{t('pages.abstractSubmission.title')}</h1>
          <Jumbotron className="pt-4 pb-2 px-4">
            <h3>Call for paper: <b>The Digital Dilemma under the lens of history and historians</b></h3>
            <p>
            This is a simple hero unit, a simple jumbotron-style component for calling
              extra attention to featured content or information.
              <br />
              <Badge pill variant="secondary">Due date: Dec. 2020</Badge>
            </p>
          </Jumbotron>
        </Col>
      </Row>
      <Form noValidate onSubmit={handleSubmit}>
        <Row>
          <Col md={{span: 6, offset:2}}>
            <h3>A title and an abstract</h3>
            {!isPreviewMode && <FormGroupWrapper as='textarea' schemaId='#/definitions/title' rows={3}
              initialValue={temporaryAbstractSubmission.title}
              label='pages.abstractSubmission.articleTitle'
              ignoreWhenLengthIslessThan={1}
              onChange={({ value, isValid }) => handleChange({ id: 'title', value, isValid })}
            />}
            {isPreviewMode && (
              <FormGroupWrapperPreview
                label='pages.abstractSubmission.articleTitle'
              >
                {temporaryAbstractSubmission.title}
              </FormGroupWrapperPreview>
            )}
            {!isPreviewMode && (
              <FormGroupWrapper as='textarea' schemaId='#/definitions/abstract' rows={5}
                initialValue={temporaryAbstractSubmission.abstract}
                label='pages.abstractSubmission.articleAbstract'
                ignoreWhenLengthIslessThan={1}
                onChange={({ value, isValid }) => handleChange({ id: 'abstract', value, isValid })}
              />
            )}
            {isPreviewMode && 
              <FormGroupWrapperPreview
              label='pages.abstractSubmission.articleAbstract'
              >{temporaryAbstractSubmission.abstract}
              </FormGroupWrapperPreview>}
            <hr />

            <h3>{t('pages.abstractSubmission.ContactPointSectionTitle')}</h3>
            {!isPreviewMode && (
              <FormAuthorContact
                initialValue={temporaryAbstractSubmission.contact}
                onChange={({ value, isValid }) => handleChange({ id: 'contact', value, isValid })}
                onSelectAsAuthor={handleAddContactAsAuthor}
              />
            )}
            {isPreviewMode && 
              <FormGroupWrapperPreview>
                {(new Author({...temporaryAbstractSubmission.contact }).asText())}
              </FormGroupWrapperPreview>}

            <hr />

            <h3>{t('pages.abstractSubmission.AuthorsSectionTitle')}</h3>
            {!isPreviewMode && <FormAbstractGenericSortableList
              onChange={({ items, isValid }) => handleChange({
                id: 'authors',
                value: items,
                isValid
              })}
              ItemClass={Author}
              initialItems={temporaryAbstractSubmission.authors}
              addNewItemLabel={t('actions.addAuthor')}
              listItemComponentTagName='FormAbstractAuthorsListItem' />}
            {isPreviewMode && temporaryAbstractSubmission.authors.map((d, i) => (
              <FormGroupWrapperPreview key={i}>
                {(new Author({...d }).asText())}
              </FormGroupWrapperPreview>
            ))}
            <hr />

            <h3>{t('pages.abstractSubmission.DataSectionTitle')}</h3>
            {!isPreviewMode && <FormAbstractGenericSortableList
              onChange={({ items, isValid }) => handleChange({
                id: 'datasets',
                value: items,
                isValid
              })}
              initialItems={temporaryAbstractSubmission.datasets}
              ItemClass={Dataset}
              addNewItemLabel={t('actions.addDataset')}
              listItemComponentTagName='FormAbstractDatasetsListItem' />}
              {isPreviewMode && temporaryAbstractSubmission.datasets.map((d, i) => (
                <FormGroupWrapperPreview key={i}>
                  {(new Dataset({...d }).asText())}
                </FormGroupWrapperPreview>
              ))}
            <hr />
          </Col>
          <Col md={3}>
            <div style={{
              position: 'sticky',
              top: '120px'
            }}>
            <AbstractSubmissionPreview
              results={results}
              submission={temporaryAbstractSubmission}
              isPreviewMode={isPreviewMode}
              onChangeMode={handleToggleMode}
            />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={{span: 6, offset:2}} className="">
            <Button variant="primary" size="lg" className="px-4" type="submit">
              Submit
            </Button>
            <p dangerouslySetInnerHTML={{__html: t('pages.abstractSubmission.recaptchaDisclaimer')}}/><ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={ReCaptchaSiteKey}
              onChange={handleRecaptchaChange}
            />
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}

export default AbstractSubmission
