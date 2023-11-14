import React from 'react'
export function ExampleErrorTray({ error }) {
  const [show, setShow] = React.useState(!!error)
  if (!show) return null
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        left: 10,
        width: 400,
        height: 600,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: 12,
      }}
    >
      <button onClick={() => setShow(false)}>dismiss</button>
      <div
        style={{
          marginTop: 12,
          color: 'red',
          overflow: 'auto',
          height: '100%',
          flexGrow: 1,
        }}
      >
        {error}
      </div>
    </div>
  )
}
