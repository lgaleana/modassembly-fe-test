/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
        'neon-cyan': '#00f0ff',
        'neon-blue': '#0066ff',
        'deep-space': '#0f172a',
        'cyber-grid': '#1e293b'
      },
      boxShadow: {
        'neon-glow': '0 0 8px var(--tw-shadow-color), 0 0 16px var(--tw-shadow-color)',
        'neon-pulse': '0 0 8px var(--tw-shadow-color), 0 0 16px var(--tw-shadow-color), 0 0 24px var(--tw-shadow-color)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

