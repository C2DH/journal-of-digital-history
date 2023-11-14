/* eslint-disable no-unused-vars */
import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { ArticleThebeProvider, useArticleThebe } from './ArticleThebeProvider'
import { BootstrapColumLayout, BootstrapMainColumnLayout } from '../../constants'
import SimpleArticleCell from './SimpleArticleCell'
import { useNotebook } from './hooks'

const Article = ({ mode = 'local', url = '', ipynb = { cells: [], metadata: {} }, ...props }) => {
  const { starting, error, ready, connectAndStart, restart } = useArticleThebe()
  const { paragraphs, notebook, executing, executeAll, executeSome, clear } = useNotebook(
    url,
    ipynb,
  )
  return (
    <Container>
      <div style={{ paddingTop: 150 }}></div>
      <Row>
        <Col {...BootstrapMainColumnLayout}>
          {!starting && !ready && (
            <button
              style={{ margin: '4px', color: 'green' }}
              disabled={starting || ready}
              onClick={connectAndStart}
            >
              Start
            </button>
          )}
          {starting && (
            <span style={{ display: 'inline-block', marginLeft: '4px' }}>Starting...</span>
          )}
          {error && (
            <span style={{ display: 'inline-block', marginLeft: '4px', color: 'red' }}>
              {error}
            </span>
          )}
          {ready && (
            <div
              style={{
                display: 'flex',
                marginLeft: 4,
                marginBottom: 12,
                padding: 4,
                backgroundColor: 'lightgreen',
                width: '100%',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {executing ? 'RUNNING...' : 'READY'}
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: '4px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'green',
                }}
              >
                {error}
              </span>
              <div style={{ flexGrow: 1 }} />
              <button
                onClick={() => {
                  clear()
                  executeAll()
                }}
                disabled={executing}
              >
                run all
              </button>
              <button onClick={clear} disabled={executing}>
                clear all
              </button>
              <button onClick={restart} disabled={executing}>
                restart
              </button>
            </div>
          )}
        </Col>
      </Row>
      {paragraphs.map((cell, idx) => {
        // QUESTION do paragraphs correspond directly to cells?
        const thebeCell = notebook?.cells[idx]
        return (
          <React.Fragment key={[url, idx].join('-')}>
            <a className="ArticleLayer_anchor"></a>
            <div
              className="ArticleLayer_paragraphWrapper"
              data-cell-idx={cell.idx}
              data-cell-layer={cell.layer}
            >
              <div className={`ArticleLayer_cellActive off`} />
              <SimpleArticleCell
                isJavascriptTrusted={false}
                onNumClick={() => ({})}
                memoid={[url, idx].join('-')}
                {...cell}
                num={cell.num}
                idx={cell.idx}
                role={cell.role}
                layer={cell.layer}
                headingLevel={cell.isHeading ? cell.heading.level : 0}
                windowHeight={800}
                thebeCell={thebeCell}
                executing={executing}
                executeCell={() => executeSome((c) => c.id === thebeCell.id)} // so that executing the cell ties into notebook busy state
              />
            </div>
          </React.Fragment>
        )
      })}
    </Container>
  )
}

function ThebeArticle({ children, ...props }) {
  return (
    <ArticleThebeProvider>
      <Article {...props}>{children}</Article>
    </ArticleThebeProvider>
  )
}

export default ThebeArticle
