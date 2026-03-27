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
          DEFAULT: "#F97316",
          500: "#F97316",
          400: "#FB923C",
          300: "#FDBA74",
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