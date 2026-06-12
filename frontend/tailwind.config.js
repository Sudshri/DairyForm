/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ── Brand Palette ────────────────────────────────────────────────
      colors: {
        // ── Dark Showcase Theme ──────────────────────────────────────
        d: {
          bg:     '#101722',  // page background
          card:   '#17202D',  // card / panel background
          input:  '#223041',  // input field background
          border: 'rgba(124,198,255,0.15)',
          muted:  '#8899AA',  // secondary text
          glass:  'rgba(23,32,45,0.80)',
        },
        accent: {
          DEFAULT: '#7CC6FF',
          dark:    '#5BAEE8',
          glow:    'rgba(124,198,255,0.25)',
        },
        dtext: {
          primary: '#F3F7FB',
          secondary: '#B8C8D8',
          muted:   '#8899AA',
        },
        sky: {
          50:  '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        cream: {
          50:  '#FFFEF9',
          100: '#FFFBF0',
          200: '#FEF6E4',
          300: '#FDE8C8',
          400: '#FBCF94',
          500: '#F6B55A',
        },
        milk: {
          pure:  '#FFFFFF',
          warm:  '#FEFEFE',
          soft:  '#F8FBFF',
          frost: '#EFF8FF',
        },
        gold: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
      },

      // ── Typography ───────────────────────────────────────────────────
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['Inter', 'ui-sans-serif', 'system-ui'],
        accent:  ['"DM Sans"', 'Inter', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        '7xl': ['4.5rem',  { lineHeight: '1.1' }],
        '8xl': ['6rem',    { lineHeight: '1.05' }],
        '9xl': ['8rem',    { lineHeight: '1' }],
      },

      // ── Spacing ───────────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },

      // ── Border Radius ─────────────────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },

      // ── Shadows ───────────────────────────────────────────────────────
      boxShadow: {
        'glass':       '0 8px 32px rgba(14, 165, 233, 0.10), 0 1px 0 rgba(255,255,255,0.8) inset',
        'glass-lg':    '0 16px 48px rgba(14, 165, 233, 0.15), 0 1px 0 rgba(255,255,255,0.9) inset',
        'glass-xl':    '0 24px 64px rgba(14, 165, 233, 0.18)',
        'soft':        '0 2px 16px rgba(14, 165, 233, 0.08)',
        'soft-md':     '0 4px 24px rgba(14, 165, 233, 0.12)',
        'soft-lg':     '0 8px 40px rgba(14, 165, 233, 0.16)',
        'soft-xl':     '0 20px 60px rgba(14, 165, 233, 0.20)',
        'cream':       '0 4px 24px rgba(251, 207, 148, 0.25)',
        'gold':        '0 4px 20px rgba(251, 191, 36, 0.30)',
        'inner-soft':  'inset 0 2px 8px rgba(14, 165, 233, 0.08)',
        'card':        '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(14, 165, 233, 0.08)',
        'card-hover':  '0 4px 12px rgba(0,0,0,0.06), 0 16px 48px rgba(14, 165, 233, 0.16)',
        'none':        'none',
      },

      // ── Backdrop Blur ─────────────────────────────────────────────────
      backdropBlur: {
        xs:  '2px',
        sm:  '4px',
        md:  '8px',
        lg:  '16px',
        xl:  '24px',
        '2xl': '40px',
      },

      // ── Gradients (via bg-gradient-*) ────────────────────────────────
      backgroundImage: {
        'dairy-hero':    'radial-gradient(ellipse 80% 60% at 50% -10%, #BAE6FD 0%, #F0F9FF 40%, #FFFFFF 70%)',
        'blue-cream':     'linear-gradient(135deg, #EFF8FF 0%, #FFFBF0 100%)',
        'glass-shine':   'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)',
        'blue-fade':      'linear-gradient(180deg, #E0F2FE 0%, #F0F9FF 50%, #FFFFFF 100%)',
        'cream-fade':    'linear-gradient(180deg, #FFFBF0 0%, #FFFFFF 100%)',
        'product-bg':    'radial-gradient(ellipse at top, #F0F9FF, #FFFFFF)',
        'hero-glow':     'radial-gradient(ellipse 60% 50% at 70% 40%, rgba(56,189,248,0.2) 0%, transparent 60%)',
        'milk-wave':     'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 60%, #FFFFFF 100%)',
        'cta-gradient':  'linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #38BDF8 100%)',
        'shimmer':       'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
      },

      // ── Animations ───────────────────────────────────────────────────
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'float-fast':   'float 3.5s ease-in-out infinite',
        'wave':         'wave 8s linear infinite',
        'wave-reverse': 'wave 12s linear infinite reverse',
        'liquid':       'liquid 4s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'blob':         'blob 10s ease-in-out infinite',
        'slide-up':     'slideUp 0.5s ease-out',
        'slide-down':   'slideDown 0.4s ease-out',
        'fade-in':      'fadeIn 0.4s ease-out',
        'scale-in':     'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        'bounce-soft':  'bounceSoft 2s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
        'marquee':      'marquee 30s linear infinite',
        'drop-fall':    'dropFall 1.2s ease-in infinite',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        wave: {
          '0%':   { transform: 'translateX(0) translateZ(0) scaleY(1)' },
          '50%':  { transform: 'translateX(-25%) translateZ(0) scaleY(0.85)' },
          '100%': { transform: 'translateX(-50%) translateZ(0) scaleY(1)' },
        },
        liquid: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%':      { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14,165,233,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(14,165,233,0.6), 0 0 80px rgba(14,165,233,0.2)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%':      { transform: 'translate(30px,-50px) scale(1.1)' },
          '66%':      { transform: 'translate(-20px,20px) scale(0.9)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        dropFall: {
          '0%':   { transform: 'translateY(-20px) scale(0.8)', opacity: '0' },
          '30%':  { opacity: '1' },
          '80%':  { transform: 'translateY(60px) scale(1)', opacity: '0.6' },
          '100%': { transform: 'translateY(80px) scale(0.6)', opacity: '0' },
        },
      },

      // ── Transitions ───────────────────────────────────────────────────
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth':     'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring':     'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
    },
  },
  plugins: [],
};
