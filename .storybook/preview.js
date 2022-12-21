import WebFontLoader from 'webfontloader'

import '../src/styles/index.scss'

WebFontLoader.load({
  google: {
    families: [
      'Source+Serif+Pro:400,700',
      'Fira+Code:400,700:latin-ext',
      'Fira+Sans:400,700,ital:latin-ext',
    ],
  },
})

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
