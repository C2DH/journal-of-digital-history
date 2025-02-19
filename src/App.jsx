import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import i18n from 'i18next'
import moment from 'moment'
import UniversalCookie from 'universal-cookie'
import { initReactI18next } from 'react-i18next'
import { getStartLang, LANGUAGE_PATH, LANGUAGES } from './logic/language'
import translations from './translations'
import { useStore } from './store'
import { IsMobile, GaTrackingId, NotebookPoweredPaths } from './constants'
import Header from './components/Header'
import Footer from './components/Footer'
import Cookies from './components/Cookies'
import ScrollToTop from './components/ScrollToTop'
import VideoReleaseLazy from './components/VideoRelease/VideoReleaseLazy'
import PercentLoader from './components/PercentLoader'
// import Auth0ProviderWithHistory from "./components/Auth0/Auth0ProviderWithHistory"
import Loading from './pages/Loading'
import ReactGA from 'react-ga'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { AcceptAnalyticsCookies, AcceptCookies } from './logic/tracking'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Me from './components/Me'
import WindowEvents from './components/WindowEvents'
import Page from './pages/Page'

console.info('\n   _   _ _   \n  | |_| | |_ \n  | | . |   |\n _| |___|_|_|\n|___|       \n\n')

// console.info('initial saved state', persistentState)
console.info('%cacceptAnalyticsCookies', 'font-weight: bold', AcceptAnalyticsCookies)
console.info('%cacceptCookies', 'font-weight: bold', AcceptCookies)

// check if there is a crfs cookie
const csrfToken = new UniversalCookie().get('csrftoken')
console.info('%ccsrftoken', 'font-weight: bold', csrfToken)
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

/* Pages */
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const AbstractSubmission = lazy(() => import('./pages/AbstractSubmission'))
const AbstractSubmitted = lazy(() => import('./pages/AbstractSubmitted'))
const ArticlesPage = lazy(() => import('./pages/Articles'))
const CallForPapers = lazy(() => import('./pages/CallForPapers'))
// const Issue = lazy(() => import('./pages/Issue'))
const Abstract = lazy(() => import('./pages/Abstract'))
const MockAbstract = lazy(() => import('./pages/MockAbstract'))
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'))
const Playground = lazy(() => import('./pages/Playground'))
const Notebook = lazy(() => import('./pages/Notebook'))
const LocalNotebook = lazy(() => import('./pages/LocalNotebook'))
const NotebookViewer = lazy(() => import('./pages/NotebookViewer'))
const NotebookViewerForm = lazy(() => import('./pages/NotebookViewerForm'))
const Guidelines = lazy(() => import('./pages/Guidelines.v2'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ArticleViewer = lazy(() => import('./pages/ArticleViewer'))
const Fingerprint = lazy(() => import('./pages/Fingerprint'))
const FingerprintViewer = lazy(() => import('./pages/FingerprintViewer'))
const FingerprintExplained = lazy(() => import('./pages/FingerprintExplained'))
const ReleaseNotes = lazy(() => import('./pages/ReleaseNotes'))
const ReviewPolicy = lazy(() => import('./pages/ReviewPolicy'))
const Faq = lazy(() => import('./pages/Faq'))

const { startLangShort, lang } = getStartLang()

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

console.info('start language:', lang, startLangShort)
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: translations,
    lng: lang,
    interpolation: {
      escapeValue: false, // react already safes from xss
      format: function (value, format) {
        if (value instanceof Date) {
          if (format === 'fromNow') {
            return moment(value).fromNow()
          }
          return moment(value).format(format)
        }
        return value
      },
    },
  })

console.info('IsMobile:', IsMobile)

function usePageViews() {
  const { trackPageView } = useMatomo()
  const { pathname, search } = useLocation()
  const changeBackgroundColor = useStore((state) => state.changeBackgroundColor)

  useEffect(() => {
    const url = [pathname, search].join('')
    console.info('pageview', url)
    changeBackgroundColor('var(--gray-100)')
    ReactGA.pageview(url)
    trackPageView({
      href: url,
    })
  }, [pathname, search, changeBackgroundColor])
}

function AppRoutes() {
  usePageViews()
  // const { path } = useResolvedPath("")
  const path = LANGUAGE_PATH


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/authorized" element={<div>authorized</div>} />
      <Route path={`${path}`} element={<Home />} />
      <Route path={`${path}/about`} element={<About />} />
      <Route path={`${path}/abstract`} element={<MockAbstract />} />
      <Route path={`${path}/abstract/:id`} element={<Abstract />} />
      <Route path={`${path}/issues`} element={<ArticlesPage />} />
      <Route path={`${path}/issue/:id`} element={<ArticlesPage />} />
      <Route path={`${path}/article/:pid`} element={<ArticleViewer />} />
      <Route path={`${path}/articles`} element={<ArticlesPage />} />
      <Route path={`${path}/abstract-submitted`} element={<AbstractSubmitted />} />
      <Route path={`${path}/terms`} element={<TermsOfUse />} />
      <Route path={`${path}/submit`} element={<AbstractSubmission />} />
      <Route path={`${path}/notebook/:encodedUrl?`} element={<Notebook />} />
      <Route path={`${path}/notebook-viewer-form`} element={<NotebookViewerForm />} />
      <Route path={`${path}/fingerprint-viewer`} element={<FingerprintViewer />} />
      <Route path={`${path}/fingerprint-explained/:encodedUrl?`} element={<FingerprintExplained />} />
      <Route path={`${path}/release-notes`} element={<ReleaseNotes />} />
      <Route path={`${path}/review-policy`} element={<ReviewPolicy />} />
      <Route path={`${path}/faq`} element={<Faq />} />
      <Route path={`${path}/notebook-viewer/:encodedUrl`} element={<NotebookViewer />} />
      <Route path={`${path}/local-notebook`} element={<LocalNotebook />} />
      <Route path={`${path}/playground`} element={<Playground />} />
      <Route path={`${path}/fingerprint`} element={<Fingerprint />} />
      <Route path={`${path}/guidelines`} element={<Guidelines />} />
      <Route path={`${path}/cfp/:permalink`} element={<CallForPapers />} />
      <Route path={`${path}/p/:pageId`} element={<Page />} />
      <Route path={`${path}*`} element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <QueryParamProvider >
          <PercentLoader />
          <Header availableLanguages={LANGUAGES} isAuthDisabled />
          {typeof csrfToken === 'string' && <Me/>}
          <Cookies defaultAcceptCookies={AcceptCookies} />
          <main>
            <Suspense fallback={<Loading />} key={location.key}>
              <AppRoutes />
            </Suspense>
          </main>
          <Footer hideOnRoutes={NotebookPoweredPaths} />
          <ScrollToTop />
          <WindowEvents />
          <VideoReleaseLazy isMobile={IsMobile} url={import.meta.env.VITE_WIKI_VIDEO_RELEASES} />
        </QueryParamProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}