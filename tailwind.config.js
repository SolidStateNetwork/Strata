/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        strata: {
          bg: "#090A0F",
          surface: "#11131C",
          card: "#171A26",
          border: "#232738",
          accent: "#6366F1",
        },
      },
    },
  },
  plugins: [],
};
