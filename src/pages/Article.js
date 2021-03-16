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

  useEffect(() => {
    useStore.setState({ backgroundColor: 'var(--gray-100)' });
  }, [])

  return (
    <div className="page mt-5">
      <ArticleHeader {... {title, abstract, keywords, contributor, publicationDate, url }}/>
      <ArticleText layer={layer}
        headingsPositions={articleTree.headingsPositions}
        paragraphs={paragraphs}
        paragraphsPositions={paragraphs.map(d => d.idx)}/>
      {articleTree?.bibliography
        ? (<ArticleBilbiography articleTree={articleTree} />)
        : null
      }
    </div>
  );
}

export default Article
