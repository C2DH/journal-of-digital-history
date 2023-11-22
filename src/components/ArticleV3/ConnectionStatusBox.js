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
      style={{
        position: 'relative',
        fontSize: 12,
        border: '1px solid lightgreen',
        cursor: 'pointer',
        minHeight: '1.6em',
        backgroundColor: 'white',
      }}
      onClick={() => setOpen((o) => !o)}
    >
      <div
        style={{
          position: 'absolute',
          padding: '2px 4px',
          color: 'black',
          backgroundColor: 'lightgreen',
          fontSize: 10,
          width: 90,
        }}
      >
        connection status
      </div>
      {open && (
        <pre
          style={{
            marginTop: '2em',
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {status}
        </pre>
      )}
      {!open && (
        <span style={{ display: 'inline-block', marginLeft: 100, height: '1.5em' }}>
          {lastStatus}
        </span>
      )}
    </div>
  )
}
