/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ateneoBlue: '#003A6C',      // Primary
        clearPrimary: '#77b6e6',    // Superficies
        primaryMedium: '#4982ad',   // Hovers
        arenaCalido: '#c4a57c',     // Accent
        fondoClaro: '#c2dbed',      // Background App
        superficie: '#6dacbf',      // Bordes/Tarjetas
      },
    },
  },
  plugins: [],
}