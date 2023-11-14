import React, { useMemo } from 'react'
import {
  ThebeLoaderProvider,
  ThebeServerProvider,
  ThebeRenderMimeRegistryProvider,
  ThebeSessionProvider,
  useThebeLoader,
  useThebeServer,
  useThebeSession,
} from 'thebe-react'

export const ArticleThebeProvider = ({ children }) => {
  const options = useMemo(() => {
    return {
      serverSettings: {
        baseUrl: 'http://localhost:8888',
        token: 'some-development-token',
      },
    }
  }, [])

  return (
    <ThebeLoaderProvider start>
      <ThebeServerProvider connect={false} options={options}>
        <ThebeRenderMimeRegistryProvider>
          <ThebeSessionProvider>{children}</ThebeSessionProvider>
        </ThebeRenderMimeRegistryProvider>
      </ThebeServerProvider>
    </ThebeLoaderProvider>
  )
}

export function useArticleThebe() {
  const { core } = useThebeLoader()
  const { connecting, error: serverError, ready: serverReady, server, connect } = useThebeServer()
  const { starting, error: sessionError, ready: sessionReady, start } = useThebeSession()

  return {
    starting: connecting || starting,
    ready: serverReady && sessionReady,
    error: serverError || sessionError,
    connectAndStart: async () => {
      if (!core) {
        console.warn('[useArticleThebe]', 'thebe-core not loaded.')
        return
      }
      return new Promise((resolve) => {
        connect() // TODO connect should return ready promise
        server.ready.then(async () => {
          await start()
          resolve()
        })
      })
    },
    restart: start,
  }
}
