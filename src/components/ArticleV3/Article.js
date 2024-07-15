import React, { useEffect } from 'react'

import { ArticleThebeProvider, useArticleThebe } from './ArticleThebeProvider'
import SimpleArticleCell from './ArticleCell'
import ArticleLayers from './ArticleLayers'
import { useNotebook } from '../../hooks/ipynbV3'
import ConnectionErrorBox from './ConnectionErrorBox'

import ArticleExecuteToolbar from './ArticleExecuteToolbar'
import { useExecutionScope } from './ExecutionScope'
import ArticleHeader from '../Article/ArticleHeader'
import Footer from '../Footer'
import ArticleBibliography from '../Article/ArticleBibliography'
import { CellTypeCode, LayerData } from '../../constants'

import '../../styles/components/ArticleV3/Article.scss'
import ArticleCellObserver from './ArticleCellObserver'
import ArticleToC from './ArticleToC'
import './Article.css'
import { WithWindowSize } from '../../hooks/windowSize'

const Article = ({
  url = '',
  publicationDate = new Date(),
  publicationStatus,
  issue,
  doi,
  binderUrl,
  repositoryUrl,
  dataverseUrl,
  bibjson,
  isJavascriptTrusted = false,
  // used to remove publication info from ArticleHeader
  ignorePublicationStatus = false,
  // layers, if any. See ArticleFlow component.
  layers,
  // a translatable string that defines the article header if ignorePublicationStatus is true
  category,
  paragraphs = [],
  headingsPositions = [],
  bibliography,
  title,
  abstract,
  keywords,
  contributor,
  collaborators,
  disclaimer = [],
}) => {
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
    <div className="Article page">
      <ArticleLayers layers={layers} />

      <ArticleToC paragraphs={paragraphs} headingsPositions={headingsPositions} />

      <ArticleExecuteToolbar
        starting={starting}
        ready={ready}
        connectAndStart={connectAndStart}
        restart={restart}
        openInJupyter={openInJupyter}
      />

      <ConnectionErrorBox />

      <ArticleHeader
        className="page mt-2 pb-0"
        title={title}
        abstract={abstract}
        keywords={keywords}
        collaborators={collaborators}
        contributor={contributor}
        publicationDate={publicationDate}
        url={url}
        repositoryUrl={repositoryUrl}
        dataverseUrl={dataverseUrl}
        binderUrl={binderUrl}
        disclaimer={disclaimer}
        publicationStatus={publicationStatus}
        ignorePublicationStatus={ignorePublicationStatus}
        category={category}
        issue={issue}
        doi={doi}
        bibjson={bibjson}
        isPreview={false}
      />

      {paragraphs.map((cell, idx) => {
        return (
          <ArticleCellObserver cell={cell} key={[url, idx].join('-')}>
            <a className="Article_anchor"></a>
            <div
              className="Article_paragraphWrapper"
              data-cell-idx={cell.idx}
              data-cell-layer={cell.layer}
            >
              <div className="ArticleStream_paragraph">
                <div className={`Article_cellActive off`} />
                <SimpleArticleCell
                  isJavascriptTrusted={isJavascriptTrusted}
                  onNumClick={() => ({})}
                  memoid={[url, idx].join('-')}
                  {...cell}
                  num={cell.num}
                  idx={cell.idx}
                  role={cell.role}
                  layer={cell.type !== CellTypeCode ? cell.layer : LayerData}
                  source={cell.source}
                  headingLevel={cell.isHeading ? cell.heading.level : 0}
                  windowHeight={800}
                  ready={ready}
                />
              </div>
            </div>
          </ArticleCellObserver>
        )
      })}

      <ArticleBibliography articleTree={{ bibliography }} noAnchor className="mt-0" />
      <Footer />
    </div>
  )
}

function ArticleWithContent({ url, ipynb, ...props }) {
  const { paragraphs, headingsPositions, executables, bibliography, sections } = useNotebook(
    url,
    ipynb,
  )
  const initExecutionScope = useExecutionScope((state) => state.initialise)

  useEffect(() => {
    initExecutionScope(executables)
  }, [executables, initExecutionScope])
  console.debug('[ArticleWithContent]', url, 'is rendering', headingsPositions)
  return (
    <Article
      url={url}
      paragraphs={paragraphs}
      headingsPositions={headingsPositions}
      bibliography={bibliography}
      {...sections}
      {...props}
    />
  )
}

function ThebeArticle({ url = '', ipynb = { cells: [], metadata: {} }, ...props }) {
  return (
    <ArticleThebeProvider url={url} binderUrl={props.binderUrl}>
      <WithWindowSize>
        <ArticleWithContent url={url} ipynb={ipynb} {...props} />
      </WithWindowSize>
    </ArticleThebeProvider>
  )
}

export default React.memo(ThebeArticle, (prevProps, nextProps) => {
  return prevProps.memoid === nextProps.memoid
})
