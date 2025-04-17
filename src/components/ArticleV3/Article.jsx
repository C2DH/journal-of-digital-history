import React, { useEffect } from 'react'

import { ArticleThebeProvider } from './ArticleThebeProvider'
import ArticleCell from './ArticleCell'
import ArticleLayers from './ArticleLayers'
import { useNotebook } from '../../hooks/ipynbV3'
import { useExecutionScope } from './ExecutionScope'
import ArticleToC from './ArticleToC'
import ArticleCellObserver from './ArticleCellObserver'

import ArticleHeader from '../Article/ArticleHeader'
import Footer from '../Footer'
import ArticleBibliography from '../Article/ArticleBibliography'
import { CellTypeCode, DisplayLayerSectionBibliography, LayerData } from '../../constants'
import { WithWindowSize } from '../../hooks/windowSize'

import '../../styles/components/ArticleV3/Article.scss'
import './Article.css'
import ArticleScrollTo from './ArticleScrollTo'
import { useArticleStore } from '../../store'
import ArticleNoteManager from './ArticleNoteManager'

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
  // a translatable string that defines the article header if ignorePublicationStatus is true
  category,
  paragraphs = [],
  headingsPositions = [],
  bibliography,
  title,
  plainTitle,
  abstract,
  keywords,
  contributor,
  collaborators,
  disclaimer = [],
  kernelName, // null or IR for R
}) => {
  console.debug('[Article]', url, 'is rendering. \n - kernelName:', kernelName)
  const setSelectedCellIdx = useArticleStore((state) => state.setSelectedCellIdx)
  const setSelectedDataHref = useArticleStore((state) => state.setSelectedDataHref)

  const onNumClickHandler = (e, { idx }) => {
    console.debug('[Article] onNumClickHandler', idx)
    setSelectedCellIdx(idx)
  }

  const onCellClickHandler = (e) => {
    if (e.target.hasAttribute('data-href')) {
      const dataHref = e.target.getAttribute('data-href')
      console.info('[Article] onCellClickHandler', dataHref)
      setSelectedDataHref(dataHref)
    }

    if (e.target.hasAttribute('data-idx')) {
      e.preventDefault()
      setSelectedCellIdx(e.target.getAttribute('data-idx'))
    }
  }

  return (
    <div className="Article ArticleV3 page">
      <ArticleLayers />
      <ArticleScrollTo />
      <ArticleNoteManager bibliography={bibliography} />
      <ArticleToC
        plainTitle={plainTitle}
        paragraphs={paragraphs}
        kernelName={kernelName}
        hasBibliography={!!bibliography}
        headingsPositions={headingsPositions}
      />

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
                <ArticleCell
                  isJavascriptTrusted={isJavascriptTrusted}
                  onNumClick={onNumClickHandler}
                  onClick={onCellClickHandler}
                  memoid={[url, idx].join('-')}
                  {...cell}
                  num={cell.num}
                  idx={cell.idx}
                  role={cell.role}
                  layer={cell.type !== CellTypeCode ? cell.layer : LayerData}
                  source={cell.source}
                  headingLevel={cell.isHeading ? cell.heading.level : 0}
                  windowHeight={800}
                />
              </div>
            </div>
          </ArticleCellObserver>
        )
      })}

      <ArticleCellObserver
        style={{ minHeight: 200 }}
        cell={{
          idx: DisplayLayerSectionBibliography,
        }}
      >
        <div data-cell-idx={DisplayLayerSectionBibliography}>
          {bibliography ? (
            <ArticleBibliography articleTree={{ bibliography }} noAnchor className="mt-0" />
          ) : null}
        </div>
      </ArticleCellObserver>
      <Footer />
    </div>
  )
}

function ArticleWithContent({ url, ipynb, kernelName, ...props }) {
  const { paragraphs, headingsPositions, executables, bibliography, citations, sections } =
    useNotebook(url, ipynb)
  const initExecutionScope = useExecutionScope((state) => state.initialise)

  useEffect(() => {
    initExecutionScope(executables)
  }, [executables, initExecutionScope])
  console.debug('[ArticleWithContent]', url, 'is rendering', headingsPositions, citations)
  return (
    <Article
      url={url}
      kernelName={kernelName}
      paragraphs={paragraphs}
      headingsPositions={headingsPositions}
      bibliography={bibliography}
      {...sections}
      {...props}
    />
  )
}

function ThebeArticle({ url = '', ipynb = { cells: [], metadata: {} }, ...props }) {
  const kernelName = ipynb.metadata?.kernelspec?.name
  console.info('[ThebeArticle] \n - kernelName:', kernelName, '\n - metadata:', ipynb.metadata)
  return (
    <ArticleThebeProvider url={url} binderUrl={props.binderUrl} kernelName={kernelName}>
      <WithWindowSize>
        <ArticleWithContent url={url} ipynb={ipynb} kernelName={kernelName} {...props} />
      </WithWindowSize>
    </ArticleThebeProvider>
  )
}

export default React.memo(ThebeArticle, (prevProps, nextProps) => {
  return prevProps.memoid === nextProps.memoid
})
