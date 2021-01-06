import React from 'react'
import {groupBy} from 'lodash'
import ArticleText from '../components/Article'
import ArticleHeader from '../components/Article/ArticleHeader'
import ArticleBilbiography from '../components/Article/ArticleBibliography'
import source from '../data/mock-ipynb.nbconvert.json'
import { getArticleTreeFromIpynb } from '../logic/ipynb'


const Article = ({ ipynb }) => {
  // const { t } = useTranslation()
  const articleTree = getArticleTreeFromIpynb({
    cells: ipynb? ipynb.cells : source.cells,
    metadata: ipynb? ipynb.metadata : source.metadata
  })
  const sections = groupBy(articleTree.paragraphs, ({ metadata }) => metadata?.jdh?.section ?? 'contents')
  const { title, abstract, keywords, contributor, contents } = sections
  return (
    <div className="page mt-5">
      <ArticleHeader {... {title, abstract, keywords, contributor}}/>
      <ArticleText articleTree={articleTree} contents={contents}/>
      <ArticleBilbiography articleTree={articleTree} />
    </div>
  );
}

export default Article
