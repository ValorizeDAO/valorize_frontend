module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Helvetica", "sans-serif"],
      },
      screens: {
        "md+": "896px",
        "lg+": "1152px",
        "xl+": "1440px",
      },
      colors: {
        purple: {
          50: "#DAD1E9",
          100: "#C8BED9",
          200: "#B7ACCB",
          300: "#AA9DBF",
          400: "#8F80A7",
          500: "#8677A0",
          600: "#74648F",
          700: "#614F7F",
          800: "#4F3C6F",
          900: "#3D285F",
        },
        paper: {
          lighter: "#EFECE2",
          light: "#E9E3D0",
          default: "#E1D8B7",
          dark: "#D8CA9B",
          darker: "#E0D7D1",
        },
      },
    },
  },
  plugins: [],
}
