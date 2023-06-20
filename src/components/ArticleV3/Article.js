import React from 'react'

import { ArticleThebeProvider } from './ArticleThebeProvider'

const Article = ({ mode = 'local' }) => {
  return <ArticleThebeProvider>test {mode}</ArticleThebeProvider>
}

export default Article
