import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  // Link,
  Redirect,
  useRouteMatch,
} from "react-router-dom";
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'
import { getStartLang, LANGUAGE_PATH, LANGUAGES } from './logic/language';
import translations from './translations'
import {useStore} from './store'
import Header from './components/Header'
import Footer from './components/Footer'
import Auth0ProviderWithHistory from "./components/Auth0/Auth0ProviderWithHistory"

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const AbstractSubmission = lazy(() => import('./pages/AbstractSubmission'))
const Article = lazy(() => import('./pages/Article'))
const NotFound = () => {
  return (<div>
    <h1>Not found</h1>
    <p>sorry your page was not found</p>
  </div>);
}
const { startLangShort, lang } = getStartLang()
console.info('start language:', lang, startLangShort)
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: translations,
    lng: lang,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

const isUnsafeEnvironment = process.env.NODE_ENV !== 'development' && window.location.protocol === 'http:'
console.info('Auth0Provider:', isUnsafeEnvironment ? 'disabled' : 'enabled')

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
      <Route exact path={`${path}/article`}>
        <Article />
      </Route>
      <Route exact path={`${path}/submit`}>
        <AbstractSubmission />
      </Route>
      <Route path={`${path}*`}>
        <NotFound />
      </Route>
    </Switch>
  )
}

function AppRoutes() {
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
        <main>
          <MainBackground />
          <Suspense fallback={<div>Loading...</div>}>
            <AppRoutes />
          </Suspense>
        </main>
        <Footer ></Footer>
      </Auth0ProviderWithHistory>
    </BrowserRouter>
  )
}
