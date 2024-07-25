import React from 'react'
import { useArticleThebe } from './ArticleThebeProvider'

const ArticleThebeSession = ({ debug = false }) => {
  const { starting, ready } = useArticleThebe()
  if (debug)
    return (
      <div>
        Hello session<pre>{JSON.stringify({ starting, ready })}</pre>{' '}
      </div>
    )
  return null
}

export default ArticleThebeSession
