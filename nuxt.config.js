module.exports = {
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
      { name: 'naver-site-verification', content: "0c7afd3b8b676edf11207f610b3d174ea8f23411"}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  
  css: ['~/assets/css/main.css', '~/node_modules/tachyons/css/tachyons.min.css', 
    '~/node_modules/swiper/dist/css/swiper.css'],
  
  plugins:[
    // { src: '~/plugins/swiper.js', ssr: false },
    { src: '~/plugins/fbConn.js', ssr: false },
    // { src: '~/plugins/monaco.js', ssr: false },
    // { src: '~/plugins/axios.js', ssr: false }
  ],
  build: {
    vendor: ['axios', 
    'firebase'
    //'vue-monaco'
  ],
  },
  serverMiddleware: [
    '~/server/api/logger'
  ],
  router: {
  }
}
