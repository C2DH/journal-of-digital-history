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
import { useCurrentWindowDimensions }from '../hooks/graphics'

const Article = ({ ipynb, url, publicationDate = new Date() }) => {
  const { layer = LayerNarrative } = useParams() // hermeneutics, hermeneutics+data, narrative
  const [selectedDataHref, setSelectedDataHref] = useState(null)
  const articleTree = useIpynbNotebookParagraphs({
    cells: ipynb? ipynb.cells : source.cells,
    metadata: ipynb? ipynb.metadata : source.metadata
  })
  const { title, abstract, keywords, contributor, disclaimer = [] } = articleTree.sections
  // console.info('Article rendering', articleTree)
  useEffect(() => {
    useStore.setState({ backgroundColor: 'var(--gray-100)' });
    const script = document.createElement('script');
    script.src = "https://hypothes.is/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, [])
  const { height, width } =  useCurrentWindowDimensions()
  return (
    <div className="page mt-5">
      <ArticleHeader {... {title, abstract, keywords, contributor, publicationDate, url, disclaimer }} />
      <ArticleText layer={layer}
        headingsPositions={articleTree.headingsPositions}
        paragraphs={articleTree.paragraphs}
        paragraphsPositions={articleTree.paragraphsPositions}
        onDataHrefClick={(d) => setSelectedDataHref(d)}
        height={height}
        width={width}
        {... {title, abstract, keywords, contributor, publicationDate, url, disclaimer }}
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
