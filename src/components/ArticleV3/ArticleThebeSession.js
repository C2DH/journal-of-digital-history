import React from 'react'
import { useArticleThebe } from './ArticleThebeProvider'
import ArticleThebeSessionButton, {
  StatusReady,
  StatusIdle,
  StatusPreparing,
} from './ArticleThebeSessionButton'

const ArticleThebeSession = ({ debug = false, kernelName }) => {
  const { starting, ready, connectAndStart, shutdown, restart } = useArticleThebe()
  let status = StatusIdle

  if (ready) {
    status = StatusReady
  } else if (starting) {
    status = StatusPreparing
  }

  const handleSession = () => {
    if (status === StatusIdle) {
      connectAndStart()
    } else if (status === StatusPreparing) {
      shutdown()
    } else if (status === StatusReady) {
      restart()
    }
  }
  return (
    <div className="ArticleThebeSession ps-1">
      <ArticleThebeSessionButton
        status={status}
        onClick={handleSession}
        debug={debug}
        kernelName={kernelName}
      />
    </div>
  )
}

export default ArticleThebeSession
