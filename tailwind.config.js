/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: 'rgb(var(--c-emerald-50) / <alpha-value>)',
          100: 'rgb(var(--c-emerald-100) / <alpha-value>)',
          200: 'rgb(var(--c-emerald-200) / <alpha-value>)',
          300: 'rgb(var(--c-emerald-300) / <alpha-value>)',
          400: 'rgb(var(--c-emerald-400) / <alpha-value>)',
          500: 'rgb(var(--c-emerald-500) / <alpha-value>)',
          600: 'rgb(var(--c-emerald-600) / <alpha-value>)',
          700: 'rgb(var(--c-emerald-700) / <alpha-value>)',
          800: 'rgb(var(--c-emerald-800) / <alpha-value>)',
          900: 'rgb(var(--c-emerald-900) / <alpha-value>)',
          950: 'rgb(var(--c-emerald-950) / <alpha-value>)',
        },
        teal: {
          50: 'rgb(var(--c-teal-50) / <alpha-value>)',
          100: 'rgb(var(--c-teal-100) / <alpha-value>)',
          200: 'rgb(var(--c-teal-200) / <alpha-value>)',
          300: 'rgb(var(--c-teal-300) / <alpha-value>)',
          400: 'rgb(var(--c-teal-400) / <alpha-value>)',
          500: 'rgb(var(--c-teal-500) / <alpha-value>)',
          600: 'rgb(var(--c-teal-600) / <alpha-value>)',
          700: 'rgb(var(--c-teal-700) / <alpha-value>)',
          800: 'rgb(var(--c-teal-800) / <alpha-value>)',
          900: 'rgb(var(--c-teal-900) / <alpha-value>)',
          950: 'rgb(var(--c-teal-950) / <alpha-value>)',
        },
      }
    },
  },
  plugins: [],
};
