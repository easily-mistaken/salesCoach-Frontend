import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'accent-blue': '#0284c7',
        'accent-teal': '#0d9488',
        navy: {
          '50': '#f0f5fa',
          '100': '#dce7f3',
          '200': '#b9d0e8',
          '300': '#8fb0d8',
          '400': '#6089c4',
          '500': '#4169b2',
          '600': '#355095',
          '700': '#2d4079',
          '800': '#1a1f2c',
          '900': '#161c2e',
          '950': '#0f111c',
        },
      },
    },
  },
  plugins: [],
}

export default config
