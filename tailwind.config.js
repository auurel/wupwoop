/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F5A623',
          dark: '#E89010',
          light: '#FFB84D',
        },
        cream: {
          light: '#FFF8E7',
          DEFAULT: '#FDEBC4',
          peach: '#FFE5B4',
        },
        text: {
          dark: '#3D2817',
          body: '#4A3520',
        },
      },
      backgroundImage: {
        'gradient-about': 'linear-gradient(180deg, #F5A623 0%, #FFD494 50%, #FFF8E7 100%)',
      },
      fontSize: {
        'hero-lg': ['48px', { lineHeight: '1.2' }],
        'hero-md': ['32px', { lineHeight: '1.2' }],
        'section-lg': ['36px', { lineHeight: '1.2' }],
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(245, 166, 35, 0.1)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(245, 166, 35, 0.7)',
          },
          '50%': {
            boxShadow: '0 0 0 10px rgba(245, 166, 35, 0)',
          },
        },
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
};
