/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: '#2E3A24',
        gold: '#FFD700',
        beige: '#F5F5DC',
        'slate-gray': '#2F4F4F',
        'green-dark': '#2E3A24',
        'beige-light': '#F5F5DC',
        'slate-dark': '#2F4F4F',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
