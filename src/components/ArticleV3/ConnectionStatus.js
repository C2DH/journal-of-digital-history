import React, { useState, useEffect } from 'react'
import { useArticleThebe } from './ArticleThebeProvider'

export default function ConnectionStatus() {
  const { starting, ready, connectionErrors, subscribe } = useArticleThebe()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!subscribe) return
    subscribe((data) => {
      setStatus((s) => `${s}\n${data.message}`)
    })
  }, [subscribe])

  if (!starting && !ready && !connectionErrors) return null

  return (
    <div
      style={{
        position: 'relative',
        fontSize: 12,
        border: '1px solid lightgreen',
        cursor: 'pointer',
        minHeight: '1.6em',
      }}
      onClick={() => setOpen((o) => !o)}
    >
      <div
        style={{
          position: 'absolute',
          padding: '2px 4px',
          color: 'black',
          backgroundColor: 'lightgreen',
          fontSize: 8,
        }}
      >
        connection status
      </div>
      <pre
        style={{
          marginTop: '2em',
          maxHeight: 200,
          overflowY: 'auto',
          display: open ? 'block' : 'none',
        }}
      >
        {status}
      </pre>
    </div>
  )
}
