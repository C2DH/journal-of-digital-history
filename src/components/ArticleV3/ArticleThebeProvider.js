import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThebeEventType, makeConfiguration } from 'thebe-core'
import { ThebeLoaderProvider, ThebeServerProvider } from 'thebe-react'

export const ArticleThebeContext = createContext({
  connect: () => {},
  disconnect: () => {},
})

export const ArticleThebeProvider = ({
  children,
  mode = 'local',
  kernelOptions = { name: 'python 3' },
  baseUrl = 'http://localhost:8888',
  wsUrl = 'ws://localhost:8888',
  token = 'shared-token',
}) => {
  const [config] = useState(() => {
    const config = makeConfiguration({
      kernelOptions,
      serverSettings: {
        baseUrl,
        token, // : '2e277358a67c66a2250da49526803ae2a287f06eb84ad280',
        wsUrl,
      },
    })
    return config
  })

  const [statusEvent, setStatusEvent] = React.useState({ status: 'idle', message: '' })
  const onErrorHandler = (event, d) => {
    console.info('[ArticleV3] @handler', event, d)
    setStatusEvent(() => ({
      status: d.status,
      message: d.message,
    }))
  }
  const onStatusHandler = (e, d) => {
    console.info('[ArticleV3] @handler', d)
    setStatusEvent(() => ({
      status: d.status,
      message: d.message,
    }))
  }
  useEffect(() => {
    console.info('[ArticleV3] @useEffect addConfigurationListeners:', config)
    config.events.on(ThebeEventType.error, onErrorHandler)
    config.events.on(ThebeEventType.status, onStatusHandler)
    return () => {
      config.events.off(ThebeEventType.error, onErrorHandler)
      config.events.off(ThebeEventType.status, onStatusHandler)
    }
  }, [])
  // setup thebe server
  return (
    <ThebeLoaderProvider start>
      {/* https://github.com/executablebooks/thebe/blob/main/packages/react/src/ThebeServerProvider.tsx */}
      <ThebeServerProvider config={config}>
        <div className="page">
          Hey {mode}
          <pre>{JSON.stringify(statusEvent, null, 2)}</pre>
        </div>
        <ArticleThebeContext.Provider
          value={{
            connect: () => {},
            disconnect: () => {},
          }}
        >
          {children}
        </ArticleThebeContext.Provider>
      </ThebeServerProvider>
    </ThebeLoaderProvider>
  )
}

export function useArticleThebe() {
  const ctx = useContext(ArticleThebeContext)
  if (ctx === undefined) {
    throw new Error('useArticleThebe must be used inside a ArticleThebeProvider')
  }
  return {
    connect: ctx.connect,
    disconnect: ctx.disconnect,
  }
}
