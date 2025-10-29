/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          onyx: '#33393F',
          green: '#8FBD44',
          gray: '#969798',
          blue: '#2354B8',
          cerise: '#DE3464',
        },
      },
      fontFamily: {
        aeonik: ['Aeonik', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'conic-gradient(from 135deg, #8FBD44 0deg, #2354B8 120deg, #DE3464 240deg, #969798 320deg, #8FBD44 360deg)',
      },
    },
  },
  plugins: [],
};
