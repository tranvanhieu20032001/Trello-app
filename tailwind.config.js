/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#192a56',
        secondary:'#eeee',
        light: '#f8f9fa',
        dark:'#1d2025'
      }
    },
  },
  plugins: [],
}