/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F5F1EA",
        ink: "#111111",
        orange: "#FA5400",
        green: "#6BA539",
        peach: "#FFE0CC",
        mute: "#8a8378",
        body: "#333333",
        line: "#DDD6CA",
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', '"Helvetica Neue"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
