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
        // Primary - Watermelon
        primary: {
          50: '#fff1f3',
          100: '#ffe0e5',
          200: '#ffc7d0',
          300: '#ff9dae',
          400: '#FF4F6F', // Main watermelon
          500: '#f83a5c',
          600: '#e51d47',
          700: '#c1123a',
          800: '#a01236',
          900: '#881434',
        },
        // Neutral - Black to White
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: [
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
