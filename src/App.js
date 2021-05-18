import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Redirect, useRouteMatch, useLocation } from "react-router-dom"
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
import AppRouteLoading from './pages/AppRouteLoading'
import ReactGA from 'react-ga';
// Getting non-reactive fresh state
let persistentState = useStore.getState()

try {
  const localStorageState = JSON.parse(localStorage.getItem('JournalOfDigitalHistory'));
  if (localStorageState) {
    persistentState = localStorageState
  }
} catch(e) {
  console.warn(e)
}

const acceptAnalyticsCookies = persistentState.acceptAnalyticsCookies
const acceptCookies = persistentState.acceptCookies
console.info('initial saved state', persistentState)
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
const Article = lazy(() => import('./pages/Article'))
const Issue = lazy(() => import('./pages/Issue'))
const Abstract = lazy(() => import('./pages/Abstract'))
const MockAbstract = lazy(() => import('./pages/MockAbstract'))
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'))
const Playground = lazy(() => import('./pages/Playground'))
const Notebook = lazy(() => import('./pages/Notebook'))
const LocalNotebook = lazy(() => import('./pages/LocalNotebook'))
const NotebookViewer = lazy(() => import('./pages/NotebookViewer'))
const Guidelines = lazy(() => import('./pages/Guidelines'))
const NotFound = lazy(() => import('./pages/NotFound'))

const { startLangShort, lang } = getStartLang()
console.info('start language:', lang, startLangShort)
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: translations,
    lng: lang,
    interpolation: {
      escapeValue: false, // react already safes from xss
      format: function(value, format, lng) {
          if(value instanceof Date) {
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
      <Route exact path={`${path}/article/:layer?`}>
        <Article />
      </Route>
      <Route exact path={`${path}/abstract`}>
        <MockAbstract />
      </Route>
      <Route path={`${path}/abstract/:id`}>
        <Abstract />
      </Route>
      <Route path={`${path}/issue/:id`} component={Issue} />
      <Route path={`${path}/abstract-submitted`}>
        <AbstractSubmitted />
      </Route>
      <Route exact path={`${path}/terms`}>
        <TermsOfUse />
      </Route>
      <Route exact path={`${path}/submit`}>
        <AbstractSubmission />
      </Route>
      <Route path={`${path}/notebook/:encodedUrl?`}>
        <Notebook />
      </Route>
      <Route path={`${path}/notebook-viewer/:encodedUrl?`}>
        <NotebookViewer />
      </Route>
      <Route path={`${path}/local-notebook`}>
        <LocalNotebook />
      </Route>
      <Route exact path={`${path}/playground`}>
        <Playground />
      </Route>
      <Route exact path={`${path}/guidelines`}>
        <Guidelines />
      </Route>
      <Route path={`${path}*`}>
        <NotFound path={path}/>
      </Route>
    </Switch>
  )
}

function usePageViews() {
  let location = useLocation()

  useEffect(
    () => {
      const url = [location.pathname, location.search].join('')
      console.info('pageview', url)
      ReactGA.pageview(url)
    },
    [location]
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

const MainBackground = () => {
  const backgroundColor =  useStore((state) => state.backgroundColor);
  return (
    <div className="vh-100 vw-100 position-fixed main-background" style={{top: 0, backgroundColor}}></div>
  )
}


export default function App() {

  return (
    <BrowserRouter>
      <Auth0ProviderWithHistory
        disabled={isUnsafeEnvironment}
        domain="dev-cy19cq3w.eu.auth0.com"
        clientId="NSxE7D46GRk9nh32wdvbtBUy7bLLQnZL"
        redirectUri={`${window.location.origin}/authorized`}
      >
        <Header availableLanguages={LANGUAGES} isAuthDisabled={isUnsafeEnvironment}/>
        <Cookies defaultAcceptCookies={acceptCookies}/>
        <main>
          <MainBackground />
          <Suspense fallback={<AppRouteLoading/>}>
            <AppRoutes />
          </Suspense>
        </main>
        <Footer ></Footer>
        <ScrollToTop />
      </Auth0ProviderWithHistory>
    </BrowserRouter>
  )
}
