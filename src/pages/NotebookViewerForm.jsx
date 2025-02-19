import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useNavigate, generatePath } from 'react-router'
import { encodeNotebookURL } from '../logic/ipynb'
import { BootstrapColumLayout } from '../constants'
import FormNotebookUrl from '../components/Forms/FormNotebookUrl'

/**
 * THis component displays the form where we can add the notebook
 * url. On submit, it checks the validity of the url (if on github)
 * then forward the user to the notebook-viewer/url page
 * (which is handled by another component `NotebookViewer`
 * for simplicity sake)
 */
const NotebookViewerForm = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()


  const handleNotebookUrlSubmit = ({ value, proxyValue }) => {
    // link to the notebbok viewer page with the right url link.
    if (proxyValue) {
      console.info(
        'handleNotebookUrlChange using local proxy',
        proxyValue,
        encodeNotebookURL(proxyValue),
      )
      navigate(generatePath('/:lang/notebook-viewer/:encodedUrl', {
        encodedUrl: encodeNotebookURL(proxyValue),
        lang: i18n.language.split('-')[0],
      }))
      
      // This rewrites URL from
      // https://github.com/C2DH/jdh-notebook/blob/features/template/author_guideline_template.ipynb
      // to
      // https://raw.githubusercontent.com/C2DH/jdh-notebook/features/template/author_guideline_template.ipynb
      // /proxy-githubusercontent/C2DH/jdh-notebook/features/template/author_guideline_template.ipynb
    } else {
      // set error why not...
      console.info('handleNotebookUrlChange', value, encodeNotebookURL(value))
    }
  }

  return (
    <Container className="page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">{t('Pages_NotebookViewer_Title')}</h1>
          <FormNotebookUrl onSubmit={handleNotebookUrlSubmit} />
        </Col>
      </Row>
    </Container>
  )
}

export default NotebookViewerForm
