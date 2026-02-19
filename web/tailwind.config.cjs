module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1f2937',
          900: '#0f1724'
        },
        accent: {
          DEFAULT: '#111827'
        },
        brand: {
          DEFAULT: '#0ea5a4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        soft: '0 6px 18px rgba(16,24,40,0.06)'
      },
      borderRadius: {
        xl: '12px'
      }
    }
  },
  plugins: []
}
