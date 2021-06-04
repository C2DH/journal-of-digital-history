import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory, generatePath } from 'react-router'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../logic/api/fetchData'
import { decodeNotebookURL, encodeNotebookURL} from '../logic/ipynb'
import { BootstrapColumLayout, StatusNone, StatusSuccess, StatusFetching, StatusIdle } from '../constants'
import Article from './Article'
import FormNotebookUrl from '../components/Forms/FormNotebookUrl'
import Loading from '../components/Loading'

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
  const { data, error, status } = useGetJSON({ url, delay: 500})
  if(error) {
    console.error(error)
    return <div>Error</div>
  }
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

  if (status !== StatusSuccess) {
    return (
      <Container className="mt-5 page">
        <Row>
          <Col {...BootstrapColumLayout}>

          {status === StatusNone && (
              <>
              <h1>{t('Pages_NotebookViewer_Title')}</h1>
              <FormNotebookUrl onChange={handleNotebookUrlChange}/>
              </>
          )}
          {(status === StatusFetching || status === StatusIdle) && (
            <>
            <h1 className="my-5">{t('pages.loading.title')}</h1>
            <Loading />
            </>
          )}
          </Col>
        </Row>
      </Container>
    )
  }
  return (
    <div>
    {status === StatusSuccess
      ? <Article ipynb={data}/>
      : null
    }
    </div>
  )
}

export default NotebookViewer
