import React, { useState } from 'react'
import ArticleText from '../components/Article'
import ArticleHeader from '../components/Article/ArticleHeader'
import ArticleBilbiography from '../components/Article/ArticleBibliography'
import ArticleNote from '../components/Article/ArticleNote'
import ArticleTextShadow from '../components/Article/ArticleTextShadow'
import ArticleStream from '../components/Article/ArticleStream'
import source from '../data/mock-ipynb.nbconvert.json'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import { useCurrentWindowDimensions } from '../hooks/graphics'
import { LayerNarrativeStep, LayerNarrative, DisplayLayerHermeneutics, DisplayLayerNarrative } from '../constants'

const Article = ({ ipynb, url, publicationDate = new Date(), doi }) => {
  // const { layer = LayerNarrative } = useParams() // hermeneutics, hermeneutics+data, narrative
  const [selectedDataHref, setSelectedDataHref] = useState(null)
  const articleTree = useIpynbNotebookParagraphs({
    id: url,
    cells: ipynb? ipynb.cells : source.cells,
    metadata: ipynb? ipynb.metadata : source.metadata
  })
  const { title, abstract, keywords, contributor, disclaimer = [] } = articleTree.sections
  const { height, width } =  useCurrentWindowDimensions()
  return (
    <>
    <ArticleTextShadow
      doi={doi}
      publicationDate={publicationDate}
      title={title}
      height={height}
      width={width}
    >
      <ArticleStream
        memoid={articleTree.id}
        cells={articleTree.paragraphs}
        shadowLayers={[LayerNarrativeStep, LayerNarrative]}
        onDataHrefClick={(d) => setSelectedDataHref(d)}
        anchorPrefix={DisplayLayerHermeneutics}
      />
    </ArticleTextShadow>
    <div className="page mt-5">
      <a id="top" className="anchor"></a>
      <ArticleHeader {... {title, abstract, keywords, contributor, publicationDate, url, disclaimer }} />
      <ArticleText
        memoid={articleTree.id}
        headingsPositions={articleTree.headingsPositions}
        paragraphs={articleTree.paragraphs}
        paragraphsPositions={articleTree.paragraphsPositions}
        onDataHrefClick={(d) => setSelectedDataHref(d)}
        height={height}
        width={width}
        anchorPrefix={DisplayLayerNarrative}
        {... {title, abstract, keywords, contributor, publicationDate, url, disclaimer }}
      />
      {articleTree.citationsFromMetadata
        ? <ArticleNote articleTree={articleTree} selectedDataHref={selectedDataHref}/>
        : null
      }
      {articleTree?.bibliography
        ? (<ArticleBilbiography articleTree={articleTree} />)
        : null
      }
    </div>
    </>
  );
}

export default React.memo(Article, (nextProps, prevProps) => {
  if (nextProps.memoid === prevProps.memoid) {
    return true
  }
  return false
})
