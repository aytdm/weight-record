// buefy cause 'ReferenceError: HTMLElement is not defined'
// See https://github.com/buefy/buefy/issues/712
global.HTMLElement = typeof window === 'undefined' ? Object : window.HTMLElement

module.exports = {
  mode: 'spa',
  srcDir: 'src/',
  /*
  ** Headers of the page
  */
  head: {
    title: 'track-weight',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'My weight project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#209CEE' },
  plugins: ['~plugins/buefy'],
  modules: ['@nuxtjs/dotenv'],
  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios', 'buefy', 'moment'],
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev }) {
      if (isDev && process.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    postcss: {
      plugins: {
        'postcss-custom-properties': {
          warnings: false
        }
      }
    }
  }
}
