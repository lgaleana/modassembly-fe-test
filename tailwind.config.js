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
        'deep-blue-start': '#003B5C',
        'deep-blue-end': '#005C8F',
        'green-accent': '#59D78F'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
        'orbit-pattern': 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 60%)'
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

