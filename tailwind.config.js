/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Plus Jakarta Sans", "sans-serif"],
      },
      width: {
        128: "27rem",
      },
      colors: {
        background: "#020109",
        bg_secondary: "#6fabee",
        primary: "#FFFFFF",
        secondary: "#303C42",
        accent: "#0058FE",
        button_secondary: "#3889eb",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
