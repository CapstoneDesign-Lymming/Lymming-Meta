/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Nunito Sans", "sans-serif"],
      nanum: ["NanumSquareNeo", "sans-serif"],
      establish: ["establishRetrosansOTF", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
