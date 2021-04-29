import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory, generatePath } from 'react-router'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetNotebookFromURL } from '../logic/api/fetchData'
import { decodeNotebookURL, encodeNotebookURL} from '../logic/ipynb'
import { BootstrapColumLayout, StatusNone, StatusSuccess } from '../constants'
import Article from './Article'
import FormNotebookUrl from '../components/Forms/FormNotebookUrl'


const NotebookViewer = () => {
  const { encodedUrl } = useParams()
  const { t, i18n } = useTranslation()
  const history = useHistory()
  const url = useMemo(() => {
    if (!encodedUrl || !encodedUrl.length) {
      return;
    }
    try{
      return decodeNotebookURL(encodedUrl)
    } catch(e) {
      console.warn(e)
    }
  }, [ encodedUrl ])
  const { status, item } = useGetNotebookFromURL(url)

  const handleNotebookUrlChange = ({ value, origin, proxyValue }) => {
    // trasnform given value
    if(proxyValue) {
      console.info('handleNotebookUrlChange using local proxy', proxyValue, encodeNotebookURL(proxyValue))
      history.push({
        pathname: generatePath("/:lang/notebook-viewer/:encodedUrl", {
          encodedUrl: encodeNotebookURL(proxyValue),
          lang: i18n.language.split('-')[0]
        })
      })
      // rewrite URL from
      // https://github.com/C2DH/jdh-notebook/blob/features/template/author_guideline_template.ipynb
      // to
      // https://raw.githubusercontent.com/C2DH/jdh-notebook/features/template/author_guideline_template.ipynb
      // /proxy-githubusercontent/C2DH/jdh-notebook/features/template/author_guideline_template.ipynb
    } else {
      console.info('handleNotebookUrlChange', value, encodeNotebookURL(value))
    }
  }

  console.info('Notebook render:', url ,'from', encodedUrl)

  if (status === StatusNone) {
    return (
      <Container className="mt-5 page">
        <Row>
          <Col {...BootstrapColumLayout}>
          <h1>{t('Pages_NotebookViewer_Title')}</h1>
            <FormNotebookUrl onChange={handleNotebookUrlChange}/>
          </Col>
        </Row>
      </Container>
    )
  }
  return (
    <div>
    {status === StatusSuccess
      ? <Article ipynb={item}/>
      : null
    }
    </div>
  )
}

export default NotebookViewer
