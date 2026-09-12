/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lab-bg': '#FDFBF7',
        'lab-green': '#0C3C2E',
        'lab-gold': '#E2A336',
        'lab-gray-bg': '#F4F6F4',
        'lab-gray-text': '#6A736D',
      },
      fontFamily: {
        'serif': ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        'sans': ['Inter', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      }
    },
  },
  plugins: [],
}