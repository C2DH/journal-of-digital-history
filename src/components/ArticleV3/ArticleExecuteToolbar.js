import React from 'react'
import { useExecutionScope } from './ExecutionScope'

export default function ArticleExecuteToolbar({ starting, ready, connectAndStart, restart }) {
  const executing = useExecutionScope((state) => state.executing)
  const executeAll = useExecutionScope((state) => state.executeAll)
  const clearAll = useExecutionScope((state) => state.clearAll)
  const resetAll = useExecutionScope((state) => state.resetAll)

  console.log('[ArticleExecuteToolbar]', { starting, ready, executing }, 'rendering')

  return (
    <div style={{ position: 'sticky', top: 100, zIndex: 10 }}>
      {!starting && !ready && (
        <button
          style={{ margin: '4px', color: 'green' }}
          disabled={starting || ready}
          onClick={connectAndStart}
        >
          Start
        </button>
      )}
      {starting && <span style={{ display: 'inline-block', marginLeft: '4px' }}>Starting...</span>}

      {ready && (
        <div
          style={{
            display: 'flex',
            marginLeft: 4,
            marginBottom: 12,
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
        </div>
      )}
    </div>
  )
}
