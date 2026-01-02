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
        // Warm, chic color palette
        warm: {
          50: '#fdfcfb',
          100: '#faf7f5',
          200: '#f5ebe5',
          300: '#e8d5c8',
          400: '#d4b5a0',
          500: '#c49a7c',
          600: '#a67c5b',
          700: '#8a6548',
          800: '#6d503a',
          900: '#4a3628',
        },
        // Accent - warm rose/blush
        accent: {
          50: '#fdf8f6',
          100: '#fbeee9',
          200: '#f8dcd2',
          300: '#f2c4b3',
          400: '#e8a088',
          500: '#d97b5d',
          600: '#c45d3e',
          700: '#a34832',
          800: '#853c2b',
          900: '#6d3426',
        },
        // Soft sage for balance
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7cfc7',
          300: '#a3b0a3',
          400: '#7d8f7d',
          500: '#617161',
          600: '#4d5a4d',
          700: '#404940',
          800: '#363d36',
          900: '#2f332f',
        },
        status: {
          success: '#7d8f7d',
          warning: '#d4a574',
          danger: '#c45d3e',
        }
      },
      fontFamily: {
        // Clean, simple sans-serif
        sans: [
          'Arial',
          'Helvetica Neue',
          'Helvetica',
          'sans-serif',
        ],
        serif: [
          'Arial',
          'Helvetica Neue',
          'Helvetica',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
export default config
