import WebFontLoader from 'webfontloader'
import i18n from './i18next.js'
import { themes } from '@storybook/theming'

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
  i18n,
  locale: 'en-US',
  locales: {
    'en-US': 'English',
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    // Override the default dark theme
    dark: { ...themes.dark, appBg: 'black', classTarget: '#root', stylePreview: true },
    // Override the default light theme
    light: { ...themes.normal, appBg: 'lightgrey' },
  },
}
