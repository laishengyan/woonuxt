import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}', './app.vue'],
  theme: {
    container: {
      center: true,
      maxWidth: '1200px',
    },
    extend: {
      colors: {
        primary: {
          light: '#7f1c1b',
          DEFAULT: process.env.PRIMARY_COLOR || '#7f1c1b',
          dark: '#7f1c1b',
        },
      },
      screens: {
        '2xl': '1400px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
