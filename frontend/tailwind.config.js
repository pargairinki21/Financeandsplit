/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom theme colors - white, green, orange, blue, black
        primary: {
          50: '#f0fdf4',   // light green
          100: '#dcfce7',  // lighter green
          200: '#bbf7d0',  // green
          300: '#86efac',  // medium green
          400: '#4ade80',  // main green
          500: '#22c55e',  // darker green
          600: '#16a34a',  // dark green
          700: '#15803d',  // very dark green
          800: '#166534',  // darkest green
          900: '#14532d',  // black-green
        },
        accent: {
          50: '#fff7ed',   // light orange
          100: '#ffedd5',  // lighter orange
          200: '#fed7aa',  // orange
          300: '#fdba74',  // medium orange
          400: '#fb923c',  // main orange
          500: '#f97316',  // darker orange
          600: '#ea580c',  // dark orange
          700: '#c2410c',  // very dark orange
          800: '#9a3412',  // darkest orange
          900: '#7c2d12',  // black-orange
        },
        info: {
          50: '#eff6ff',   // light blue
          100: '#dbeafe',  // lighter blue
          200: '#bfdbfe',  // blue
          300: '#93c5fd',  // medium blue
          400: '#60a5fa',  // main blue
          500: '#3b82f6',  // darker blue
          600: '#2563eb',  // dark blue
          700: '#1d4ed8',  // very dark blue
          800: '#1e40af',  // darkest blue
          900: '#1e3a8a',  // black-blue
        },
        // Glass effect colors
        glass: {
          50: 'rgba(255, 255, 255, 0.1)',
          100: 'rgba(255, 255, 255, 0.2)',
          200: 'rgba(255, 255, 255, 0.3)',
          300: 'rgba(255, 255, 255, 0.4)',
          400: 'rgba(255, 255, 255, 0.5)',
          500: 'rgba(255, 255, 255, 0.6)',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        purple: {
          400: '#a855f7',
          500: '#9333ea',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        dark: {
          100: '#1e293b',
          200: '#0f172a',
          300: '#020617',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'hover-lift': 'hoverLift 0.3s ease-out',
        'hover-glow': 'hoverGlow 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        hoverLift: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-8px) scale(1.02)' },
        },
        hoverGlow: {
          '0%': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
          '100%': { boxShadow: '0 20px 25px -5px rgba(34, 197, 94, 0.3), 0 10px 10px -5px rgba(251, 146, 60, 0.2)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}
