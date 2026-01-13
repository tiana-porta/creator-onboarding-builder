/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        accent: '#FA4616',
        dark: '#000000',
        light: '#FCF6F5',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
