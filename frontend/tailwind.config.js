/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          DEFAULT: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        surface: {
          DEFAULT: "#ffffff",
          dark: "#18181B", 
          secondary: "#27272A"
        },
        border: {
          DEFAULT: "#e5e7eb", 
          dark: "#27272A" 
        },
        background: {
          dark: "#09090B"
        }
      },
    },
  },
  plugins: [],
};