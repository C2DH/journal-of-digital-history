import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Redirect, useRouteMatch, useLocation } from "react-router-dom"
import { QueryParamProvider } from 'use-query-params'
import i18n from 'i18next'
import moment from 'moment'
import { initReactI18next } from 'react-i18next'
import { getStartLang, LANGUAGE_PATH, LANGUAGES } from './logic/language'
import translations from './translations'
import {useStore} from './store'
import { IsMobile, GaTrackingId } from './constants'
import Header from './components/Header'
import Footer from './components/Footer'
import Cookies from './components/Cookies'
import ScrollToTop from './components/ScrollToTop'
import Auth0ProviderWithHistory from "./components/Auth0/Auth0ProviderWithHistory"
import Loading from './pages/Loading'
import ReactGA from 'react-ga';
// Getting non-reactive fresh state
let persistentState = useStore.getState()

try {
  const localStorageState = JSON.parse(localStorage.getItem('JournalOfDigitalHistory'));
  console.info('\n   _   _ _   \n  | |_| | |_ \n  | | . |   |\n _| |___|_|_|\n|___|       \n\n')
  console.info('%cinitial available state', 'font-weight: bold', 'in localStorage:', localStorageState !== null)
  if (localStorageState) {
    persistentState = localStorageState
  }
} catch(e) {
  console.warn(e)
}

const acceptAnalyticsCookies = Boolean(persistentState.state?.acceptAnalyticsCookies)
const acceptCookies = Boolean(persistentState.state?.acceptCookies)
// console.info('initial saved state', persistentState)
console.info('%cacceptAnalyticsCookies', 'font-weight: bold', acceptAnalyticsCookies)
console.info('%cacceptCookies', 'font-weight: bold', acceptCookies)

// integrate history \w Google Analytics
if (GaTrackingId && acceptAnalyticsCookies) {
  ReactGA.initialize(GaTrackingId);
  console.info('%cGA enabled by user choice', 'font-weight: bold', GaTrackingId)
} else if(GaTrackingId) {
  console.info(
    '%cGA disabled by user choice:', 'font-weight: bold',
    'acceptAnalyticsCookies:', acceptAnalyticsCookies
  )
} else {
  console.info('%cGA GaTrackingId not set', 'font-weight: bold', 'disabled by config.')
}

/* Pages */
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const AbstractSubmission = lazy(() => import('./pages/AbstractSubmission'))
const AbstractSubmitted = lazy(() => import('./pages/AbstractSubmitted'))
const Issue = lazy(() => import('./pages/Issue'))
const Issues = lazy(() => import('./pages/Issues'))
const Abstract = lazy(() => import('./pages/Abstract'))
const MockAbstract = lazy(() => import('./pages/MockAbstract'))
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'))
const Playground = lazy(() => import('./pages/Playground'))
const Notebook = lazy(() => import('./pages/Notebook'))
const LocalNotebook = lazy(() => import('./pages/LocalNotebook'))
const NotebookViewer = lazy(() => import('./pages/NotebookViewer'))
const NotebookViewerForm = lazy(() => import('./pages/NotebookViewerForm'))
const Guidelines = lazy(() => import('./pages/Guidelines'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ArticleViewer = lazy(() => import('./pages/ArticleViewer'))
const Fingerprint = lazy(() => import('./pages/Fingerprint'))
const FingerprintViewer = lazy(() => import('./pages/FingerprintViewer'))

const { startLangShort, lang } = getStartLang()
console.info('start language:', lang, startLangShort)
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: translations,
    lng: lang,
    interpolation: {
      escapeValue: false, // react already safes from xss
      format: function(value, format) {
          if (value instanceof Date) {
            if (format === 'fromNow') {
              return moment(value).fromNow()
            }
            return moment(value).format(format)
          }
          return value;
      }
    }
  })

const isUnsafeEnvironment = process.env.NODE_ENV !== 'development' && window.location.protocol === 'http:'
const isAuth0Enabled = process.env.REACT_APP_ENABLE_AUTH_0 !== 'false'
console.info('Auth0Provider:', isUnsafeEnvironment ? 'disabled' : 'enabled')
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
      <Route path={`${path}/issues`} component={Issues} />
      <Route path={`${path}/issue/:id`} component={Issue} />
      <Route path={`${path}/article/:pid`} component={ArticleViewer} />
      <Route path={`${path}/abstract-submitted`} component={AbstractSubmitted} />
      <Route exact path={`${path}/terms`} component={TermsOfUse}/>
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
      <Route path={`${path}/notebook-viewer/:encodedUrl`}
        component={NotebookViewer}
      />
      <Route path={`${path}/local-notebook`}>
        <LocalNotebook />
      </Route>
      <Route exact path={`${path}/playground`} component={Playground}/>
      <Route exact path={`${path}/fingerprint`} component={Fingerprint} />
      <Route exact path={`${path}/guidelines`} component={Guidelines} />
      <Route path={`${path}*`}>
        <NotFound path={path}/>
      </Route>
    </Switch>
  )
}

function usePageViews() {
  const { pathname, search } = useLocation()
  const changeBackgroundColor = useStore(state => state.changeBackgroundColor)

  useEffect(
    () => {
      const url = [pathname, search].join('')
      console.info('pageview', url)
      // based on the pathname, change the background
      if (pathname.indexOf('/notebook') !== -1 || pathname.indexOf('/article') !== -1) {
        changeBackgroundColor('#F4F1F8')
      } else if (pathname.indexOf('/issue') !== -1) {
        changeBackgroundColor('#F4F1F8')
      } else if (pathname.indexOf('/submit') !== -1) {
        changeBackgroundColor('var(--gray-100)')
      } else if (pathname.indexOf('/about') !== -1) {
        changeBackgroundColor('var(--linen)')
      } else if (pathname.indexOf('/terms') !== -1) {
        changeBackgroundColor('var(--peachpuff)')
      } else {
        changeBackgroundColor('var(--gray-100)')
      }
      ReactGA.pageview(url)
    },
    [pathname, search, changeBackgroundColor]
  )
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

  return (
    <BrowserRouter>
      <QueryParamProvider ReactRouterRoute={Route}>
      <Auth0ProviderWithHistory
        disabled={!isAuth0Enabled || isUnsafeEnvironment}
        domain="dev-cy19cq3w.eu.auth0.com"
        clientId="NSxE7D46GRk9nh32wdvbtBUy7bLLQnZL"
        redirectUri={`${window.location.origin}/authorized`}
      >
        <Header availableLanguages={LANGUAGES} isAuthDisabled={!isAuth0Enabled || isUnsafeEnvironment}/>
        <Cookies defaultAcceptCookies={acceptCookies}/>
        <main>
          <Suspense fallback={<Loading/>}>
            <AppRoutes />
          </Suspense>
        </main>
        <Footer ></Footer>
        <ScrollToTop />
      </Auth0ProviderWithHistory>
      </QueryParamProvider>
    </BrowserRouter>
  )
}
