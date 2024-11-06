/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      "./src/**/*.{js,ts,jsx,tsx}", // Adjust based on your project structure
   ],
   theme: {
      extend: {
         fontFamily: {
            lato: ["Lato", "sans-serif"], // Lägg till Lato som font
         },
         screens: {
            "custom-729": "729px",
            sm: "481px",
            //=> @media (min-width: 481px) for tablet

            md: "1201px",
            //=> @media (min-width: 1201px) for laptops

            lg: "1601px",
            //=> @mesia (min-width: 1601px) for desktops
         },
         colors: {
            "custom-bg": "#F5EEE6",
         },
      },
   },
   plugins: [],
};
