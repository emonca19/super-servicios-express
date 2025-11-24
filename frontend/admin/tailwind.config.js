/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",                          // páginas del admin
    "./assets/js/**/*.js",               // scripts, componentes, microfrontends
    "../../shared/**/*.js",              // utils compartidos
  ],
  theme: {
    extend: {
      colors: {
        sidebar: "#162232",
        primaryBlue: "#305DE9",
        accentOrange: "#FF6800",
        darkBlue: "#101828",
        grayText: "#4A5565",
      }
    },
  },
  plugins: [],
};
