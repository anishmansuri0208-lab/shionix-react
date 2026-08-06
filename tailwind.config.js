/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { 500: '#0066FF', 600: '#0052cc', 700: '#0040a0' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        fadeIn:   { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp:  { from:{ opacity:0, transform:'translateY(20px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        skeleton: { '0%,100%':{ opacity:1 }, '50%':{ opacity:0.4 } },
        marquee:  { '0%':{ transform:'translateX(0)' }, '100%':{ transform:'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
