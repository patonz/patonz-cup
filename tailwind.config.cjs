/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Barlow Condensed"', '"Arial Narrow"', 'Arial', 'sans-serif'],
        display: ['"Alfa Slab One"', 'Georgia', 'serif'],
      },
      colors: {
        paper: '#f3e9d2',
        ink: '#1a1a1a',
        cup: {
          red: '#d62828',
          green: '#1f7a3a',
          yellow: '#f7c600',
          blue: '#1d4e89',
        },
      },
    },
  },
  plugins: [],
};
