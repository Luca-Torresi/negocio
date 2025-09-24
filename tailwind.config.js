/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#3e57a3',
          light: '#5c76c1',
          dark: '#324785',
          darker: '#273768',
        },
        'secondary': {
          DEFAULT: '#6e9e6d',
          light: '#85AD85',
          dark: '#639362',
          darker: '#527A52',
        }, 
        'tertiary': {
          DEFAULT: '#b65454',
          light: '#c27070',
          dark: '#AB4949', 
          darker: '#8F3D3D',
        },
        'toggleOn': '#5ed387',        
        'toggleOff': '#ff6666'        
      },
      fontFamily: {
        'akaya': ['"Akaya Kanadaka"', 'cursive'],
        'delius': ['"Delius Unicase"', 'cursive'],
        'dynapuff': ['"DynaPuff"', 'sans-serif'],
        'mogra': ['"Mogra"', 'cursive'],
        'pacifico': ['"Pacifico"', 'cursive'],
      },
    },
  },
  plugins: [],
}