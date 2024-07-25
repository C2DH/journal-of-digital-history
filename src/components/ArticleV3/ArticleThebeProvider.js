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

export const ArticleThebeProvider = ({ url = '', kernelName, binderUrl, children }) => {
  // binder is available in the environment, and the environment is not production
  const shouldUseBinder =
    process.env.NODE_ENV === 'production' || process.env.REACT_APP_THEBE_DEV_BINDER === 'true'

  console.info(
    '[ArticleThebeProvider] ',
    '\n - NODE_ENV:',
    process.env.NODE_ENV,
    '\n - REACT_APP_THEBE_DEV_BINDER',
    process.env.REACT_APP_THEBE_DEV_BINDER,
    '\n - REACT_APP_THEBE_TOKEN',
    process.env.REACT_APP_THEBE_TOKEN,
    '\n - REACT_APP_THEBE_BINDER_URL',
    process.env.REACT_APP_THEBE_BINDER_URL,
    '\n - REACT_APP_THEBE_JUPYTER_URL',
    process.env.REACT_APP_THEBE_JUPYTER_URL,
    '\n - should use binder:',
    shouldUseBinder,
  )

  const options = useMemo(() => {
    const { repo, path } = getRepoSpec(url, binderUrl)
    const kernelOptions = {
      // IMPORTANT: path will default to '/' based on this filename, if notebooks are not in the root folder, this being set to the correct path is very important
      // as the notebook needs to be run from the correct relative location in order for relative file paths, imports, etc... to work correctly. This is working
      // when url is used in preview notebook, but when the binderUrl is used will the path be included in the binderUrl??
      //
      // Also jupyter has the model of 1-notebook <=> 1-session/kernel, using the same path value for different for all notebooks is recommended will
      // result in the same session being used on a single server for each reconnect using the path derived from the url if you want to use a different session
      // for each page visit by the same user, you can use a unique path during each load
      // path: path ?? '/jdh-thebe-article.ipynb',
      // kernelName - options here are to leave this undefined, so that the default session for the environment is used (e.g. python3) or to specify a kernel name
      // based on the notebook metadata, e.g. kernelName: 'python3' this will cause issues **if** the kernel name for the notebook is not installed on the server
      // or if there are slight variations in the kernel name, e.g. python3.7 vs python3.8
      // NOTE: for non- python kernels
      // kernelName: 'IR', // TODO: get the appropriate kernel name from the notebook metadata
    }
    if (kernelName) {
      kernelOptions.kernelName = kernelName
    }
    console.info(
      '[ArticleThebeProvider] \n - binderUrl:',
      binderUrl,
      '\n - url:',
      url,
      '\n - kernelOptions:',
      kernelOptions,
      '\n - thebe info:',
      { repo, path },
    )

    if (shouldUseBinder) {
      // documentation for binder options
      // https://thebe.readthedocs.io/en/stable/config_reference.html
      return {
        binderOptions: {
          binderUrl: process.env.REACT_APP_THEBE_BINDER_URL,
          repo,
          ref: undefined, // option ref / branch name (default: HEAD)
        },
        kernelOptions,
      }
    } else {
      return {
        serverSettings: {
          baseUrl: process.env.REACT_APP_THEBE_JUPYTER_URL,
          token: process.env.REACT_APP_THEBE_TOKEN,
        },
        kernelOptions,
      }
    }
  }, [shouldUseBinder, url, binderUrl])

  return (
    <ThebeLoaderProvider start>
      <ThebeServerProvider useBinder={shouldUseBinder} connect={false} options={options}>
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
  const { server, disconnect } = useThebeServer()
  const {
    starting,
    error: sessionError,
    ready: sessionReady,
    start,
    session,
    shutdown: shutdownSession,
  } = useThebeSession()

  const shutdown = async () => {
    await shutdownSession?.()
    await disconnect?.()
  }

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
    shutdown,
  }
}
