/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "grey-98": "var(--color-grey-98, #FAFAFA)",
      },
      fontFamily: {
        "road-rage": ['"Road Rage"', "cursive"],
      },
    },
  },
  plugins: [],
};
