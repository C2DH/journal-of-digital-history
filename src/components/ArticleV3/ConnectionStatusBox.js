import React, { useState, useEffect } from 'react'
import { useArticleThebe } from './ArticleThebeProvider'
import './ConnectionStatusBox.css'
import { ArrowDown } from 'iconoir-react'

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
    <div className="ConnectionStatusBox w-100 ">
      <div className={`ConnectionStatusBox__messages ${connectionErrors ? 'error' : ''}`}>
        {starting && 'Starting...'}
        {ready && 'Ready'}
        {connectionErrors}
      </div>
      <div className="px-2 py-1">
        <button
          className="btn btn-sm btn-link-white  d-flex align-items-center"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'less details' : 'see full log'}
          <ArrowDown className="ms-2" width={12} height={12} />
        </button>
      </div>
      <div className="ConnectionStatusBox__messages px-2">
        {open ? (
          <pre
            style={{
              marginBottom: 0,
              maxHeight: 200,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {status}
          </pre>
        ) : (
          <pre
            style={{
              display: 'inline-block',
              whiteSpace: 'pre-wrap',
              color: starting ? 'orange' : ready ? 'lightgreen' : 'white',
            }}
          >
            {lastStatus}
          </pre>
        )}
      </div>
    </div>
  )
}
