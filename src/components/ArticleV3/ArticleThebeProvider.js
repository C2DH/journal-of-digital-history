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

// export const ArticleThebeContext = createContext({
//   connect: () => {},
//   disconnect: () => {},
// })

// export const ArticleThebeProvider = ({
//   children,
//   mode = 'local',
//   kernelOptions = { name: 'python 3' },
//   baseUrl = 'http://localhost:8888',
//   wsUrl = 'ws://localhost:8888',
//   token = 'shared-token',
// }) => {
//   const [config] = useState(() => {
//     const config = makeConfiguration({
//       kernelOptions,
//       serverSettings: {
//         baseUrl,
//         token, // : '2e277358a67c66a2250da49526803ae2a287f06eb84ad280',
//         wsUrl,
//       },
//     })
//     return config
//   })

//   const [statusEvent, setStatusEvent] = React.useState({ status: 'idle', message: '' })
//   const onErrorHandler = (event, d) => {
//     console.info('[ArticleV3] @handler', event, d)
//     setStatusEvent(() => ({
//       status: d.status,
//       message: d.message,
//     }))
//   }
//   const onStatusHandler = (e, d) => {
//     console.info('[ArticleV3] @handler', d)
//     setStatusEvent(() => ({
//       status: d.status,
//       message: d.message,
//     }))
//   }
//   useEffect(() => {
//     console.info('[ArticleV3] @useEffect addConfigurationListeners:', config)
//     config.events.on(ThebeEventType.error, onErrorHandler)
//     config.events.on(ThebeEventType.status, onStatusHandler)
//     return () => {
//       config.events.off(ThebeEventType.error, onErrorHandler)
//       config.events.off(ThebeEventType.status, onStatusHandler)
//     }
//   }, [])
//   // setup thebe server
//   return (
//     <ThebeLoaderProvider start>
//       {/* https://github.com/executablebooks/thebe/blob/main/packages/react/src/ThebeServerProvider.tsx */}
//       <ThebeServerProvider config={config}>
//         <div className="page">
//           Hey {mode}
//           <pre>{JSON.stringify(statusEvent, null, 2)}</pre>
//         </div>
//         <ArticleThebeContext.Provider
//           value={{
//             connect: () => {},
//             disconnect: () => {},
//           }}
//         >
//           {children}
//         </ArticleThebeContext.Provider>
//       </ThebeServerProvider>
//     </ThebeLoaderProvider>
//   )
// }

// export function useArticleThebe() {
//   const ctx = useContext(ArticleThebeContext)
//   if (ctx === undefined) {
//     throw new Error('useArticleThebe must be used inside a ArticleThebeProvider')
//   }
//   return {
//     connect: ctx.connect,
//     disconnect: ctx.disconnect,
//   }
// }
