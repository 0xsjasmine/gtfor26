import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Papier Blue (elegant periwinkle)
        primary: {
          50: '#F0F4FB',
          100: '#E1E9F7',
          200: '#C3D3EF',
          300: '#9BB5E4',
          400: '#6B8DD6', // Main Papier blue
          500: '#4A6FC4',
          600: '#3A5AA8',
          700: '#2E478A',
          800: '#273B71',
          900: '#24345E',
        },
        // Cream - Papier-style backgrounds
        cream: {
          50: '#FDFCFB',
          100: '#FAF9F6',
          200: '#F5F3EF',
          300: '#EBE8E2',
          400: '#DDD9D0',
        },
        // Neutral - Warm grays
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
      },
      fontFamily: {
        // Elegant serif for headers - Papier style
        serif: [
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif',
        ],
        // Clean sans for body text
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
export default config
