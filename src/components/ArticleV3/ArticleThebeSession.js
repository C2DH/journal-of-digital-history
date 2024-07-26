import React from 'react'
import { useArticleThebe } from './ArticleThebeProvider'
import ArticleThebeSessionButton, {
  StatusReady,
  StatusIdle,
  StatusPreparing,
} from './ArticleThebeSessionButton'

const ArticleThebeSession = ({ debug = false, kernelName }) => {
  const { starting, ready } = useArticleThebe()
  let status = StatusIdle

  if (ready) {
    status = StatusReady
  } else if (starting) {
    status = StatusPreparing
  }

  return (
    <div className="ArticleThebeSession">
      <ArticleThebeSessionButton status={status} debug={debug} kernelName={kernelName} />
    </div>
  )
}

export default ArticleThebeSession
