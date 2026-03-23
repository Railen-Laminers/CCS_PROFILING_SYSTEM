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
          500: "#F47A20",
          400: "#F68B3C",
          300: "#F9A86C",
        },
      },
    },
  },
  plugins: [],
};