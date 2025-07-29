import { Suspense, useEffect } from 'react'
import ReactGA from 'react-ga'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import UniversalCookie from 'universal-cookie'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

import Cookies from './components/Cookies'
import Footer from './components/Footer'
import Header from './components/Header'
import PercentLoader from './components/PercentLoader'
import ScrollToTop from './components/ScrollToTop'
import VideoReleaseLazy from './components/VideoRelease/VideoReleaseLazy'
import { GaTrackingId, IsMobile, NotebookPoweredPaths } from './constants/globalConstants'
import CanonicalUpdater from './dashboard/utils/helpers/CanonicalUpdater'
import i18n from './i18next'
import { getStartLang, LANGUAGES } from './logic/language'
import Loading from './pages/Loading'

import { AcceptAnalyticsCookies, AcceptCookies } from './logic/tracking'

import Me from './components/Me'
import WindowEvents from './components/WindowEvents'
import { AppRoutes } from './routes'

console.info('\n   _   _ _   \n  | |_| | |_ \n  | | . |   |\n _| |___|_|_|\n|___|       \n\n')
console.info('%cacceptAnalyticsCookies', 'font-weight: bold', AcceptAnalyticsCookies)
console.info('%cacceptCookies', 'font-weight: bold', AcceptCookies)

// check if there CRFS cookie
const csrfToken = new UniversalCookie().get('csrftoken')
console.info('%ccsrftoken', 'font-weight: bold', csrfToken)

const { short, lng } = getStartLang()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      headers: {
        'X-CSRFToken': csrfToken,
      },
    },
  },
})

console.info('start language:', short, lng)
console.info('IsMobile:', IsMobile)

export default function App() {
  useEffect(() => {
    // integrate history \w Google Analytics
    if (GaTrackingId && AcceptAnalyticsCookies) {
      ReactGA.initialize(GaTrackingId)
      console.info('%cGA enabled by user choice', 'font-weight: bold', GaTrackingId)
    } else if (GaTrackingId) {
      console.info(
        '%cGA disabled by user choice:',
        'font-weight: bold',
        'AcceptAnalyticsCookies:',
        AcceptAnalyticsCookies,
      )
    } else {
      console.info('%cGA GaTrackingId not set', 'font-weight: bold', 'disabled by config.')
    }
  }, [])

  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <PercentLoader />
            <Header availableLanguages={LANGUAGES} isAuthDisabled />
            {typeof csrfToken === 'string' && <Me />}
            <Cookies defaultAcceptCookies={AcceptCookies} />
            <CanonicalUpdater />
            <main>
              <Suspense fallback={<Loading />} key={location.key}>
                <AppRoutes languagePath={short} />
              </Suspense>
            </main>
            <Footer hideOnRoutes={NotebookPoweredPaths} />
            <ScrollToTop />
            <WindowEvents />
            <VideoReleaseLazy isMobile={IsMobile} url={import.meta.env.VITE_WIKI_VIDEO_RELEASES} />
          </QueryParamProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </BrowserRouter>
  )
}
