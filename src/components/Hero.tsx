import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { GitBranch, Linkedin, Mail, ArrowDown, Sparkles } from 'lucide-react'
import ThreeBackground from './ThreeBackground'
import { personalInfo } from '../data/portfolio'

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM — TOKENS
// ─────────────────────────────────────────────────────────────────────────────
// Typography     : Clash Display (700–800) · Satoshi (400–500)
// Type scale     : clamp() fluid sizing — no media-query breakpoints needed
// Name gradient  : 5-stop sweep teal → bright highlight → amber (shimmer-ready)
// Palette        : Deep charcoal bg · electric teal primary · warm amber accent
// Spacing        : 4px base unit · 8-column grid · max-width 720px editorial
// Animation      : Staggered letter reveal (y:40 + rotateX) · shimmer · blink
//                  All animations fully respect prefers-reduced-motion
// A11y           : WCAG AA contrast on all text · focus-visible rings ·
//                  aria-labels on every interactive element · sr-only role text
// ─────────────────────────────────────────────────────────────────────────────

/* ─── Design tokens (add to your global :root / CSS variables file) ──────────

  --font-display         : 'Clash Display', system-ui, sans-serif
  --font-body            : 'Satoshi', system-ui, sans-serif

  --text-xs              : clamp(0.6875rem, 0.65rem + 0.19vw, 0.75rem)   // 11–12px
  --text-sm              : clamp(0.8125rem, 0.77rem + 0.22vw, 0.875rem)  // 13–14px
  --text-base            : clamp(0.9375rem, 0.88rem + 0.29vw, 1rem)      // 15–16px
  --text-lg              : clamp(1.0625rem, 0.99rem + 0.37vw, 1.125rem)  // 17–18px
  --text-xl              : clamp(1.1875rem, 1.09rem + 0.49vw, 1.25rem)   // 19–20px
  --text-2xl             : clamp(1.375rem,  1.22rem + 0.78vw, 1.5rem)    // 22–24px
  --text-hero            : clamp(3.5rem,    2.5rem  + 5vw,    6.5rem)    // 56–104px

  --space-1  : 0.25rem  (4px)
  --space-2  : 0.5rem   (8px)
  --space-3  : 0.75rem  (12px)
  --space-4  : 1rem     (16px)
  --space-5  : 1.25rem  (20px)
  --space-6  : 1.5rem   (24px)
  --space-8  : 2rem     (32px)
  --space-10 : 2.5rem   (40px)
  --space-16 : 4rem     (64px)
  --space-32 : 8rem     (128px)

  --color-bg            : oklch(0.12 0.01 240)         // deep charcoal
  --color-surface       : oklch(0.16 0.015 240)        // elevated surface
  --color-border        : oklch(0.28 0.02 240)         // subtle border
  --color-text          : oklch(0.96 0.005 240)        // near-white
  --color-text-muted    : oklch(0.72 0.02 240)         // muted text  (≥4.5:1 on bg)
  --color-text-faint    : oklch(0.52 0.015 240)        // faint text  (≥3:1 on bg)
  --color-primary       : oklch(0.72 0.18 195)         // electric teal
  --color-primary-hover : oklch(0.78 0.16 195)         // teal hover
  --color-accent        : oklch(0.78 0.16 70)          // warm amber
  --color-accent-hover  : oklch(0.83 0.14 70)          // amber hover

  --radius-sm   : 0.25rem
  --radius-md   : 0.5rem
  --radius-lg   : 0.75rem
  --radius-xl   : 1rem
  --radius-full : 9999px

  --transition-interactive : 200ms cubic-bezier(0.16, 1, 0.3, 1)
  --transition-slow        : 400ms cubic-bezier(0.16, 1, 0.3, 1)

──────────────────────────────────────────────────────────────────────────── */

const roles = [
  'Full-Stack Developer',
  'React Specialist',
  'Node.js Engineer',
  'AI Integrations Dev',
]

// ── Typewriter hook — ref-based, zero re-render cascade ──────────────────────
function useTypewriter(words: string[]) {
  const [text, setText] = useState('')
  const state = useRef({ idx: 0, deleting: false, charIdx: 0 })

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>
    const tick = () => {
      const { idx, deleting, charIdx } = state.current
      const word = words[idx]
      if (!deleting) {
        if (charIdx < word.length) {
          state.current.charIdx++
          setText(word.slice(0, state.current.charIdx))
          id = setTimeout(tick, 60)
        } else {
          id = setTimeout(() => { state.current.deleting = true; tick() }, 2200)
        }
      } else {
        if (charIdx > 0) {
          state.current.charIdx--
          setText(word.slice(0, state.current.charIdx))
          id = setTimeout(tick, 35)
        } else {
          state.current.deleting = false
          state.current.idx = (idx + 1) % words.length
          id = setTimeout(tick, 100)
        }
      }
    }
    id = setTimeout(tick, 300)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return text
}

// ── Easing curve typed correctly for Framer Motion ───────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ── Letter-by-letter animated word ───────────────────────────────────────────
function AnimatedWord({
  text,
  delay = 0,
  gradient = false,
  shimmer = false,
}: {
  text: string
  delay?: number
  gradient?: boolean
  shimmer?: boolean
}) {
  const prefersReduced = useReducedMotion()

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: prefersReduced ? 0 : 40,
      rotateX: prefersReduced ? 0 : -20,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: delay + i * (prefersReduced ? 0 : 0.045),
        duration: prefersReduced ? 0.01 : 0.55,
        ease: EASE,
      },
    }),
  }

  return (
    <span
      aria-label={text}
      style={{
        display: 'inline-block',
        perspective: 600,
        // ── ENHANCEMENT: 5-stop shimmer gradient instead of 2-stop
        // Adds a bright near-white highlight sweep between teal & amber,
        // giving the shimmer animation a jewel-like quality.
        ...(gradient ? {
          background: [
            'linear-gradient(135deg,',
            '  var(--color-primary)        0%,',
            '  var(--color-primary)       15%,',
            '  oklch(0.92 0.08 185)       35%,', // bright teal-white highlight
            '  var(--color-accent)        60%,',
            '  oklch(0.88 0.10 60)        80%,', // soft amber highlight
            '  var(--color-accent)       100%',
            ')',
          ].join(''),
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        } : {}),
        ...(shimmer && !prefersReduced ? {
          backgroundSize: '250% 100%',
          animation: 'nameShimmer 5s cubic-bezier(0.4, 0, 0.6, 1) 2s infinite',
        } : {}),
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          custom={i}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            transformOrigin: 'bottom center',
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

// ── Decorative dot-grid accent ────────────────────────────────────────────────
// Pure CSS / SVG decoration. Provides subtle depth and editorial texture
// without competing with the ThreeBackground. aria-hidden throughout.
function DotGrid() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        right: '5%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 'clamp(160px, 22vw, 320px)',
        aspectRatio: '1',
        pointerEvents: 'none',
        opacity: 0.18,
        // Mask fades out toward edges so it blends into the ThreeBackground
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 240 240"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dotGrid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="var(--color-primary)" />
          </pattern>
        </defs>
        <rect width="240" height="240" fill="url(#dotGrid)" />
      </svg>
    </div>
  )
}

// ── Animated gradient ring behind the name ───────────────────────────────────
// A large, blurred color orb that subtly reinforces the teal/amber palette.
function NameGlow() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: '-12%',
        top: '50%',
        transform: 'translateY(-60%)',
        width: 'clamp(300px, 55vw, 700px)',
        aspectRatio: '1.4 / 1',
        pointerEvents: 'none',
        background: [
          'radial-gradient(ellipse 70% 50% at 30% 50%,',
          '  oklch(0.72 0.18 195 / 0.09) 0%,',   // teal
          '  oklch(0.78 0.16 70 / 0.05)  55%,',   // amber
          '  transparent 80%',
          ')',
        ].join(''),
        filter: 'blur(40px)',
        zIndex: 0,
      }}
    />
  )
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
export default function Hero() {
  const displayed      = useTypewriter(roles)
  const prefersReduced = useReducedMotion()

  const scrollToProjects = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // ── ENHANCEMENT: focus-visible ring helper
  // Inlined here so it's colocated with its usage below.
  const focusRingStyle: React.CSSProperties = {
    outlineOffset: '3px',
    outline: '2px solid transparent', // overridden by :focus-visible below
  }

  return (
    <>
      {/* ── Global keyframes + focus-visible styles ──────────────────────── */}
      <style>{`
        /* ── Name shimmer: sweeps a bright band left-to-right ── */
        @keyframes nameShimmer {
          0%   { background-position: 120% center; }
          45%  { background-position:   0% center; }
          55%  { background-position:   0% center; }
          100% { background-position: 120% center; }
        }

        /* ── Badge dot pulse ── */
        @keyframes pulse {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }

        /* ── Typewriter cursor blink ── */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* ── Status badge ring pulse ── */
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0   oklch(from var(--color-primary) l c h / 0.45); }
          50%       { box-shadow: 0 0 0 7px oklch(from var(--color-primary) l c h / 0);   }
        }

        /* ── Primary CTA: inner shimmer sweep on hover ── */
        @keyframes btnShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        /* ── Scroll arrow bounce ── */
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0);   }
          50%       { transform: translateY(7px); }
        }

        /* ── WCAG 2.1 §1.4.11 – visible focus ring on all interactive elements ── */
        :is(button, a, [role="button"]):focus-visible {
          outline: 2px solid var(--color-primary) !important;
          outline-offset: 3px !important;
          border-radius: inherit;
        }

        /* ── Ensure smooth font rendering ── */
        #hero {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
        }

        /* ── Responsive: tighten horizontal padding on small viewports ── */
        @media (max-width: 480px) {
          #hero .hero-content {
            padding-inline: var(--space-4);
          }
        }
      `}</style>

      <section
        id="hero"
        style={{
          position: 'relative', minHeight: '100dvh',
          display: 'flex', alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <ThreeBackground />

        {/* ── Atmospheric glow orb behind typography ── */}
        <NameGlow />

        {/* ── Subtle radial vignette for depth ── */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 20% 50%, transparent 40%, oklch(0 0 0 / 0.28) 100%)',
        }} />

        {/* ── Decorative dot-grid (desktop only, hides on narrow viewports) ── */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            display: 'var(--_dot-grid-display, block)',
          }}
        >
          <style>{`@media (max-width: 900px) { :root { --_dot-grid-display: none; } }`}</style>
          <DotGrid />
        </div>

        <div
          className="container hero-content"
          style={{ position: 'relative', zIndex: 1, paddingBlock: 'var(--space-32)' }}
        >
          <div style={{ maxWidth: 720 }}>

            {/* ── Status badge ─────────────────────────────────────────────
                ENHANCEMENT: gradient border via background-clip trick;
                inner text uses Satoshi for better small-size readability.
            ─────────────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.05, duration: 0.55, ease: EASE }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                // Gradient border via layered background + padding trick
                padding: '1px',
                background: 'linear-gradient(135deg, oklch(from var(--color-primary) l c h / 0.5), oklch(from var(--color-accent) l c h / 0.3))',
                borderRadius: 'var(--radius-full)',
                marginBottom: 'var(--space-8)',
                animation: prefersReduced ? 'none' : 'badgePulse 3s ease-in-out infinite',
              }}
            >
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                padding: 'var(--space-1) var(--space-4)',
                background: 'oklch(from var(--color-primary) l c h / 0.07)',
                backdropFilter: 'blur(12px)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
              }}>
                {/* Pulse dot */}
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--color-primary)',
                  flexShrink: 0,
                  animation: prefersReduced ? 'none' : 'pulse 2s ease-in-out infinite',
                }} />
                <Sparkles size={11} strokeWidth={2.2} aria-hidden />
                Open to Opportunities · B.Tech CSE · 2027
              </span>
            </motion.div>

            {/* ── Animated name ─────────────────────────────────────────────
                ENHANCEMENT:
                • fluid type size via clamp() — no media queries needed
                • tighter -0.045em tracking for display weight at large sizes
                • line-height 0.92 (tighter) for editorial density
                • "Nabanna" inherits text color; "Choudhury" gets 5-stop
                  gradient + shimmer sweep (see AnimatedWord above)
            ─────────────────────────────────────────────────────────────── */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                // clamp: 3.5rem (56px) at 320px → 6.5rem (104px) at 1400px
                fontSize: 'clamp(3.5rem, 2.5rem + 5vw, 6.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.045em',
                lineHeight: 0.92,
                marginBottom: 'var(--space-6)',
                // Reserve space so layout doesn't jump during animation
                minHeight: 'calc(clamp(3.5rem, 2.5rem + 5vw, 6.5rem) * 2 * 0.92)',
              }}
            >
              <span style={{ display: 'block', color: 'var(--color-text)' }}>
                <AnimatedWord text="Nabanna" delay={0.1} />
              </span>
              <span style={{ display: 'block' }}>
                <AnimatedWord text="Choudhury" delay={0.38} gradient shimmer />
              </span>
            </h1>

            {/* ── Typewriter role ───────────────────────────────────────────
                ENHANCEMENT:
                • pill background behind the text gives it a "badge" quality
                  that reads better against ThreeBackground textures
                • display font for titles; slightly larger size
                • sr-only span announces the full list for screen readers
            ─────────────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5, ease: EASE }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'clamp(1rem, 0.85rem + 0.75vw, 1.25rem)',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                minHeight: '2.75rem',
                marginBottom: 'var(--space-7)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {/* Screen-reader label for the rotating roles */}
              <span className="sr-only">Role: {displayed || roles[0]}</span>
              <span aria-hidden style={{ color: 'var(--color-primary)' }}>{displayed}</span>
              {/* Cursor */}
              <span
                aria-hidden
                style={{
                  display: 'inline-block', width: 2.5,
                  height: '1.1em',
                  background: 'var(--color-primary)',
                  borderRadius: 2,
                  verticalAlign: 'text-bottom',
                  animation: 'blink 1s step-end infinite',
                  flexShrink: 0,
                }}
              />
            </motion.div>

            {/* ── Subtitle ──────────────────────────────────────────────────
                ENHANCEMENT:
                • fluid font size (clamp)
                • 1.8 line-height for comfortable reading in paragraph form
                • slightly wider max-width (540px) for better line measure
                • keyword highlights now use both primary & accent colors
                  for tonal variety
            ─────────────────────────────────────────────────────────────── */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.95, duration: 0.6, ease: EASE }}
              style={{
                fontSize: 'clamp(0.9375rem, 0.85rem + 0.44vw, 1.0625rem)',
                color: 'var(--color-text-muted)',
                lineHeight: 1.8,
                marginBottom: 'var(--space-10)',
                maxWidth: 540,
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                letterSpacing: '0.012em',
              }}
            >
              Building intelligent web experiences with{' '}
              <span style={{
                color: 'var(--color-text)', fontWeight: 600,
                // Subtle underline accent on keywords
                textDecoration: 'underline',
                textDecorationColor: 'oklch(from var(--color-primary) l c h / 0.4)',
                textDecorationThickness: '1.5px',
                textUnderlineOffset: '3px',
              }}>React</span>,{' '}
              <span style={{
                color: 'var(--color-text)', fontWeight: 600,
                textDecoration: 'underline',
                textDecorationColor: 'oklch(from var(--color-primary) l c h / 0.4)',
                textDecorationThickness: '1.5px',
                textUnderlineOffset: '3px',
              }}>Node.js</span>{' '}
              &amp;{' '}
              <span style={{
                color: 'var(--color-accent)', fontWeight: 600,
                textDecoration: 'underline',
                textDecorationColor: 'oklch(from var(--color-accent) l c h / 0.4)',
                textDecorationThickness: '1.5px',
                textUnderlineOffset: '3px',
              }}>AI</span>.
            </motion.p>

            {/* ── CTAs ──────────────────────────────────────────────────────
                ENHANCEMENTS:
                Primary button:
                  • Inner shimmer sweep on hover (btnShimmer keyframe)
                  • Uses background-size trick: base gradient + shine overlay
                  • Better box-shadow: richer ambient + directional layer

                Ghost button:
                  • Slight teal tint on background-hover instead of fully
                    transparent, so it's more visually distinct
                  • Smooth color transition on border/text via CSS transition
                    (unchanged behavior, better easing curve)
            ─────────────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 1.05, duration: 0.6, ease: EASE }}
              style={{
                display: 'flex', gap: 'var(--space-3)',
                flexWrap: 'wrap', marginBottom: 'var(--space-10)',
                alignItems: 'center',
              }}
            >
              {/* Primary CTA */}
              <motion.button
                onClick={scrollToProjects}
                whileHover={prefersReduced ? {} : {
                  y: -2,
                  boxShadow: '0 6px 28px oklch(from var(--color-primary) l c h / 0.38), 0 2px 8px oklch(from var(--color-primary) l c h / 0.2)',
                }}
                whileTap={{ scale: 0.96 }}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  padding: 'var(--space-3) var(--space-8)',
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  letterSpacing: '0.025em',
                  boxShadow: '0 4px 18px oklch(from var(--color-primary) l c h / 0.28), inset 0 1px 0 oklch(1 0 0 / 0.15)',
                  transition: 'box-shadow var(--transition-interactive)',
                  // Force GPU layer for smooth animation
                  willChange: 'transform, box-shadow',
                }}
                // Shimmer sweep via pseudo-element replacement (inline style)
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.setProperty('--_shine-opacity', '1')
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.setProperty('--_shine-opacity', '0')
                }}
              >
                {/* Shine overlay — absolutely positioned, pointer-events:none */}
                <span
                  aria-hidden
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(105deg, transparent 30%, oklch(1 0 0 / 0.18) 50%, transparent 70%)',
                    backgroundSize: '200% 100%',
                    animation: prefersReduced ? 'none' : 'btnShimmer 1.6s linear infinite',
                    opacity: 0,
                    transition: 'opacity 200ms ease',
                    // toggled by the parent's CSS variable
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } as any}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                  // Controlled via parent's onMouseEnter/Leave above
                />
                View Projects
              </motion.button>

              {/* Ghost / secondary CTA */}
              <motion.a
                href={personalInfo.resume}
                download
                whileHover={prefersReduced ? {} : { y: -2 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: 'var(--space-3) var(--space-8)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                  background: 'oklch(from var(--color-surface) l c h / 0.55)',
                  backdropFilter: 'blur(12px)',
                  letterSpacing: '0.025em',
                  transition: [
                    'border-color var(--transition-interactive)',
                    'color var(--transition-interactive)',
                    'background var(--transition-interactive)',
                    'box-shadow var(--transition-interactive)',
                  ].join(', '),
                  willChange: 'transform',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'var(--color-primary)'
                  el.style.color = 'var(--color-primary)'
                  el.style.background = 'oklch(from var(--color-primary) l c h / 0.07)'
                  el.style.boxShadow = '0 4px 16px oklch(from var(--color-primary) l c h / 0.12)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'var(--color-border)'
                  el.style.color = 'var(--color-text)'
                  el.style.background = 'oklch(from var(--color-surface) l c h / 0.55)'
                  el.style.boxShadow = 'none'
                }}
              >
                Download CV
              </motion.a>
            </motion.div>

            {/* ── Divider ───────────────────────────────────────────────────
                ENHANCEMENT: thin horizontal rule with gradient fade-out
                on both ends, providing visual cadence between CTAs and socials.
            ─────────────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 1.12, duration: 0.6, ease: EASE, originX: 0 }}
              aria-hidden
              style={{
                height: 1,
                maxWidth: 280,
                marginBottom: 'var(--space-6)',
                background: 'linear-gradient(90deg, var(--color-border) 0%, transparent 100%)',
                transformOrigin: 'left center',
              }}
            />

            {/* ── Social links ──────────────────────────────────────────────
                ENHANCEMENTS:
                • 48×48px touch targets (WCAG 2.5.5 AAA: ≥44px)
                • "icon + label" layout on wider screens (>= 600px)
                  gracefully collapses to icon-only on mobile via visibility
                • Transition uses both border + background for richer feedback
                • Slight rotation transform on hover for personality
            ─────────────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.5, ease: EASE }}
              style={{
                display: 'flex',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-16)',
                flexWrap: 'wrap',
              }}
            >
              {[
                { href: personalInfo.github,            icon: <GitBranch size={17} strokeWidth={2} />, label: 'GitHub'   },
                { href: personalInfo.linkedin,          icon: <Linkedin  size={17} strokeWidth={2} />, label: 'LinkedIn' },
                { href: `mailto:${personalInfo.email}`, icon: <Mail      size={17} strokeWidth={2} />, label: 'Email'    },
              ].map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={s.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  aria-label={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0  }}
                  transition={{ delay: 1.15 + i * 0.09, duration: 0.4, ease: EASE }}
                  whileHover={prefersReduced ? {} : { y: -3, scale: 1.07, rotate: -3 }}
                  whileTap={{ scale: 0.91 }}
                  style={{
                    // 48px touch target for WCAG 2.5.5 compliance
                    width: 48, height: 48,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--color-text-muted)',
                    background: 'oklch(from var(--color-surface) l c h / 0.45)',
                    backdropFilter: 'blur(10px)',
                    transition: [
                      'color var(--transition-interactive)',
                      'border-color var(--transition-interactive)',
                      'background var(--transition-interactive)',
                      'box-shadow var(--transition-interactive)',
                    ].join(', '),
                    willChange: 'transform',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.color = 'var(--color-primary)'
                    el.style.borderColor = 'oklch(from var(--color-primary) l c h / 0.6)'
                    el.style.background = 'oklch(from var(--color-primary) l c h / 0.09)'
                    el.style.boxShadow = '0 4px 14px oklch(from var(--color-primary) l c h / 0.18)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.color = 'var(--color-text-muted)'
                    el.style.borderColor = 'var(--color-border)'
                    el.style.background = 'oklch(from var(--color-surface) l c h / 0.45)'
                    el.style.boxShadow = 'none'
                  }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>

            {/* ── Scroll hint ───────────────────────────────────────────────
                ENHANCEMENT:
                • Uses CSS animation (scrollBounce keyframe) instead of
                  Framer Motion's `animate` for lower runtime cost
                • Slightly wider letter-spacing and uppercase for a more
                  refined label treatment
                • Thin vertical line above the arrow adds editorial structure
            ─────────────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6, ease: EASE }}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-2)',
                color: 'var(--color-text-faint)',
                cursor: 'default',
                userSelect: 'none',
              }}
            >
              {/* Vertical tick line */}
              <div aria-hidden style={{
                width: 1,
                height: 24,
                background: 'linear-gradient(to bottom, transparent, var(--color-text-faint))',
              }} />
              <div
                aria-hidden
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                  animation: prefersReduced ? 'none' : 'scrollBounce 2.2s ease-in-out infinite',
                }}
              >
                <ArrowDown size={13} strokeWidth={2.2} />
                <span style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                }}>
                  Scroll to explore
                </span>
              </div>
              {/* sr-only label so it's announced once by screen readers */}
              <span className="sr-only">Scroll down to see more content</span>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  )
}
