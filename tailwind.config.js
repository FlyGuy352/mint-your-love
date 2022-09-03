/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightPink: '#FFF7F8',
        crimsonRed: '#DC143C',
        darkRed: '#8B0000',
        pinkishPurple: '#E75480',
        mediumPink: '#FADADD',
        lightSkyBlue: '#CDECFF'
      }
    },
    fontFamily: {
      'Kodchasan': ['Kodchasan']
    },
    backgroundImage: {
      'hero': "url('/assets/images/love.jpg')",
    },
  },
  plugins: []
}