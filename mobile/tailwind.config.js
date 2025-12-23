/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './stores/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eeefff',
          100: '#e0e2ff',
          200: '#c7c9fe',
          300: '#a5a6fc',
          400: '#8a81f8',
          500: '#7863f1',
          600: '#6946e5',
          700: '#5b38ca',
          800: '#472e9c',
          900: '#3f2e81',
          950: '#261b4b',
        },
      },
    },
  },
  plugins: [],
};
