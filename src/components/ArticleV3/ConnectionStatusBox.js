import React, { useState, useEffect } from 'react'
import { useArticleThebe } from './ArticleThebeProvider'

export default function ConnectionStatusBox() {
  const { starting, ready, connectionErrors, subscribe } = useArticleThebe()
  const [open, setOpen] = useState(false)
  const [lastStatus, setLastStatus] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!subscribe) return
    subscribe((data) => {
      setLastStatus(data.message)
      setStatus((s) => `${s}\n${data.message}`)
    })
  }, [subscribe])

  if (!starting && !ready && !connectionErrors) return null

  return (
    <div
      onClick={() => setOpen((o) => !o)}
    >
      {connectionErrors &&
        <pre style={{ display: 'inline-block', whiteSpace: 'pre-wrap', color: 'tomato' }}>
          {connectionErrors}
        </pre>
      }

      {open && (
        <pre
          style={{
            marginBottom: 0,
            maxHeight: 200,
            overflowY: 'auto',
            whiteSpace: 'pre-wrap'
          }}
        >
          {status}
        </pre>
      )}

      {!open && (
        <pre style={{ display: 'inline-block', whiteSpace: 'pre-wrap', color: starting ? 'orange' : ready ? 'lightgreen' : 'white' }}>
          {lastStatus}
        </pre>
      )}
    </div>
  )
}
