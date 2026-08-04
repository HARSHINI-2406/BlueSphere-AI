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
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#020d1a', // Extremely deep ocean black-blue
        },
        teal: {
          50: '#f0fdfa',
          500: '#14b8a6',
          950: '#021e1a', // Deep kelp/marine black-green
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-highlight': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'ocean-gradient': 'radial-gradient(circle at center, #07263f 0%, #020d1a 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(15, 32, 67, 0.5) 0%, rgba(3, 17, 34, 0.8) 100%)',
      }
    },
  },
  plugins: [],
}
