import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import { useStore } from '../store'
import ArticleText from '../components/Article'
import ArticleHeader from '../components/Article/ArticleHeader'
import ArticleBilbiography from '../components/Article/ArticleBibliography'
import ArticleNote from '../components/Article/ArticleNote'
import source from '../data/mock-ipynb.nbconvert.json'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import { LayerNarrative } from '../constants'


const Article = ({ ipynb, url, publicationDate = new Date() }) => {
  const { layer = LayerNarrative } = useParams() // hermeneutics, hermeneutics+data, narrative
  const [selectedDataHref, setSelectedDataHref] = useState(null)
  const { articleTree, paragraphs, sections } = useIpynbNotebookParagraphs({
    cells: ipynb? ipynb.cells : source.cells,
    metadata: ipynb? ipynb.metadata : source.metadata
  })
  const { title, abstract, keywords, contributor, disclaimer = [] } = sections

  useEffect(() => {
    useStore.setState({ backgroundColor: 'var(--gray-100)' });
  }, [])

  return (
    <div className="page mt-5">
      <ArticleHeader {... {title, abstract, keywords, contributor, publicationDate, url, disclaimer }} />
      <ArticleText layer={layer}
        headingsPositions={articleTree.headingsPositions}
        paragraphs={paragraphs}
        paragraphsPositions={paragraphs.map(d => d.idx)}
        onDataHrefClick={(d) => setSelectedDataHref(d)}
      />
      <ArticleNote articleTree={articleTree} selectedDataHref={selectedDataHref}/>
      {articleTree?.bibliography
        ? (<ArticleBilbiography articleTree={articleTree} />)
        : null
      }

    </div>
  );
}

export default Article
