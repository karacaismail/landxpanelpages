import type { Config } from 'tailwindcss';
import flowbite from 'flowbite-react/tailwind';

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    flowbite.content()
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      colors: {
        // CSS variable aliases — match _colors.scss
        'fg-1': 'var(--fg-1)',
        'fg-2': 'var(--fg-2)',
        'fg-3': 'var(--fg-3)',
        'fg-4': 'var(--fg-4)',
        'bg-1': 'var(--bg-1)',
        'bg-2': 'var(--bg-2)',
        'bg-3': 'var(--bg-3)',
        'bg-4': 'var(--bg-4)',
        brand: {
          DEFAULT: '#0e7c61',
          50:  '#e6f4ee',
          100: '#c8e9d8',
          200: '#9ed5b9',
          300: '#6dbc99',
          400: '#3fa07c',
          500: '#0e7c61',
          600: '#0a6552',
          700: '#08503f',
          800: '#073e30',
          900: '#052a22'
        },
        accent: {
          DEFAULT: '#c97f1d',
          50:  '#fbf2e4',
          100: '#f5dfbf',
          200: '#ecc488',
          300: '#e2a85b',
          400: '#d6912f',
          500: '#c97f1d',
          600: '#a76414',
          700: '#824d10',
          800: '#5e370b',
          900: '#3a2207'
        }
      },
      screens: {
        xxs: '320px',
        xs:  '375px',
        sm:  '480px',
        md:  '600px',
        lg:  '768px',
        xl:  '1024px',
        '2xl': '1366px',
        '3xl': '1600px',
        tv:   '2560px'
      },
      borderRadius: {
        'r-1': '4px',
        'r-2': '8px',
        'r-3': '12px',
        'r-4': '16px'
      }
    }
  },
  plugins: [flowbite.plugin()]
} satisfies Config;
