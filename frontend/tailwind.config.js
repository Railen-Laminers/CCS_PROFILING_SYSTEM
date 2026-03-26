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
          dark: "#1E1E1E",
          secondary: "#252525"
        },
        border: {
          DEFAULT: "#e5e7eb", // gray-200
          dark: "#1f2937" // gray-800
        }
      },
    },
  },
  plugins: [],
};