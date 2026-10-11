/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="clay-dark"]'],
  theme: {
    extend: {
      colors: {
        clay: {
          bg: 'var(--clay-bg)',
          surface: 'var(--clay-surface)',
          text: 'var(--clay-text)',
          muted: 'var(--clay-text-muted)',
          border: 'var(--clay-border)',
          accent: 'var(--clay-accent)',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'clay': '12px 16px 28px var(--clay-shadow-dark), -10px -10px 24px var(--clay-shadow-light), inset 2px 2px 4px var(--clay-inner-light), inset -3px -3px 6px var(--clay-inner-dark)',
        'clay-sm': '6px 8px 16px var(--clay-shadow-dark), -6px -6px 14px var(--clay-shadow-light), inset 1px 1px 2px var(--clay-inner-light), inset -2px -2px 4px var(--clay-inner-dark)',
        'clay-lg': '18px 24px 36px var(--clay-shadow-dark), -14px -14px 30px var(--clay-shadow-light), inset 3px 3px 6px var(--clay-inner-light), inset -4px -4px 8px var(--clay-inner-dark)',
        'clay-inset': 'inset 4px 4px 8px var(--clay-shadow-dark), inset -4px -4px 8px var(--clay-shadow-light), 1px 1px 2px var(--clay-inner-light)',
      },
    },
  },
  plugins: [],
};
