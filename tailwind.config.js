/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        action: '#EFC130',
        pageBg: '#FDFDFD',
        secondaryBg: '#FFF9E6',
        buttonBg: '#2D5A7B',
      },
    },
  },
  plugins: [],
};
