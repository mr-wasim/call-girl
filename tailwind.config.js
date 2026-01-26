module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#d79c18',
          dark: '#b27e12'
        },
        pagebg: '#2b2b2b'
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif']
      }
    }
  },
  plugins: []
}
