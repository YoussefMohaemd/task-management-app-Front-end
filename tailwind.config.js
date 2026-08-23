/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        /* Dark surfaces — deep navy hierarchy */
        night: {
          950: '#070C16',
          900: '#080E1A', // page background
          850: '#0A1020', // navbar
          800: '#0C1422', // table surface
          750: '#0E1626', // cards
          700: '#121B2D', // elevated / hover
          600: '#152136', // active / pressed
        },
        /* Borders */
        line: {
          DEFAULT: '#E3E9F2', // light mode hairline
          strong: '#D2DBE8', // light mode hover border
          dark: '#1D2A3B', // dark mode hairline
          'dark-strong': '#28374E', // dark mode hover border
        },
        /* Typography — theme-aware via CSS vars (see index.css).
           Each token resolves to its light value on :root and its dark
           value under .dark, so `text-ink-*` is always valid in both themes. */
        ink: {
          heading: 'rgb(var(--ink-heading) / <alpha-value>)',
          body: 'rgb(var(--ink-body) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
          DEFAULT: '#E6EDF7', // dark primary text (used with dark: prefix)
          soft: '#C4D0E0', // dark emphasized body (used with dark: prefix)
        },
        /* Primary accent — cyan / sky */
        accent: {
          50: '#EBFAFF',
          100: '#D5F3FE',
          200: '#AFE7FD',
          300: '#7DD9FB',
          DEFAULT: '#67D5FF',
          400: '#67D5FF',
          500: '#38BEF5',
          600: '#0EA5E9',
          700: '#0284C7',
          800: '#036AA1',
        },
        /* Danger — overdue */
        danger: {
          DEFAULT: '#FF5B5B',
          50: '#FFF1F1',
          100: '#FFE0E0',
          200: '#FFC7C7',
          300: '#FF8F8F',
          400: '#FF7373',
          500: '#FF5B5B',
          600: '#F43F3F',
          700: '#DC2626',
        },
      },
      boxShadow: {
        card:
          '0 1px 2px 0 rgb(16 27 45 / 0.05), 0 2px 8px -2px rgb(16 27 45 / 0.06)',
        'card-hover':
          '0 2px 4px 0 rgb(16 27 45 / 0.06), 0 10px 24px -8px rgb(2 132 199 / 0.22)',
        panel:
          '0 24px 60px -12px rgb(4 10 20 / 0.35), 0 0 0 1px rgb(29 42 59 / 0.35)',
        'panel-light': '0 24px 60px -16px rgb(16 27 45 / 0.25)',
        'glow-accent': '0 6px 24px -6px rgb(103 213 255 / 0.55)',
        'glow-danger': '0 6px 20px -8px rgb(255 91 91 / 0.45)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97) translateY(6px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(-10px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out both',
        'fade-up': 'fade-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) both',
        'toast-in': 'toast-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
