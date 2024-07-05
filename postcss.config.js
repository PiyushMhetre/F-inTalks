const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    new Dotenv(),
    require('tailwindcss'),
    require('autoprefixer')
  ]
};