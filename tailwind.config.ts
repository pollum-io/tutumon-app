/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      colors: {
        neutral: {
          '50': '#E6FAFC', // mais claro
          '100': '#C3F5FA',
          '200': '#A1F0F8',
          '300': '#7FEBF6',
          '400': '#5DE6F4',
          '500': '#3BE1F2',
          '600': '#29C9DA',
          '700': '#1EB1C2',
          '800': '#1399AA',
          '850': '#0E8592',
          '900': '#07737A',
          '950': '#1cf8ef', // mais escuro
        },
        brand: {
          green: '#0FF089',
        },
      },
      backgroundImage: {
        'neutral-gradient': 'linear-gradient(to right, #E6FAFC, #1cf8ef)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
