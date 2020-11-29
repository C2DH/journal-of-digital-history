import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from "react-router-dom";
import { Container, Form, Button, Col, Row, Jumbotron,Badge } from 'react-bootstrap'
import LangLink from '../components/LangLink'
import ReCAPTCHA from 'react-google-recaptcha'
import { useStore } from '../store'
import { getValidatorResultWithAbstractSchema } from '../logic/validation'
import Author from '../models/Author'
import Dataset from '../models/Dataset'
import FormGroupWrapper from '../components/Forms/FormGroupWrapper'
import FormGroupWrapperPreview from '../components/Forms/FormGroupWrapperPreview'
import FormAuthorContact from '../components/Forms/FormAuthorContact'
import FormAbstractGenericSortableList from '../components/Forms/FormAbstractGenericSortableList'
import FormAbstractResultModal from '../components/Forms/FormAbstractResultModal'
import FormJSONSchemaErrorListItem from '../components/Forms/FormJSONSchemaErrorListItem'
import AbstractSubmissionPreview from '../components/AbstractSubmissionPreview'
import { ReCaptchaSiteKey } from '../constants'
import { createAbstractSubmission } from '../logic/api/postData'

console.info('%cRecaptcha site key', 'font-weight:bold', ReCaptchaSiteKey)


const AbstractSubmission = (props) => {
  const { t } = useTranslation()
  const history = useHistory();
  const [errors, setErrors] = useState([])
  const [isPreviewMode, setPreviewMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const temporaryAbstractSubmission = useStore((state) => state.temporaryAbstractSubmission);
  const setTemporaryAbstractSubmission = useStore((state) => state.setTemporaryAbstractSubmission);
  // const [authors, setAuthors] = useState([])
  const recaptchaRef = React.useRef();
  const [ results, setResults ] = useState([
    {
      id: 'title',
      value: temporaryAbstractSubmission.title,
      isValid: null,
      label: 'pages.abstractSubmission.articleTitle' },
    { id: 'abstract', value: temporaryAbstractSubmission.abstract, label: 'pages.abstractSubmission.articleAbstract' },
    { id: 'contact', value: temporaryAbstractSubmission.contact, label: 'pages.abstractSubmission.articleContact' },
    { id: 'authors', value: temporaryAbstractSubmission.authors, label: 'pages.abstractSubmission.AuthorsSectionTitle' },
    { id: 'datasets', value: temporaryAbstractSubmission.datasets, label: 'pages.abstractSubmission.DataSectionTitle' },
    {
      id: 'acceptConditions', value: temporaryAbstractSubmission.acceptConditions
    }
  ])
  const [ validatorResult, setValidatorResult ] = useState(null)
  useEffect(() => {
    const { title, abstract, contact, authors, datasets, acceptConditions } = temporaryAbstractSubmission
    setValidatorResult(getValidatorResultWithAbstractSchema({
      title,
      abstract,
      contact,
      authors,
      datasets,
      acceptConditions
    }))
  }, [temporaryAbstractSubmission]);
  useEffect(() => {
    useStore.setState({ backgroundColor: 'var(--gray-100)' });
  })

  const handleSubmit = async(event) => {
    event.preventDefault();
    if (isSubmitting) {
      console.warn('already busy submitting the form!')
      return
    }
    const submission = results.reduce((acc, el) => {
      acc[el.id] = el.value
      return acc
    } , {})
    // const result = getValidatorResultWithAbstractSchema(submission)
    setTemporaryAbstractSubmission({
      ...submission,
      dateCreated: temporaryAbstractSubmission.dateCreated
    })
    console.info('handleSubmit: validatorResult', validatorResult)
    if (validatorResult.valid) {
      // setConfirmModalShow(true)
      setIsSubmitting(true)
      await handleConfirmCreateAbstractSubmission()
    }
    //   setIsSubmitting(true)
    //   setConfirmModalShow(true)
    // } else {
    //   setErrors(result.errors)
    // }
  }

  const handleConfirmCreateAbstractSubmission = async() => {
    console.info('handleConfirmCreateAbstractSubmission', temporaryAbstractSubmission)
    const token = await recaptchaRef.current.executeAsync()
    console.info('%cRecaptcha', 'font-weight:bold', 'token:', token)
    createAbstractSubmission({
      item: temporaryAbstractSubmission,
      token,
    }).catch((err) => {
      console.info(err.message, 'status=', err.response.status)
      setIsSubmitting(false)
    }).then((res) => {
      console.log('received', res)
      if(res?.status === 201) {
        setTemporaryAbstractSubmission({})
        history.push(`/en/abstract/${res.data.id}`);
      }
    })
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
    console.info('@change', submission)
    // todo add creation date if a temporaryAbstractSubmission object is available.
    setTemporaryAbstractSubmission({
      ...submission,
      dateCreated: temporaryAbstractSubmission.dateCreated,
    })
    setResults(_results)
  }

  const handleAddContactAsAuthor = (author) => {
    console.info('@todo', author)
    const authors = temporaryAbstractSubmission.authors
      .filter(d => d.id !== author.id)
      .concat([{...author }])
    setTemporaryAbstractSubmission({
      ...temporaryAbstractSubmission,
      authors,
    })
    setResults(results.map(d => {
      if(d.id === 'authors') {
        return {
          ...d,
          value: authors
        }
      }
      return d;
    }))
    // setAuthors(authors.filter(d => d.id !== author.id).concat([author]))
  }

  const handleToggleMode = (mode) => {
    setPreviewMode(mode)
  }

  const isEmpty = (
    temporaryAbstractSubmission.title.length +
    temporaryAbstractSubmission.abstract.length +
    Object.keys(temporaryAbstractSubmission.contact).length +
    temporaryAbstractSubmission.authors.length +
    temporaryAbstractSubmission.datasets.length
  ) === 0


  return (
    <Container className="page mb-5">
      <Row>
        <Col md={{span: 6, offset:2}}>
          <h1 className="my-5">{t('pages.abstractSubmission.title')}</h1>
          <Jumbotron className="pt-4 pb-2 px-4">
            <h3>Call for Paper: <b>The Digital Dilemma under the Lens of History and Historians</b></h3>
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
            <h3 className="progressiveHeading">Title and Abstract</h3>
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

            <h3 className="progressiveHeading">{t('pages.abstractSubmission.ContactPointSectionTitle')}</h3>
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

            <h3 className="progressiveHeading">{t('pages.abstractSubmission.AuthorsSectionTitle')}</h3>
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

            <h3 className="progressiveHeading">{t('pages.abstractSubmission.DataSectionTitle')}</h3>
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
          <Col md={4} lg={3}>
            <div style={{
              position: 'sticky',
              top: 50
            }}>
            {validatorResult && <AbstractSubmissionPreview
              validatorResult={validatorResult}
              submission={temporaryAbstractSubmission}
              isPreviewMode={isPreviewMode}
              onChangeMode={handleToggleMode}
            />}
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={{span: 6, offset:2}} className="">
            <Form.Group size="md"  onChange={(e) => handleChange({
              id: 'acceptConditions',
              value: e.target.checked,
              isValid: e.target.checked
            })} controlId="formBasicCheckbox">
              <Form.Check size="md" >
              <Form.Check.Input type="checkbox" defaultChecked={temporaryAbstractSubmission.acceptConditions}/>
              <Form.Check.Label>
                <span dangerouslySetInnerHTML={{__html: t('labels.acceptConditions') }} />&nbsp;
                <LangLink to="/terms" target="_blank">Terms of Use</LangLink>
              </Form.Check.Label>
              </Form.Check>
            </Form.Group>
            <p className="my-3" dangerouslySetInnerHTML={{__html: t('pages.abstractSubmission.recaptchaDisclaimer')}}/><ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={ReCaptchaSiteKey}
            />

            {!isEmpty && validatorResult?.errors.map((error,i) =>
              <FormJSONSchemaErrorListItem error={error} />
            )}
            <div className="text-center mt-5">
            {isEmpty
              ? (<Button disabled
                  variant="outline-secondary" size="lg"
                  type="submit">{t('actions.submit')}</Button>)
              : <Button disabled={validatorResult?.errors.length}
                  variant="outline-secondary" size="lg"
                  type="submit">
                  {validatorResult?.errors.length
                    ? <Badge variant="danger" className="mr-3">{validatorResult?.errors.length} errors</Badge>
                    : null
                  } {t('actions.submit')}
                </Button>
            }
            </div>
          </Col>
        </Row>
      </Form>
      <FormAbstractResultModal
        show={confirmModalShow}
        onHide={() => {
          setIsSubmitting(true)
          setConfirmModalShow(false)
        }}
        onConfirm={handleConfirmCreateAbstractSubmission}
        errors={errors}
      />
    </Container>
  )
}

export default AbstractSubmission
