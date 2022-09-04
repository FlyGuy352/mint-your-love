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
        lightSkyBlue: '#CDECFF',
        softPink: '#FFC0CB'
      }
    },
    fontFamily: {
      'Kodchasan': ['Kodchasan'],
      'Chewy': ['Chewy']
    },
    fontSize: {
      'xxs': '0.6rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    backgroundImage: {
      'hero': "url('/assets/images/love.jpg')",
      'heartbreak': "url('/assets/images/heartbreak.jpg')"
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    }
  },
  plugins: []
}