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

function getRepoSpec(url, binderUrl) {
  if (binderUrl) {
    // TODO parse binderUrl
    return 'username/repo'
  } else {
    const [, username, repo] = url.split('/')
    return `${username}/${repo}`
  }
}

export const ArticleThebeProvider = ({ url = '', binderUrl, children }) => {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  console.log('process.env.REACT_APP_THEBE_DEV_BINDER', process.env.REACT_APP_THEBE_DEV_BINDER)
  console.log('process.env.REACT_APP_THEBE_DEV_TOKEN', process.env.REACT_APP_THEBE_DEV_TOKEN)
  console.log('URL', url)

  const binder =
    process.env.NODE_ENV !== 'production' && process.env.REACT_APP_THEBE_DEV_BINDER === true
  const options = useMemo(() => {
    const repo = getRepoSpec(url, binderUrl)
    if (binder) {
      return {
        binderSettings: {
          binderUrl: 'https://mybinder.org',
          repo,
          ref: undefined, // option ref / branch name (default: HEAD)
        },
      }
    } else {
      return {
        serverSettings: {
          baseUrl: 'http://localhost:8888',
          token: process.env.REACT_APP_THEBE_TOKEN,
        },
      }
    }
  }, [binder, url, binderUrl])

  return (
    <ThebeLoaderProvider start>
      <ThebeServerProvider useBinder={binder} connect={false} options={options}>
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
  const { starting, error: sessionError, ready: sessionReady, start, session } = useThebeSession()

  return {
    starting: connecting || starting,
    ready: serverReady && sessionReady,
    error: serverError || sessionError,
    session,
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
