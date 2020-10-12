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

import Header from './components/Header'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const AbstractSubmission = lazy(() => import('./pages/AbstractSubmission'))
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

function LangRoutes() {
  const { path } = useRouteMatch()
  console.info('LangRoutes render', path)
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <Home />
      </Route>
      <Route exact path={`${path}/about`}>
        <About />
      </Route>
      <Route exact path={`${path}/submit`}>
        <AbstractSubmission/>
      </Route>
      <Route path={`${path}*`}>
        <NotFound />
      </Route>
    </Switch>
  )
}

function AppRoutes() {
  return (
    <Switch>
      <Redirect from="/" exact to={startLangShort} />
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
      <Header availableLanguages={LANGUAGES}/>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRoutes />
        </Suspense>
      </main>
    </BrowserRouter>
  )
}
