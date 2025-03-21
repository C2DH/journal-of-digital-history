import React from 'react'
import { useArticleThebe } from './ArticleThebeProvider'

export default function ConnectionErrorBox() {
  const { connectionErrors } = useArticleThebe()

  if (!connectionErrors) return null

  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid red',
        minHeight: '1.6em',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          position: 'absolute',
          padding: '1px 4px',
          color: 'white',
          backgroundColor: 'red',
          fontWeight: 500,
          fontSize: 10,
          width: 90,
        }}
      >
        connection error
      </div>
      <pre
        style={{
          marginTop: '2em',
          maxHeight: 200,
          overflowY: 'auto',
          color: 'darkred',
          padding: 4,
        }}
      >
        {connectionErrors}
      </pre>
    </div>
  )
}
