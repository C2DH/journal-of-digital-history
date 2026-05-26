import { useMatomo } from '@jonkoops/matomo-tracker-react'
import React, { useEffect, useRef } from 'react'

import { useArticleThebe } from './ArticleThebeProvider'
import ArticleThebeSessionButton, {
  StatusReady,
  StatusIdle,
  StatusPreparing,
  StatusError
} from './ArticleThebeSessionButton'
import { useExecutionScope } from './ExecutionScope'
import {
  getMatomoArticleV3KernelStatusAction,
  MatomoActionLaunchKernelClick,
  MatomoActionRestartKernelClick,
  MatomoActionRunAllCellsClick,
  MatomoActionStopKernelClick,
  MatomoCategoryArticleV3,
} from '../../constants/matomoEvents'

const ArticleThebeSession = ({ debug = false, kernelName }) => {
  const { starting, ready, connectAndStart, shutdown, restart, session, connectionErrors } = useArticleThebe()
  const { trackEvent } = useMatomo()
  const executeAll = useExecutionScope((state) => state.executeAll)
  const attachSession = useExecutionScope((state) => state.attachSession)
  const previousStatusRef = useRef(null)
  let status = StatusIdle

  if(connectionErrors) {
    status = StatusError
  } else if (ready) {
    status = StatusReady
  } else if (starting) {
    status = StatusPreparing
  }

  useEffect(() => {
    if (ready) attachSession(session)
  }, [ready])

  useEffect(() => {
    if (previousStatusRef.current === status) return

    previousStatusRef.current = status
    // Track each kernel status transition (idle → preparing → ready / error).
    trackEvent({
      category: MatomoCategoryArticleV3,
      action: getMatomoArticleV3KernelStatusAction(status),
      name: String(kernelName || 'unknown'),
    })
  }, [kernelName, status, trackEvent])

  const handleRunAllClick = () => {
    // Track when the user triggers execution of all notebook cells at once.
    trackEvent({
      category: MatomoCategoryArticleV3,
      action: MatomoActionRunAllCellsClick,
      name: String(kernelName || 'unknown'),
    })
    executeAll()
  }

  const handleSession = () => {
    switch (status) {
      case StatusIdle:
        // Track when the user starts the kernel for the first time.
        trackEvent({
          category: MatomoCategoryArticleV3,
          action: MatomoActionLaunchKernelClick,
          name: String(kernelName || 'unknown'),
        });
        connectAndStart();
        break;
      
      case StatusPreparing:
        // Track when the user cancels the kernel while it is still starting.
        trackEvent({
          category: MatomoCategoryArticleV3,
          action: MatomoActionStopKernelClick,
          name: String(kernelName || 'unknown'),
        });
        shutdown();
        break;

      case StatusReady:
        // Track when the user restarts an already running kernel.
        trackEvent({
          category: MatomoCategoryArticleV3,
          action: MatomoActionRestartKernelClick,
          name: String(kernelName || 'unknown'),
        });
        restart();
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
        <button className="btn btn-sm btn-outline-secondary" onClick={handleRunAllClick}>
          run all cells!
        </button>
      )}
    </div>
  )
}

export default ArticleThebeSession
