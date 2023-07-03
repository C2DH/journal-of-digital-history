import React, { Suspense, lazy, useEffect } from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useLocation,
} from 'react-router-dom'
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
const Faq = lazy(() => import('./pages/Faq'))

const { startLangShort, lang } = getStartLang()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
      // refetchInterval: false,
      // refetchIntervalInBackground: false,
      // refetchOnMount: false,
      // staleTime: Infinity,
      // retry: false,
      // suspense: false,
      keepPreviousData: true,
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

// const isUnsafeEnvironment = process.env.NODE_ENV !== 'development' && window.location.protocol === 'http:'
// const isAuth0Enabled = process.env.REACT_APP_ENABLE_AUTH_0 !== 'false'
// console.info('Auth0Provider:', isUnsafeEnvironment ? 'disabled' : 'enabled')
console.info('IsMobile:', IsMobile)

function LangRoutes() {
  const { path } = useRouteMatch()
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <Home />
      </Route>
      <Route exact path={`${path}/about`}>
        <About />
      </Route>
      <Route exact path={`${path}/abstract`}>
        <MockAbstract />
      </Route>
      <Route path={`${path}/abstract/:id`}>
        <Abstract />
      </Route>

      <Route path={`${path}/issues`} component={ArticlesPage} />
      <Route path={`${path}/issue/:id`} component={ArticlesPage} />
      <Route path={`${path}/article/:pid`} component={ArticleViewer} />
      <Route exact path={`${path}/articles`} component={ArticlesPage} />
      <Route path={`${path}/abstract-submitted`} component={AbstractSubmitted} />
      <Route exact path={`${path}/terms`} component={TermsOfUse} />
      <Route exact path={`${path}/submit`}>
        <AbstractSubmission />
      </Route>
      <Route path={`${path}/notebook/:encodedUrl?`}>
        <Notebook />
      </Route>
      <Route path={`${path}/notebook-viewer-form`}>
        <NotebookViewerForm />
      </Route>
      <Route path={`${path}/fingerprint-viewer`} component={FingerprintViewer} />
      <Route path={`${path}/fingerprint-explained/:encodedUrl?`} component={FingerprintExplained} />

      <Route path={`${path}/release-notes`} component={ReleaseNotes} />
      <Route path={`${path}/faq`} component={Faq} />
      <Route path={`${path}/notebook-viewer/:encodedUrl`} component={NotebookViewer} />
      <Route path={`${path}/local-notebook`}>
        <LocalNotebook />
      </Route>
      <Route exact path={`${path}/playground`} component={Playground} />
      <Route exact path={`${path}/fingerprint`} component={Fingerprint} />
      <Route exact path={`${path}/guidelines/:notebook?`} component={Guidelines} />
      <Route exact path={`${path}/cfp/:permalink`} component={CallForPapers} />
      <Route path={`${path}*`}>
        <NotFound path={path} />
      </Route>
    </Switch>
  )
}

function usePageViews() {
  const { trackPageView } = useMatomo()

  const { pathname, search } = useLocation()
  const changeBackgroundColor = useStore((state) => state.changeBackgroundColor)

  useEffect(() => {
    const url = [pathname, search].join('')
    console.info('pageview', url)
    changeBackgroundColor('var(--gray-100)')
    // // based on the pathname, change the background
    // if (pathname.indexOf('/notebook') !== -1 || pathname.indexOf('/article') !== -1) {
    //   changeBackgroundColor('#F4F1F8')
    // } else if (pathname.indexOf('/issue') !== -1) {
    //   changeBackgroundColor('#F4F1F8')
    // } else if (pathname.indexOf('/submit') !== -1) {
    //   changeBackgroundColor('var(--gray-100)')
    // } else if (pathname.indexOf('/about') !== -1) {
    //   changeBackgroundColor('var(--linen)')
    // } else if (pathname.indexOf('/terms') !== -1) {
    //   changeBackgroundColor('var(--peachpuff)')
    // } else {
    //   changeBackgroundColor('var(--gray-100)')
    // }
    ReactGA.pageview(url)
    trackPageView({
      href: url,
    })
  }, [pathname, search, changeBackgroundColor])
}

function AppRoutes() {
  usePageViews()
  // <Redirect from="/" exact to={startLangShort} />
  return (
    <Switch>
      <Redirect from="/" exact to={startLangShort} />
      <Route path="/authorized">
        <div>authorized</div>
      </Route>
      <Route path={LANGUAGE_PATH}>
        <LangRoutes />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  )
}

export default function App() {
  // Removed Auth0ProviderWithHistory 30 Jun 2022
  //
  // <Auth0ProviderWithHistory
  //   disabled={!isAuth0Enabled || isUnsafeEnvironment}
  //   domain="dev-cy19cq3w.eu.auth0.com"
  //   clientId="NSxE7D46GRk9nh32wdvbtBUy7bLLQnZL"
  //   redirectUri={`${window.location.origin}/authorized`}
  // >
  // <Header availableLanguages={LANGUAGES} isAuthDisabled={!isAuth0Enabled || isUnsafeEnvironment}/>
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <QueryParamProvider ReactRouterRoute={Route}>
          <PercentLoader />
          <Header availableLanguages={LANGUAGES} isAuthDisabled />
          {typeof csrfToken === 'string' && <Me />}
          <Cookies defaultAcceptCookies={AcceptCookies} />
          <main>
            <Suspense fallback={<Loading />}>
              <AppRoutes />
            </Suspense>
          </main>
          <Footer hideOnRoutes={NotebookPoweredPaths} />
          <ScrollToTop />
          <VideoReleaseLazy isMobile={IsMobile} url={process.env.REACT_APP_WIKI_VIDEO_RELEASES} />
        </QueryParamProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
