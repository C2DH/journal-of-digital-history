import React, { useMemo, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import {groupBy} from 'lodash'
import { useStore } from '../store'
import ArticleText from '../components/Article'
import ArticleHeader from '../components/Article/ArticleHeader'
import ArticleBilbiography from '../components/Article/ArticleBibliography'
import source from '../data/mock-ipynb.nbconvert.json'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import { LayerHermeneutics, LayerNarrative, LayerData, LayerFigure } from '../constants'


const Article = ({ ipynb, url, publicationDate = new Date() }) => {
  const { layer = LayerNarrative } = useParams() // hermeneutics, hermeneutics+data, narrative
  const articleTree = useMemo(() => getArticleTreeFromIpynb({
    cells: ipynb? ipynb.cells : source.cells,
    metadata: ipynb? ipynb.metadata : source.metadata
  }), [ipynb])
  const paragraphs = articleTree.paragraphs.filter((d) => [
    LayerHermeneutics, LayerNarrative, LayerData, LayerFigure
  ].includes(d.layer))
  const sections = groupBy(articleTree.paragraphs, 'section')
  const { title, abstract, keywords, contributor } = sections
  // let contents = paragraphs
  let backgroundColor = 'var(--gray-100)'
  // if (layer === LayerHermeneutics) {
  //   contents = paragraphs.filter(({ layer }) => layer === LayerHermeneutics)
  //   backgroundColor = 'var(--gray-300)'
  // } else if (layer === LayerHermeneuticsData) {
  //   contents = paragraphs.filter(({ layer }) => [
  //     LayerHermeneutics, LayerHermeneuticsData, LayerData
  //   ].includes(layer))
  //   backgroundColor = 'var(--gray-200)'
  // } else {
  //   // layer param not specified, default for "narrative" and "data"
  //   contents = paragraphs.filter(({ layer }) => [
  //     LayerNarrative, LayerFigure, LayerData
  //   ].includes(layer))
  // }

  useEffect(() => {
    useStore.setState({ backgroundColor });
  })

  return (
    <div className="page mt-5">
      <ArticleHeader {... {title, abstract, keywords, contributor, publicationDate, url }}/>
      <ArticleText layer={layer} articleTree={articleTree} contents={paragraphs}/>
      {articleTree?.bibliography
        ? (<ArticleBilbiography articleTree={articleTree} />)
        : null
      }
    </div>
  );
}

export default Article
