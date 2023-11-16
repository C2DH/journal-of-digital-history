import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { ArticleThebeProvider, useArticleThebe } from './ArticleThebeProvider'
import SimpleArticleCell from './SimpleArticleCell'
import { useNotebook } from './hooks'
import ExampleErrorTray from './ExampleErrorTray'
import { useExecutionScope } from './ExecutionScope'

// const Article = ({ mode = 'local', url = '', ipynb = { cells: [], metadata: {} }, ...props }) => {
const Article = ({ url = '', ipynb = { cells: [], metadata: {} } }) => {
  const {
    starting,
    error: connectionError,
    ready,
    connectAndStart,
    restart,
    session,
  } = useArticleThebe()
  const { paragraphs, executables } = useNotebook(url, ipynb)

  const { executing, executeAll, clearAll, resetAll, initExecutionScope, attachSession } =
    useExecutionScope((state) => ({
      executing: state.executing,
      errors: state.errors,
      executeAll: state.executeAll,
      clearAll: state.clearAll,
      resetAll: state.resetAll,
      initExecutionScope: state.initialise,
      attachSession: state.attachSession,
    }))

  useEffect(() => {
    initExecutionScope(executables)
  }, [executables])

  useEffect(() => {
    if (!ready) return
    attachSession(session)
  }, [ready])

  return (
    <Container>
      <div style={{ paddingTop: 120 }}></div>
      {connectionError && <ExampleErrorTray error={connectionError} />}
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
                clearAll()
                executeAll()
              }}
              disabled={executing}
            >
              run all
            </button>
            <button onClick={clearAll} disabled={executing}>
              clear all
            </button>
            <button onClick={resetAll} disabled={executing}>
              reset all
            </button>
            <button onClick={restart} disabled={executing}>
              restart kernel
            </button>
          </div>
        )}
      </div>
      {paragraphs.map((cell, idx) => {
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
                ready={ready}
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
