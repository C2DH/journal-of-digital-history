import React, { useMemo } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumLayout } from '../../constants/globalConstants'

import { Cite } from '@citation-js/core'
import '@citation-js/plugin-csl'

const ArticleNote = ({ articleTree, selectedDataHref }) => {
  const refId = selectedDataHref?.dataHref
  const note = useMemo(() => {
    const citation = articleTree.citationsFromMetadata[refId]
    // console.info('ArticleNote citation:', citation)
    const citationInstance = new Cite(citation)

    return citationInstance
      .format('bibliography', {
        template: 'apa',
        format: 'html',
      })
      .replace(
        /(https?:\/\/[0-9a-zA-Z-./_:?=]+)([^0-9a-zA-Z-./]+)/g,
        (m, link, r) => `<a href="${link}" target="_blank">${link}</a>${r}`,
      )
  }, [refId, articleTree.citationsFromMetadata])

  return (
    <div className={`ArticleNote ${refId ? 'active' : ''}`}>
      <Container className="pt-3">
        <Row>
          <Col {...BootstrapColumLayout}>
            {note !== null && <p dangerouslySetInnerHTML={{ __html: note }} />}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ArticleNote
