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
    // example https://mybinder.org/v2/gh/executablebooks/thebe-binder-base/HEAD
    // Note: limited to 'github' repo provider
    const rx = '^https://([^/]+)/v2/gh/([^/]+)/([^/]+)/([^/]+)'
    const match = binderUrl.match(rx)
    if (!match) {
      console.error('[getRepoSpec]', `Invalid binderUrl: ${binderUrl}`)
      return
    }
    const [, , username, repo, ref] = match
    return `${username}/${repo}/${ref}`
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
    process.env.NODE_ENV !== 'production' && process.env.REACT_APP_THEBE_DEV_BINDER === 'true'
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
        kernelOptions: {
          // path will default to '/' based on this filename, if notebooks are not in the root folder, this needs to be set to the correct path for the notebook
          // using the same path for all notebooks is recommended will result in the same sesio being used on a single server for each reconnect
          // if you want to use a different session for each page visit by the same user, you can use a unique path during each load
          path: './jdh.ipynb',
          // options here are to leave this undefined, so that the default session for the environment is used (e.g. python3) or to specify a kernel name
          // based on the notebook metadata, e.g. kernelName: 'python3' this will cause issues **if** the kernel name for the notebook is not installed on the server
          // or if there are slight variations in the kernel name, e.g. python3.7 vs python3.8
          // kernelName: 'another-kernel',
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
  const {
    config,
    connecting,
    error: serverError,
    ready: serverReady,
    connect,
    subscribe,
    unsubAll,
  } = useThebeServer()
  const { starting, error: sessionError, ready: sessionReady, start, session } = useThebeSession()

  return {
    config,
    starting: connecting || starting,
    ready: serverReady && sessionReady,
    connectionErrors: serverError || sessionError,
    session,
    subscribe,
    unsubAll,
    connectAndStart: async () => {
      if (!core) {
        console.warn('[useArticleThebe]', 'thebe-core not loaded.')
        return
      }
      return new Promise((resolve) => {
        connect()
          .then(async () => {
            await start()
            resolve()
          })
          .catch(() => null)
      })
    },
    restart: start,
  }
}
