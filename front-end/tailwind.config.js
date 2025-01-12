/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        themeBlack: "#100017",
        themeGray: "#1B1B23",
        themePurple: "#611F8D"
      }
    },
  },
  plugins: [],
}