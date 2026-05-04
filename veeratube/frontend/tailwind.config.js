/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#ff4444',
          dark: '#0a0a0a',
          card: '#141414',
          border: '#2a2a2a',
          muted: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Bebas Neue', 'cursive'],
      },
    },
  },
  plugins: [],
}
