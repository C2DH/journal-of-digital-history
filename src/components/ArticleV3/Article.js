import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { ArticleThebeProvider, useArticleThebe } from './ArticleThebeProvider'
import SimpleArticleCell from './SimpleArticleCell'
import { useNotebook } from './hooks'
import ConnectionErrorBox from './ConnectionErrorBox'

import ArticleExecuteToolbar from './ArticleExecuteToolbar'
import { useExecutionScope } from './ExecutionScope'

const Article = ({ url = '', paragraphs }) => {
  const { starting, connectionErrors, ready, connectAndStart, restart, session, openInJupyter } =
    useArticleThebe()

  useEffect(() => {
    if (!connectionErrors) return
    // if there is a connection error, we want to ensure that the compute UI is
    // disabled or in an approprate state - set a disabled flag in the execution state?
  }, [connectionErrors])

  const attachSession = useExecutionScope((state) => state.attachSession)

  useEffect(() => {
    if (!ready) return
    attachSession(session)
  }, [ready])

  console.debug('[Article]', url, 'is rendering')

  return (
    <Container>
      <div style={{ paddingTop: 120 }}></div>

      <ArticleExecuteToolbar
        starting={starting}
        ready={ready}
        connectAndStart={connectAndStart}
        restart={restart}
        openInJupyter={openInJupyter}
      />
      <ConnectionErrorBox />
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
                source={cell.source}
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

function ArticleWithContent({ url, ipynb }) {
  const { paragraphs, executables } = useNotebook(url, ipynb)

  const initExecutionScope = useExecutionScope((state) => state.initialise)

  useEffect(() => {
    initExecutionScope(executables)
  }, [executables, initExecutionScope])

  return <Article url={url} paragraphs={paragraphs} />
}

function ThebeArticle({ url = '', ipynb = { cells: [], metadata: {} }, ...props }) {
  return (
    <ArticleThebeProvider url={url} binderUrl={props.binderUrl}>
      <ArticleWithContent url={url} ipynb={ipynb} />
    </ArticleThebeProvider>
  )
}

export default ThebeArticle
