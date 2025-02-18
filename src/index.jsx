import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import WebFontLoader from 'webfontloader'
import { MatomoProvider, createInstance } from '@jonkoops/matomo-tracker-react'
import { AcceptAnalyticsCookies } from './logic/tracking'

const matomo = createInstance({
  urlBase: import.meta.env.VITE__MATOMO_URLBASE,
  siteId: import.meta.env.VITE__MATOMO_SITEID,
  // userId: 'UIDC2DH', // optional, default value: `undefined`.
  // trackerUrl: 'https://LINK.TO.DOMAIN/tracking.php', // optional, default value: `${urlBase}matomo.php`
  // srcUrl: 'https://LINK.TO.DOMAIN/tracking.js', // optional, default value: `${urlBase}matomo.js`
  disabled: !AcceptAnalyticsCookies, // optional, false by default. Makes all tracking calls no-ops if set to true.
  heartBeat: {
    // optional, enabled by default
    active: true, // optional, default value: true
    seconds: 10, // optional, default value: `15
  },
  // linkTracking: false, // optional, default value: true
  configurations: {
    // optional, default value: {}
    // any valid matomo configuration, all below are optional
    disableCookies: true,
    setSecureCookie: window.location.protocol === 'https:',
    setRequestMethod: 'POST',
  },
})

// console.info('initial saved state', persistentState)
console.info(
  AcceptAnalyticsCookies ? '%cMatomo enabled' : '%cMatomo disabled',
  'font-weight: bold',
  import.meta.env.VITE__MATOMO_URLBASE,
)

// replace console.* for disable log debug on production
if (process.env.NODE_ENV === 'production' && import.meta.env.VITE__BASEURL === location.origin) {
  console.debug = () => {}
}

WebFontLoader.load({
  google: {
    families: [
      'Source+Serif+Pro:400,700',
      'Fira+Code:400,700:latin-ext',
      'Fira+Sans:400,700,ital:latin-ext',
    ],
  },
})

createRoot(document.getElementById('root')).render(
  <MatomoProvider value={matomo}>
    <App />
  </MatomoProvider>,
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

// add information on version on startup
console.info(
  '%cversion',
  'font-weight: bold',
  import.meta.env.VITE__GIT_TAG,
  import.meta.env.VITE__GIT_BRANCH,
  import.meta.env.VITE__BUILD_DATE,
  `\nhttps://github.com/C2DH/journal-of-digital-history/commit/${import.meta.env.VITE__GIT_COMMIT_SHA}`,
)
