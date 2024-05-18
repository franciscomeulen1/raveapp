/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  // configuracion para el punto de quiebre de tamanio lg mas pequenio
  theme: {
    extend: {
      screens: {
        'lg-min': {'min': '1024px', 'max': '1279px'},
      },
    },
  },
  variants: {},
}
