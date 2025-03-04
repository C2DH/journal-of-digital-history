import type { Preview } from '@storybook/react'
import '../src/styles/index.scss'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i, 
       date: /Date$/i,
      },
    },
  },
  globalTypes:{
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      toolbar: {
        icon: 'globe',
        items: [
          {  value: 'en-US', title: 'English', right: '🇺🇸' },
          {  value: 'fr-FR', title: 'Français', right: '🇫🇷' },
        ],
        showName: true,
      },
    },
  }
};

export default preview;