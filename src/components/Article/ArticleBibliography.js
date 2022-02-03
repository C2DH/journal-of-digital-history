import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { BootstrapColumLayout } from '../../constants'


const ArticleBilbiography = ({
  articleTree,
  noAnchor=false,
  className='mt-5'
}) => {
  const { t } = useTranslation()
  console.debug('[ArticleBilbiography] articleTree', articleTree, articleTree.bibliography)
  if (!articleTree.bibliography) {
    return null
  }
  return (
    <Container className={`ArticleBilbiography ${className}`}>
      <Row>
        <Col {...BootstrapColumLayout}>
          {noAnchor
            ? null
            : <div id="bibliography" className="anchor" />
          }
          <h2 >{t('bibliography')}</h2>
          <div dangerouslySetInnerHTML={{
            __html: articleTree
              .formatBibliograhpy()
              .replace(/(https?:\/\/[0-9a-zA-Z-./_:?=]+)([^0-9a-zA-Z-./]+)/g, (m, link, r) => `<a href="${link}" target="_blank">${link}</a>${r}`)
          }}/>
        </Col>
      </Row>
    </Container>
  )
}

export default ArticleBilbiography
