import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { GitBranch, Linkedin, Mail, ArrowDown } from 'lucide-react'
import ThreeBackground from './ThreeBackground'
import { personalInfo } from '../data/portfolio'

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN BRIEF
// Typography  : Clash Display (700–800) for name · Satoshi (400–500) for body
// Name color  : Gradient — teal → amber (matches --color-primary → --color-accent)
// Palette     : Deep charcoal bg · electric teal primary · warm amber accent
// Animation   : Letters slide up from y:40 + fade-in, staggered 0.045s each
//               "Choudhury" gets a gradient shimmer sweep after reveal
//               Fully respects prefers-reduced-motion
// Layout      : Left-aligned (editorial) · max-width 720px · responsive fluid
// ─────────────────────────────────────────────────────────────────────────────

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
        ease: EASE,   // ✅ FIX: typed tuple instead of inline array literal
      },
    }),
  }

  return (
    <span
      aria-label={text}
      style={{
        display: 'inline-block',
        perspective: 600,
        ...(gradient ? {
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        } : {}),
        ...(shimmer && !prefersReduced ? {
          backgroundSize: '200% 100%',
          animation: 'nameShimmer 4s ease-in-out 1.8s infinite',
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

// ── Main Hero ─────────────────────────────────────────────────────────────────
export default function Hero() {
  const displayed      = useTypewriter(roles)
  const prefersReduced = useReducedMotion()

  const scrollToProjects = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes nameShimmer {
          0%   { background-position: 200% center; }
          50%  { background-position:   0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0   oklch(from var(--color-primary) l c h / 0.4); }
          50%       { box-shadow: 0 0 0 6px oklch(from var(--color-primary) l c h / 0);   }
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

        {/* Subtle radial vignette for depth */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 20% 50%, transparent 40%, oklch(0 0 0 / 0.25) 100%)',
        }} />

        <div
          className="container"
          style={{ position: 'relative', zIndex: 1, paddingBlock: 'var(--space-32)' }}
        >
          <div style={{ maxWidth: 720 }}>

            {/* ── Status badge ──────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.05, duration: 0.5 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                padding: 'var(--space-1) var(--space-4)',
                background: 'oklch(from var(--color-primary) l c h / 0.08)',
                border: '1px solid oklch(from var(--color-primary) l c h / 0.22)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)', color: 'var(--color-primary)',
                fontWeight: 500, marginBottom: 'var(--space-8)',
                animation: prefersReduced ? 'none' : 'badgePulse 2.5s ease-in-out infinite',
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--color-primary)',
                flexShrink: 0,
                animation: prefersReduced ? 'none' : 'pulse 2s ease-in-out infinite',
              }} />
              Open to Opportunities · B.Tech CSE · 2027
            </motion.div>

            {/* ── Animated name ─────────────────────────────────────────── */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-hero)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                marginBottom: 'var(--space-5)',
                minHeight: 'calc(var(--text-hero) * 2 * 0.95)',
              }}
            >
              <span style={{ display: 'block', color: 'var(--color-text)' }}>
                <AnimatedWord text="Nabanna" delay={0.1} />
              </span>
              <span style={{ display: 'block' }}>
                <AnimatedWord text="Choudhury" delay={0.38} gradient shimmer />
              </span>
            </h1>

            {/* ── Typewriter role ───────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              style={{
                fontSize: 'var(--text-xl)', fontWeight: 600,
                color: 'var(--color-text-muted)',
                minHeight: '2.5rem',
                marginBottom: 'var(--space-6)',
                fontFamily: 'var(--font-display)',
              }}
            >
              <span style={{ color: 'var(--color-primary)' }}>{displayed}</span>
              <span
                aria-hidden
                style={{
                  display: 'inline-block', width: 2, height: '1em',
                  background: 'var(--color-primary)',
                  marginLeft: 3, verticalAlign: 'text-bottom',
                  animation: 'blink 1s step-end infinite',
                }}
              />
            </motion.div>

            {/* ── Subtitle ─────────────────────────────────────────────── */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.95, duration: 0.6 }}
              style={{
                fontSize: 'var(--text-base)', color: 'var(--color-text-muted)',
                lineHeight: 1.75, marginBottom: 'var(--space-10)',
                maxWidth: 500, fontWeight: 400, letterSpacing: '0.01em',
              }}
            >
              Building intelligent web experiences with{' '}
              <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>React</span>,{' '}
              <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>Node.js</span>{' '}
              &amp;{' '}
              <span style={{ color: 'var(--color-accent)', fontWeight: 500 }}>AI</span>.
            </motion.p>

            {/* ── CTAs ─────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 1.05, duration: 0.6 }}
              style={{
                display: 'flex', gap: 'var(--space-4)',
                flexWrap: 'wrap', marginBottom: 'var(--space-10)',
              }}
            >
              <motion.button
                onClick={scrollToProjects}
                whileHover={prefersReduced ? {} : { y: -2, boxShadow: '0 8px 24px oklch(from var(--color-primary) l c h / 0.35)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: 'var(--space-3) var(--space-8)',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
                  color: '#fff',
                  border: 'none', borderRadius: 'var(--radius-full)',
                  fontWeight: 600, fontSize: 'var(--text-sm)',
                  cursor: 'pointer', letterSpacing: '0.02em',
                  boxShadow: '0 4px 16px oklch(from var(--color-primary) l c h / 0.25)',
                  transition: 'box-shadow var(--transition-interactive)',
                }}
              >
                View Projects
              </motion.button>

              <motion.a
                href={personalInfo.resume}
                download
                whileHover={prefersReduced ? {} : { y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: 'var(--space-3) var(--space-8)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600, fontSize: 'var(--text-sm)',
                  textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                  background: 'oklch(from var(--color-surface) l c h / 0.6)',
                  backdropFilter: 'blur(8px)',
                  transition: 'border-color var(--transition-interactive), color var(--transition-interactive)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                  e.currentTarget.style.color = 'var(--color-primary)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.color = 'var(--color-text)'
                }}
              >
                Download CV
              </motion.a>
            </motion.div>

            {/* ── Social links ─────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.5 }}
              style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-16)' }}
            >
              {[
                { href: personalInfo.github,            icon: <GitBranch size={18} />, label: 'GitHub'   },
                { href: personalInfo.linkedin,          icon: <Linkedin  size={18} />, label: 'LinkedIn' },
                { href: `mailto:${personalInfo.email}`, icon: <Mail      size={18} />, label: 'Email'    },
              ].map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0  }}
                  transition={{ delay: 1.15 + i * 0.08, duration: 0.4 }}
                  whileHover={prefersReduced ? {} : { y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  style={{
                    width: 44, height: 44,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--color-text-muted)',
                    background: 'oklch(from var(--color-surface) l c h / 0.5)',
                    backdropFilter: 'blur(8px)',
                    transition: 'color var(--transition-interactive), border-color var(--transition-interactive), background var(--transition-interactive)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--color-primary)'
                    e.currentTarget.style.borderColor = 'var(--color-primary)'
                    e.currentTarget.style.background = 'oklch(from var(--color-primary) l c h / 0.08)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--color-text-muted)'
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.background = 'oklch(from var(--color-surface) l c h / 0.5)'
                  }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>

            {/* ── Scroll hint ───────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <motion.div
                animate={prefersReduced ? {} : { y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  color: 'var(--color-text-faint)',
                  display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                  cursor: 'default',
                }}
              >
                <ArrowDown size={15} />
                <span style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}>
                  Scroll to explore
                </span>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  )
}
