import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { BootstrapColumLayout } from '../constants'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { encodeNotebookUrl } from '../logic/notebook'
import { Cpu } from 'react-feather'

const LocalNotebook = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [value, setValue] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.isValid) {
      navigate( `/${i18n.language.split('-')[0]}/notebook-viewer/${value.encodedURL}`)
    }
  }

  const getJupyterApiURL = ({ url, token }) => {
    const urlF = new URL(url)
    let notebookURL = ''
    if (urlF.pathname.indexOf('/notebooks/') === 0) {
      // Jupyter notebook
      notebookURL = `${urlF.origin}/api/contents/${urlF.pathname
        .split('/notebooks/')
        .pop()}?type=notebook&token=${token}`
    } else {
      // Jupyterlab
      notebookURL = `${urlF.origin}/api/contents/${urlF.pathname
        .split('/tree/')
        .pop()}?type=notebook&token=${token}`
    }
    return notebookURL
  }

  const handleJupyterLabToken = (token) => {
    const updatedValue = { ...value, token }
    try {
      updatedValue.apiURL = getJupyterApiURL({
        url: value.url,
        token,
      })
      updatedValue.encodedURL = encodeNotebookUrl(updatedValue.apiURL)
      updatedValue.isValid = true
      updatedValue.isTokenValid = true
    } catch (err) {
      console.warn(err)
      updatedValue.err = err
      updatedValue.isValid = false
      updatedValue.isTokenValid = false
    }
    setValue(updatedValue)
  }

  const handleJupyterLabURL = (url) => {
    // url is usually like
    // http://localhost:8888/lab/workspaces/auto-m/tree/jdh-notebook/examples/article.ipynb
    const updatedValue = { ...value, url }
    try {
      updatedValue.apiURL = getJupyterApiURL({
        url,
        token: value.token,
      })
      updatedValue.encodedURL = encodeNotebookUrl(updatedValue.apiURL)
      updatedValue.isValid = true
      updatedValue.isURLValid = true
    } catch (err) {
      updatedValue.err = err
      updatedValue.isValid = false
      updatedValue.isURLValid = false
    }
    setValue(updatedValue)
  }

  return (
    <Container className="page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">Local notebook (experimental)</h1>
          <h2>Load your ipytn notebook while you're typing!</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Jupyter lab full notebook url</Form.Label>
              <Form.Control
                value={value.url ?? ''}
                onChange={(e) => handleJupyterLabURL(e.target.value)}
                type="url"
                placeholder="http:localhost:8888//"
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>token</Form.Label>
              <Form.Control
                value={value.token ?? ''}
                onChange={(e) => handleJupyterLabToken(e.target.value)}
                type="text"
                placeholder="abcABC"
              />
              <Form.Text className="text-muted">
                Load your ipytn notebook while you're typing!
              </Form.Text>
            </Form.Group>
            <div>
              {value.isValid ? (
                <p>
                  Resulting link:{' '}
                  <a href={value.apiURL} target="_blank" rel="noopener noreferrer">
                    {value.apiURL}
                  </a>
                </p>
              ) : (
                <p className="text-danger">not valid!</p>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              variant="secondary"
              type="submit"
              style={{
                borderRadius: '5px',
                paddingLeft: '1rem',
                paddingRight: '1rem',
              }}
            >
              <span className="me-2">{t('FormNotebookUrl_GenerateLink')}</span>
              <Cpu size="16" />
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default LocalNotebook
