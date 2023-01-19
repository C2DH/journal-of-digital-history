const base = '/storybook/'

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.js',
    // "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
    'storybook-dark-mode',
    'storybook-react-i18next',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  managerWebpack: (config, { configType }) => {
    if (configType === 'PRODUCTION') {
      config.output.publicPath = base
    }
    return config
  },
  managerHead: (head, { configType }) => {
    const injections = [
      `<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">`, // This set icon for your site.
      `<script>window.PREVIEW_URL = '${base}iframe.html'</script>`, // This decide how storybook's main frame visit stories
    ]
    return configType === 'PRODUCTION' ? `${head}${injections.join('')}` : head
  },
  // Or webpackFinal
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') {
      config.base = base
    }
    return config
  },
}
