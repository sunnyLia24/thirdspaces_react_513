/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF3B7F",
        secondary: "#764AF1",
        background: {
          light: "#F5F5F7",
          dark: "#121212",
        },
        text: {
          light: "#121212",
          dark: "#F5F5F7",
        }
      }
    },
  },
  plugins: [],
} 