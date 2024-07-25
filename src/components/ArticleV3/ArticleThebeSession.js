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

  if (debug)
    return (
      <div>
        <ArticleThebeSessionButton status={status} kernelName={kernelName} />
      </div>
    )
  return null
}

export default ArticleThebeSession
