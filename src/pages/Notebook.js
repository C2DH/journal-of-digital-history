import React, { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory, generatePath } from 'react-router'
import Article from './Article'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { useGetNotebookFromURL } from '../logic/api/fetchData'
import { BootstrapColumLayout, StatusIdle, StatusNone, StatusSuccess } from '../constants'
// url=aHR0cHM6Ly9naXRodWIuY29tL0MyREgvamRoLW5vdGVib29rL2Jsb2IvbWFzdGVyL3BvYy5pcHluYg
// as base64 encoded for url=https://github.com/C2DH/jdh-notebook/blob/master/poc.ipynb


const Notebook = () => {
  const { i18n, t } = useTranslation()
  const { encodedUrl } = useParams()
  const history = useHistory()
  const [value, setValue] = useState(null)
  const url = useMemo(() => {
    try{
      return atob(encodedUrl)
    } catch(e) {
      console.warn(e)
    }
  }, [ encodedUrl ])
  console.info('Notebook render:', url)
  // check url...
  const { status, item } = useGetNotebookFromURL(url)
  const [uploadedNotebook, setUploadedNotebook] = useState(null)
  // resize if document is loaded
  useEffect(() => {
    let timer
    if(status === StatusSuccess) {
      timer = setTimeout(() => window.dispatchEvent(new Event('resize')), 500)
    }
    return () => clearTimeout(timer)
  }, [status])
  // fetch url if available.
  const handleSubmit = () => {
    history.push({
      pathname: generatePath("/:lang/notebook/:encodedUrl", {
        encodedUrl: btoa(value),
        lang: i18n.language.split('-')[0]
      })
    })
  }
  const handleNotebookUpload = (e) => {
    const [file] = e.target.files
    if (file) {
      const reader = new FileReader()
      reader.addEventListener('load', ({ target }) => {
        const jipynb = JSON.parse(target.result)
        console.info('LOADED', jipynb?.content?.cells ? jipynb.content : jipynb)
        setUploadedNotebook(jipynb?.content?.cells ? jipynb.content : jipynb)
      })
      reader.readAsText(file)
    }
  }

  if (status === StatusIdle) {
    return null
  }
  return (
    <div>
    {item === null && uploadedNotebook
      ? <Article ipynb={uploadedNotebook}/>
      : null
    }
    {item !== null && !!item.last_modified && (
      <div className="Notebook_last_modified p-2 bg-primary rounded" style={{
        position: 'fixed',
        bottom: 'var(--spacer-2)',
        right: 'var(--spacer-2)',
      }}>
        {t('dates.precise', { date: new Date(item.last_modified) })}
      </div>
    )}
    {item !== null && <Article ipynb={item.content ? item.content : item} url={url}/>}
    {status === StatusNone && (
        <Container className="mt-5">
          <Row>
            <Col {...BootstrapColumLayout}>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Public notebook url</Form.Label>
                  <Form.Control
                    value={value || ''}
                    onChange={(e) => setValue(e.target.value)}
                    type="url"
                    placeholder="https://"
                  />
                  <Form.Text className="text-muted">
                    Load your rendered ipytn notebook!
                  </Form.Text>
                </Form.Group>
                <Button onClick={handleSubmit} block variant="primary" type="submit">try notebook!</Button>
                <Form.Text className="text-muted">
                  Or use our example POC
                </Form.Text>
                <Button
                  onClick={() => setValue('https://raw.githubusercontent.com/C2DH/jdh-notebook/master/poc.ipynb')}
                  variant="secondary"
                >try notebook!
                </Button>

                  <Form.File
                    id="custom-file"
                    onChange={handleNotebookUpload}
                    label="Upload notebook"
                    custom
                  />
              </Form>
            </Col>
          </Row>
        </Container>
      )
    }
  </div>
  )
}

export default Notebook
