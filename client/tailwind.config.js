/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      screens: {
        'sm': '481px',  // Small screen for tablets
        'md': '1201px', // Medium screen for laptops
        'lg': '1601px', // Large screen for desktops
      },
      colors: {
        'custom-bg': "#F5EEE6",           
        'custom-primary': "#D13C1D",      
        'custom-secondary': "#DEDBD4",    
        'custom-severity-high': "#FF0000",
        'custom-gray': "#F5EEE6",                     
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],     
      }
    },
  },
  plugins: [],
};
