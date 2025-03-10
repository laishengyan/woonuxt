import { createResolver } from '@nuxt/kit';
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: `%s | ${process.env.SITE_TITLE ?? 'oriental-art.net'}`,
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', href: 'favicon.ico' },
        { rel: 'preload', href: '/fonts/HarmonyOS_Sans_Bold.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/HarmonyOS_Sans_Medium.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/HarmonyOS_Sans_Regular.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
      ],
      script: [
        {
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=G-FE2PB50BL3'
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FE2PB50BL3');
          `,
          type: 'text/javascript'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  experimental: {
    sharedPrerenderData: true,
    payloadExtraction: true,
    renderJsonPayloads: true
  },

  css: ['../woonuxt_base/assets/css/fonts.css'],

  plugins: [resolve('./plugins/init.ts')],

  components: [{ path: resolve('./components'), pathPrefix: false }],

  modules: ['woonuxt-settings', 'nuxt-graphql-client', '@nuxtjs/tailwindcss', 'nuxt-icon', '@nuxt/image', '@nuxtjs/i18n'],

  'graphql-client': {
    clients: {
      default: {
        host: process.env.GQL_HOST || 'https://b.oriental-art.net/graphql',
        corsOptions: { mode: 'cors', credentials: 'include' },
      },
    },
  },

  hooks: {
    'pages:extend'(pages) {
      const addPage = (name: string, path: string, file: string) => {
        pages.push({ name, path, file: resolve(file) });
      };

      // addPage('product-page-pager', '/products/page/:pageNumber', './pages/products.vue');
      // addPage('category-page', '/category/:slug', './pages/category/[slug].vue');
      // addPage('category-page-pager', '/category/:slug/page/:pageNumber', './pages/category/[slug].vue');
      addPage('order-received', '/checkout/order-received/:orderId', './pages/order-summary.vue');
      addPage('order-summary', '/order-summary/:orderId', './pages/order-summary.vue');
    },
  },

  nitro: {
    // 启用 HTTP 管道提升并发能力
    enableHTTPPipe: true,
    // 优化服务端打包
    minify: true,
    // 配置服务端缓存
    storage: {
      'redis:server-cache': {
        driver: 'redis',
        /* redis 配置 */
        url: process.env.REDIS_URL,
        ttl: 3600 // 1小时
      }
    },
    // 开启 HTTP/2 提升并发性能
    enableHTTP2: true,
    // 启用压缩（Brotli + Gzip）
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
    // 调整资源限制
    maxMemory: 4096, // 4GB 内存限制
    timing: {
      metrics: true
    },
    // 服务端构建优化
    sourceMap: false,              // 关闭 Source Map
    // 提升并发能力
    // 请求超时设置
    timeout: 5000,                 // 5秒超时
    routeRules: {
      // 缓存图片资源
      '/_nuxt/**': {
        headers: {
          'Cache-Control': 'public, max-age=0, stale-while-revalidate=0' // 7天 + 1天SWR
        },
      },
      // 缓存 public 目录下的静态资源
      '/images/**': {
        headers: {
          'Cache-Control': 'public, max-age=2592000' // 30天
        },
      },
      // 缓存 public 目录下的静态资源
      '/modile/**': {
        headers: {
          'Cache-Control': 'public, max-age=2592000' // 30天
        },
      },
      // 缓存 public 目录下的静态资源
      '/icons/**': {
        headers: {
          'Cache-Control': 'public, max-age=2592000' // 30天
        },
      },
      // 其他静态资源
      '/fonts/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable' // 保持1年
        },
      },
      '/': { swr: 1800 },
      '/en': { swr: 1800 },
      '/zh': { swr: 1800 },
      '/de': { swr: 1800 },
      '/ja': { swr: 1800 },
      '/blog': { swr: 180 },
      '/blog/**': { prerender: true, swr: 180 },
      '/products': { swr: 180 },
      '/return_policy': { prerender: true, swr: 3600 },
      '/save_blog': { prerender: true, swr: 3600 },
      '/further-info': { prerender: true, swr: 3600 },
      '/my-account': { swr: 180 },
      '/category/**': { prerender: true, swr: 180 },
      '/checkout/order-received/**': { prerender: false, ssr: false },
      '/order-summary/**': { prerender: false, ssr: false },
      '/product/**': { prerender: true, swr: 180 },
      '/en/blog': { swr: 180 },
      '/en/blog/**': { prerender: true, swr: 180 },
      '/en/products': { swr: 180 },
      '/en/return_policy': { prerender: true, swr: 3600 },
      '/en/save_blog': { prerender: true, swr: 3600 },
      '/en/further-info': { prerender: true, swr: 3600 },
      '/en/my-account': { swr: 180 },
      '/en/category/**': { prerender: true, swr: 180 },
      '/en/checkout/order-received/**': { prerender: false, ssr: false },
      '/en/order-summary/**': { prerender: false, ssr: false },
      '/en/product/**': { prerender: true, swr: 180 },
      '/zh/blog': { swr: 180 },
      '/zh/blog/**': { prerender: true, swr: 180 },
      '/zh/products': { swr: 180 },
      '/zh/return_policy': { prerender: true, swr: 3600 },
      '/zh/save_blog': { prerender: true, swr: 3600 },
      '/zh/further-info': { prerender: true, swr: 3600 },
      '/zh/my-account': { swr: 180 },
      '/zh/category/**': { prerender: true, swr: 180},
      '/zh/checkout/order-received/**': { prerender: false, ssr: false },
      '/zh/order-summary/**': { prerender: false, ssr: false },
      '/zh/product/**': { prerender: true, swr: 180 },
      '/de/blog': { swr: 180 },
      '/de/blog/**': { prerender: true, swr: 180 },
      '/de/products': { swr: 180 },
      '/de/return_policy': { prerender: true, swr: 3600 },
      '/de/save_blog': { prerender: true, swr: 3600 },
      '/de/further-info': { prerender: true, swr: 3600 },
      '/de/my-account': { swr: 180 },
      '/de/category/**': { prerender: true, swr: 180 },
      '/de/checkout/order-received/**': { prerender: false, ssr: false },
      '/de/order-summary/**': { prerender: false, ssr: false },
      '/de/product/**': { prerender: true, swr: 180 },
      '/ja/blog': { swr: 180 },
      '/ja/blog/**': { prerender: true, swr: 180 },
      '/ja/products': { swr: 180 },
      '/ja/return_policy': { prerender: true, swr: 3600 },
      '/ja/save_blog': { prerender: true, swr: 3600 },
      '/ja/further-info': { prerender: true, swr: 3600 },
      '/ja/my-account': { swr: 180 },
      '/ja/category/**': { prerender: true, swr: 180 },
      '/ja/checkout/order-received/**': { prerender: false, ssr: false },
      '/ja/order-summary/**': { prerender: false, ssr: false },
      '/ja/product/**': { prerender: true, swr: 180 },
      '/wishlist': { ssr: false },
      '/en/wishlist': { ssr: false },
      '/ja/wishlist': { ssr: false },
      '/de/wishlist': { ssr: false },
      '/zh/wishlist': { ssr: false },
      '/addCart': { ssr: false },
      '/en/addCart': { ssr: false },
      '/ja/addCart': { ssr: false },
      '/de/addCart': { ssr: false },
      '/zh/addCart': { ssr: false },
      '/corp-info': { prerender: true, swr: 3600 },
      '/en/corp-info': { prerender: true, swr: 3600 },
      '/ja/corp-info': { prerender: true, swr: 3600 },
      '/de/corp-info': { prerender: true, swr: 3600 },
      '/zh/corp-info': { prerender: true, swr: 3600 }
    }
  },
  // Multilingual support
  i18n: {
    locales: [
      { code: 'en', file: 'en-US.json', name: 'English 🇺🇸' },
      { code: 'de', file: 'de-DE.json', name: 'Deutsch 🇩🇪' },
      { code: 'zh', file: 'zh-CN.json', name: 'Chinese 🇨🇳' },
      { code: 'ja', file: 'ja-JA.json', name: 'Japanese 🇯🇵' }
    ],
    langDir: 'locales',
    seo: true, // 启用 SEO 支持
    defaultLocale: 'en',
    strategy: 'prefix_and_default', // 路由策略
    detectBrowserLanguage: {
      useCookie: true, // 使用 cookie 记录用户语言偏好
      cookieKey: 'oriental_i18n_key',
      redirectOn: 'root', // 访问根路径时根据浏览器语言重定向
    }
  }
});
