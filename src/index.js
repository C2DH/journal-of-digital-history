import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import WebFontLoader from 'webfontloader'

WebFontLoader.load({
  google: {
    families: [
      'Source+Serif+Pro:400,700',
      'Fira+Code:400,700:latin-ext',
      'Fira+Sans:400,700:latin-ext'
    ]
  }
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// add information on version on startup
console.info('version',
  process.env.REACT_APP_GIT_TAG,
  process.env.REACT_APP_GIT_BRANCH,
  `\nhttps://github.com/C2DH/journal-of-digital-history/commit/${process.env.REACT_APP_GIT_REVISION}`
)
