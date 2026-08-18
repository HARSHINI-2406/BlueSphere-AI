/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#040f1a', // darkest navy text (high contrast)
          100: '#081a29', // deep navy headings text
          200: '#122d42', // primary text
          300: '#22445c', // subtitle text
          400: '#335d75', // secondary readable text
          500: '#5a839c', // muted text
          600: '#7ca3bb', // lighter slate text
          700: '#bcd8e6', // soft border/divider
          800: '#d4e8f1', // light border/outline
          850: '#e6f2f7', // light background for nested elements
          900: '#ffffff', // pure white card background
          950: '#f3f8fa', // Alice Blue layout background
        },
        ocean: {
          50: '#f0fbfd',
          100: '#e0f4f7',
          200: '#bce2e8',
          300: '#8cccd9',
          400: '#5eb3c8',
          500: '#41a3bc',
          600: '#2d8499',
          700: '#206375',
          800: '#154854',
          900: '#0c2d36',
          950: '#f0f7f9', // light off-white ocean background
        },
        teal: {
          50: '#f0fdfa',
          500: '#14b8a6',
          950: '#f0f7f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 35, 60, 0.08)',
        'glass-highlight': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
      },
      backgroundImage: {
        'ocean-gradient': 'radial-gradient(circle at center, #f0fbfc 0%, #e2eff5 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.9) 100%)',
      }
    },
  },
  plugins: [],
}
