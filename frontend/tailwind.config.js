/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        primary: '#EA580C',
        secondary: '#EAB308',
        hoverPrimary: '#F97316',
        hoverSecondary: '#FACC15'
      }
    },
    
  },
  plugins: [],
}