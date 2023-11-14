/* eslint-disable no-unused-vars */
import React from 'react'
import { Container } from 'react-bootstrap'
import { ArticleThebeProvider, useArticleThebe } from './ArticleThebeProvider'
import SimpleArticleCell from './SimpleArticleCell'
import { useNotebook } from './hooks'
import { ExampleErrorTray } from './ExampleErrorTray'

const Article = ({ mode = 'local', url = '', ipynb = { cells: [], metadata: {} }, ...props }) => {
  const { starting, error, ready, connectAndStart, restart } = useArticleThebe()
  const { paragraphs, notebook, executing, executeAll, clear } = useNotebook(url, ipynb)
  return (
    <Container>
      <div style={{ paddingTop: 120 }}></div>
      <div style={{ position: 'sticky', top: 100, zIndex: 10 }}>
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
        {error && <ExampleErrorTray error={error} />}
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
      </div>
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
