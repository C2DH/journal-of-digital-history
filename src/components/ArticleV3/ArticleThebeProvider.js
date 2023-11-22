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
    const u = new URL(binderUrl)
    const repoPathname = u.pathname.split('/v2/gh/')[1]
    const [, username, repo, ref, ...path] = repoPathname.split('/')
    // NOTE: most binder launch urls will not contain the path to the notebook!
    return { repo: `${username}/${repo}/${ref}`, path }
  } else {
    if (!url.startsWith('/proxy-githubusercontent')) throw new Error('invalid url')
    // eslint-disable-next-line no-unused-vars
    const [, username, repo, ref, ...path] = url.split('/proxy-githubusercontent')[1].split('/')
    return {
      repo: `${username}/${repo}`,
      path: `/${path.join('/')}`,
    }
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
    const { repo, path } = getRepoSpec(url, binderUrl)
    console.log('[ArticleThebeProvider]', { repo, path })
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
          // IMPORTANT: path will default to '/' based on this filename, if notebooks are not in the root folder, this being set to the correct path is very important
          // as the notebook needs to be run from the correct relative location in order for relative file paths, imports, etc... to work correctly. This is working
          // when url is used in preview notebook, but when the binderUrl is used will the path be included in the binderUrl??
          //
          // Also jupyter has the model of 1-notebook <=> 1-session/kernel, using the same path value for different for all notebooks is recommended will
          // result in the same session being used on a single server for each reconnect using the path derived from the url if you want to use a different session
          // for each page visit by the same user, you can use a unique path during each load
          path: path ?? '/jdh-thebe-article.ipynb',
          // kernelName - options here are to leave this undefined, so that the default session for the environment is used (e.g. python3) or to specify a kernel name
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
  const { server } = useThebeServer()
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
    openInJupyter: (notebook) => {
      if (server && server.userServerUrl) {
        let url = server.userServerUrl
        if (notebook) {
          const [path, query] = url.split('?')
          url = `${path}lab/tree/${notebook}?${query}`
        }
        console.log(url)
        window.open(url, '_blank', 'noopener noreferrer')
      } else console.warn('[useArticleThebe]', 'server.userServerUrl not available')
    },
  }
}
