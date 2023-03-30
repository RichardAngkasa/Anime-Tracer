/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#fffffe",
        secondary: "#90b4ce",
        tertiary: "#d9376e",
        highlight: "#3da9fc",
        stroke: "#094067",
        buttoneText: "#fffffe",
      },
    },
  },
  plugins: [],
};
