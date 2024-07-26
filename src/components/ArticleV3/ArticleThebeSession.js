import React, { useEffect } from 'react'
import { useArticleThebe } from './ArticleThebeProvider'
import ArticleThebeSessionButton, {
  StatusReady,
  StatusIdle,
  StatusPreparing,
} from './ArticleThebeSessionButton'
import { useExecutionScope } from './ExecutionScope'

const ArticleThebeSession = ({ debug = false, kernelName }) => {
  const { starting, ready, connectAndStart, shutdown, restart, session } = useArticleThebe()
  const executeAll = useExecutionScope((state) => state.executeAll)
  const attachSession = useExecutionScope((state) => state.attachSession)
  let status = StatusIdle

  if (ready) {
    status = StatusReady
  } else if (starting) {
    status = StatusPreparing
  }

  useEffect(() => {
    if (ready) attachSession(session)
  }, [ready])

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
    <div className="ArticleThebeSession p-2">
      <ArticleThebeSessionButton
        status={status}
        onClick={handleSession}
        debug={debug}
        kernelName={kernelName}
      />
      {status === StatusReady && (
        <button className="btn btn-sm btn-outline-secondary" onClick={executeAll}>
          run all cells!
        </button>
      )}
    </div>
  )
}

export default ArticleThebeSession
