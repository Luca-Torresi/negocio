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
        },
        'secondary': {
          DEFAULT: '#6e9e6d',
          light: '#85AD85',
          dark: '#639362',
        }, 
        'tertiary': {
          DEFAULT: '#b65454',
          light: '#c27070',
          dark: '#AB4949', 
        },
        'toggleOn': '#6ACF68',        
        'toggleOff': '#EA6363'        
      },
    },
  },
  plugins: [],
}