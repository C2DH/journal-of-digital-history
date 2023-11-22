import React, { useCallback } from 'react'
import { useExecutionScope } from './ExecutionScope'
import ConnectionStatus from './ConnectionStatus'
import { useThebeLoader } from 'thebe-react'

export default function ArticleExecuteToolbar({
  starting,
  ready,
  connectAndStart,
  restart,
  openInJupyter,
}) {
  const { core } = useThebeLoader()
  const executing = useExecutionScope((state) => state.executing)
  const executeAll = useExecutionScope((state) => state.executeAll)
  const clearAll = useExecutionScope((state) => state.clearAll)
  const resetAll = useExecutionScope((state) => state.resetAll)

  const clearSavedSessions = useCallback(() => {
    if (!core) return
    core.clearAllSavedSessions()
    // Note: is is possible to clear the saved session only for this article
    // provided yo ucan supply the sotragePrefix and correct (repository) url
    // to core.clearSavedSession(storagePrefix, url)
  }, [core])

  console.log('[ArticleExecuteToolbar]', { starting, ready, executing }, 'rendering')

  return (
    <div style={{ position: 'sticky', top: 100, zIndex: 10, marginBottom: 12 }}>
      {!starting && !ready && (
        <>
          <button
            style={{ margin: '4px', color: 'green' }}
            disabled={starting || ready}
            onClick={connectAndStart}
          >
            Start
          </button>
          <button
            style={{ margin: '4px', color: 'green' }}
            disabled={starting || ready}
            onClick={clearSavedSessions}
            title="upon successful connection to binderhub the session connection information is saved in local storage. This button will clear that information and force new servers to be started."
          >
            Clear Saved Sessions
          </button>
        </>
      )}
      {starting && (
        <span
          style={{
            display: 'inline-block',
            marginLeft: '4px',
            padding: 4,
            width: '100%',
            backgroundColor: 'lightgreen',
          }}
        >
          Starting...
        </span>
      )}
      {ready && (
        <div
          style={{
            display: 'flex',
            padding: 4,
            backgroundColor: 'lightgreen',
            width: '100%',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {executing ? 'RUNNING...' : 'READY'}
          <div style={{ flexGrow: 1 }} />
          <button
            onClick={() => {
              clearAll()
              executeAll()
            }}
            disabled={executing}
          >
            run all
          </button>
          <button onClick={clearAll} disabled={executing}>
            clear all
          </button>
          <button onClick={resetAll} disabled={executing}>
            reset all
          </button>
          <button onClick={restart} disabled={executing}>
            restart kernel
          </button>
          {/* NOTE: feed notebook name in here if different */}
          <button onClick={() => openInJupyter('article.ipynb')} disabled={executing}>
            jupyter
          </button>
        </div>
      )}
      <ConnectionStatus />
    </div>
  )
}
