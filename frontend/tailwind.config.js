/** @type {import('tailwindcss').Config} */
const flowbite = require('flowbite/plugin');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}' // Include Flowbite components
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite // Add Flowbite as a plugin
  ],
};
