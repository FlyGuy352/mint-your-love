/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lighterPink: '#FFF7F8',
        crimsonRed: '#DC143C',
        darkRed: '#8B0000',
        darkPink: '#E75480',
        lightSkyBlue: '#CDECFF',
        lightPink: '#FFC0CB'
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
      'hero': "url('/assets/images/wedding.jpg')",
      'heartbreak': "url('/assets/images/heartbreak.jpg')",
      'heartbreak_2': "url('/assets/images/heartbreak_2.jpg')",
      'success': 'linear-gradient(to top left, #B0F3F1, #FFCFDF)'
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