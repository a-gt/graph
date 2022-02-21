module.exports = {
  dark: true,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: "IBM Plex Mono",
      header: "Bebas Neue",
    },
    colors: {
      silver:"rgb(255, 246, 230)",
      "blue-fg": "rgb(71, 207, 237)",
      "blue-bg": "rgb(48, 52, 53)",
      dark: "rgb(39, 35, 37)"
    }
  },
  plugins: [],
};
