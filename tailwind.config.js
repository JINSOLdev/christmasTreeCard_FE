/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fef9c3',
        choco: '#78350f',
      },
      boxShadow: {
        card: '0 16px 30px rgba(15,23,42,0.15)',
      },
    },
  },
  plugins: [],
}
