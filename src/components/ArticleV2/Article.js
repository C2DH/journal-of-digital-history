import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIpynbNotebookParagraphs } from '../../hooks/ipynb'
import { useCurrentWindowDimensions } from '../../hooks/graphics'
import ArticleHeader from '../Article/ArticleHeader'
import ArticleNote from '../Article/ArticleNote'
import ArticleFlow from './ArticleFlow'
import ArticleHelmet from './ArticleHelmet'
import ArticleBibliography from '../Article/ArticleBibliography'
import Footer from '../Footer'
import LangNavLink from '../LangNavLink'
import Logo from '../Logo'

const Article = ({
  memoid = '',
  isLocal = false,
  // pid,
  // Notebook instance, an object containing {cells:[], metadata:{}}
  ipynb,
  url,
  imageUrl,
  publicationDate = new Date(),
  publicationStatus,
  issue,
  plainTitle,
  plainContributor = '',
  plainKeywords = [],
  excerpt,
  doi,
  binderUrl,
  repositoryUrl,
  bibjson,
  emailAddress,
  isJavascriptTrusted = false,
  // used to remove publication info from ArticleHeader
  ignorePublicationStatus = false,
  // used to put page specific helmet in the parent component
  ignoreHelmet = false,
  // if it is defined, will override the style of the ArticleLayout pushFixed
  // header
  pageBackgroundColor,
  // layers, if any. See ArticleFlow component.
  layers,
  // a translatable string that defines the article header if ignorePublicationStatus is true
  category,
  // if false, binder url notice will be hidden
  ignoreBinder = false,
  // if true, force table of contetts to hide figures.
  hideFigures = false,
  // Children will be put right aftr the ArticleHeader.
  children,
}) => {
  const { t } = useTranslation()
  const [selectedDataHref, setSelectedDataHref] = useState(null)
  const { height, width } = useCurrentWindowDimensions()

  const articleTree = useIpynbNotebookParagraphs({
    id: memoid || url,
    cells: ipynb?.content?.cells ?? ipynb?.cells ?? [],
    metadata: ipynb?.content?.metadata ?? ipynb?.metadata ?? {},
  })
  const {
    title,
    abstract,
    keywords,
    contributor,
    collaborators,
    disclaimer = [],
  } = articleTree.sections

  console.debug(
    `[Article] component rendered. \n - size: ${width}x${height}px`,
    '\n - plainTitle:',
    plainTitle,
    '\n - memoid:',
    memoid,
    '\n - binderUrl:',
    binderUrl,
    '\n - anchors:',
    articleTree.anchors,
    '\n - n. paragraphs:',
    articleTree.paragraphs.length,
  )

  const onDataHrefClickHandler = (d) => {
    console.debug('DataHref click handler')
    setSelectedDataHref(d)
  }
  const renderedBibliographyComponent = (
    <ArticleBibliography articleTree={articleTree} noAnchor className="mt-0" />
  )
  const renderedFooterComponent = <Footer />
  const renderedLogoComponent = (
    <LangNavLink to="/" className="MobileHeaderBrand d-flex d-md-none position-absolute">
      <div style={{ width: 60 }}>
        <Logo color="var(--secondary)" size={35} />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: t('title') }}
        style={{ lineHeight: '18px', fontSize: '14px', marginTop: 2 }}
      ></div>
    </LangNavLink>
  )

  return (
    <>
      {!ignoreHelmet && (
        <ArticleHelmet
          url={url}
          imageUrl={imageUrl}
          plainTitle={plainTitle}
          plainContributor={plainContributor}
          plainKeywords={plainKeywords}
          publicationDate={publicationDate}
          issue={issue}
          excerpt={excerpt}
        />
      )}
      <div className="page">
        <a id="top" className="anchor"></a>
        <ArticleFlow
          layers={layers}
          memoid={isLocal ? ipynb.last_modified : memoid}
          height={height}
          width={width}
          paragraphs={articleTree.paragraphs}
          headingsPositions={articleTree.headingsPositions}
          hasBibliography={!!articleTree.bibliography}
          binderUrl={binderUrl}
          plainTitle={plainTitle}
          repositoryUrl={repositoryUrl}
          emailAddress={emailAddress}
          onDataHrefClick={onDataHrefClickHandler}
          isJavascriptTrusted={isJavascriptTrusted}
          articleTree={articleTree}
          pageBackgroundColor={pageBackgroundColor}
          ignoreBinder={ignoreBinder}
          renderedBibliographyComponent={renderedBibliographyComponent}
          renderedFooterComponent={renderedFooterComponent}
          renderedLogoComponent={renderedLogoComponent}
          hideFigures={hideFigures}
        >
          <ArticleHeader
            className="page mt-5 pb-0"
            title={title}
            abstract={abstract}
            keywords={keywords}
            collaborators={collaborators}
            contributor={contributor}
            publicationDate={publicationDate}
            url={url}
            disclaimer={disclaimer}
            publicationStatus={publicationStatus}
            ignorePublicationStatus={ignorePublicationStatus}
            category={category}
            issue={issue}
            doi={doi}
            bibjson={bibjson}
            isPreview={false}
          />
          {typeof children === 'function' ? children(articleTree) : children}
        </ArticleFlow>
        {articleTree.citationsFromMetadata ? (
          <ArticleNote articleTree={articleTree} selectedDataHref={selectedDataHref} />
        ) : null}
      </div>
    </>
  )
}

export default Article
