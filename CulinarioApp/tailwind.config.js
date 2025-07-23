/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  // content: ["./app/**/*.{js,jsx,ts,tsx}"],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lightbackground: "#222222",
        darkbackground: "#161616",
        white: "#ffffff",
        primary: "#66A182",
        secondary: "#2D5151",
        info: "#CDDDD7",
        success: "#3CB94C",
        warning: "#F9CA38",
        danger: "#F7204C",
      },

      fontFamily: {
        montserratBold: ["MontserratBold"],
        robotoBold: ["RobotoBold"],
        robotoMedium: ["RobotoMedium"],
      },
    },
    
  },
  plugins: [],
}