import React from 'react'
// import { useTranslation } from 'react-i18next'
import ArticleText from '../components/ArticleText'
import ArticleHeader from '../components/ArticleHeader'
import source from '../data/mock-ipynb.nbconvert.json'

export default function Article(){
  // const { t } = useTranslation()
  return (
    <div>
      <ArticleHeader />
      <ArticleText metadata={source?.metadata } paragraphs={source?.cells}/>
    </div>
  );
}
