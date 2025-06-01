/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/react/utils/withMT';

export default withMT({
  content: ['./src/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'black',
        secondary: 'white',
        tertiary: '#1e88e5',
        background: 'rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        alexio: ['Alexio-Regular', 'sans-serif'],
        amedium: ['Alexio-Medium', 'sans-serif'],
        abold: ['Alexio-Bold', 'sans-serif'],
        asemibold: ['Alexio-SemiBold', 'sans-serif'],
      },
    }
  },
  variants: {
    extend: {},
    fontFamily: {
      sans: ['Alexio-Regular', 'ui-sans-serif', 'system-ui']
    }
  },
  plugins: []
});