/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // fontSize: {
    //   sm: ['15px', '21px'],
    // },
    extend: {
      colors: {
        socialBg:'#F5F7FB',
        SocialBlue: '#218DFA',
      },
    },
  },
  plugins: [],
}

