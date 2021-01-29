import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, generatePath } from 'react-router'
import { BootstrapColumLayout } from '../constants'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'


const LocalNotebook = () => {
  const history = useHistory()
  const { i18n } = useTranslation()
  const [value, setValue] = useState({})

  const handleSubmit = () => {
    if (value.isValid) {
      history.push({
        pathname: generatePath("/:lang/notebook/:encodedUrl", {
          encodedUrl: btoa(value.apiURL),
          lang: i18n.language.split('-')[0]
        })
      })
    }
  }

  const getJupyterApiURL = ({ url, token }) => {
    const urlF = new URL(url)
    let notebookURL = ''
    if (urlF.pathname.indexOf('/notebooks/') === 0) {
      // Jupyter notebook
      notebookURL = `${urlF.origin}/api/contents/${urlF.pathname.split('/notebooks/').pop()}?type=notebook&token=${token}`
    } else {
      // Jupyterlab
      notebookURL = `${urlF.origin}/api/contents/${urlF.pathname.split('/tree/').pop()}?type=notebook&token=${token}`
    }
    return notebookURL
  }

  const handleJupyterLabToken = (token) => {
    const updatedValue = { ...value, token }
    try {
      updatedValue.apiURL = getJupyterApiURL({
        url: value.url,
        token
      })
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
        token: value.token
      })
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
    <Container className="mt-5">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1>Local notebook  (experimental)</h1>
          <h2>
            Load your ipytn notebook while you're typing!
          </h2>
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
            {value.isValid
              ? (<p>Resulting link: <a href={value.apiURL} target="_blank" rel="noopener noreferrer">{value.apiURL}</a></p>)
              : (<p className="text-danger">not valid!</p>)
            }
            </div>
            <Button onClick={handleSubmit} variant="primary" type="submit">
              get the notebook!
            </Button>
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default LocalNotebook
