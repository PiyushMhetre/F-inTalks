module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        'mobile': '320px',
        'tablet': '640px',
        'laptop': '1024px',
        'desktop': '1280px',
      },
      colors: {
        customGray: '#F3F6FB',
        slidecolor: 'rgba(57, 57, 57, 0.5)',
      },
    },
  },
  variants: {
    extend: {
      fontSize: ['responsive'], // Enable responsive variants for font size
    },
  },
  plugins: [],
};
