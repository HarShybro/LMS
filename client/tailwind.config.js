

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./modal.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./onBroading/**/*.{js,jsx,ts,tsx}", "./onBroading.screen.{js,jsx,ts,tsx}", "./auth/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1e3a8a',
        'custom-green': '#10b981',
      },
    },
  },
  plugins: [],
}

