/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6f61', 
        secondary: '#34495e',
        background: '#f9f9f9', 
        hoverBg: '#ff856f', 
        hoverText: '#ffffff',
        activeBg: '#ff3e3e',
        shadow: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
