import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { GitBranch, Linkedin, Mail, ArrowDown, Sparkles } from 'lucide-react'
import ThreeBackground from './ThreeBackground'
import { personalInfo } from '../data/portfolio'

const roles = [
  'Full-Stack Developer',
  'React Specialist',
  'Node.js Engineer',
  'AI Integrations Dev',
]

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
          id = setTimeout(() => {
            state.current.deleting = true
            tick()
          }, 2200)
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
  }, [words])

  return text
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

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
        ...(gradient
          ? {
              background:
                'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 15%, oklch(0.92 0.08 185) 35%, var(--color-accent) 60%, oklch(0.88 0.10 60) 80%, var(--color-accent) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }
          : {}),
        ...(shimmer && !prefersReduced
          ? {
              backgroundSize: '250% 100%',
              animation:
                'nameShimmer 5s cubic-bezier(0.4, 0, 0.6, 1) 2s infinite',
            }
          : {}),
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
        WebkitMaskImage:
          'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        maskImage:
          'radial-gradient(ellipse at center, black 30%, transparent 75%)',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 240 240"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dotGrid"
            x="0"
            y="0"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="1.5"
              cy="1.5"
              r="1.5"
              fill="var(--color-primary)"
            />
          </pattern>
        </defs>

        <rect width="240" height="240" fill="url(#dotGrid)" />
      </svg>
    </div>
  )
}

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
        background:
          'radial-gradient(ellipse 70% 50% at 30% 50%, oklch(0.72 0.18 195 / 0.09) 0%, oklch(0.78 0.16 70 / 0.05) 55%, transparent 80%)',
        filter: 'blur(40px)',
        zIndex: 0,
      }}
    />
  )
}

export default function Hero() {
  const displayed = useTypewriter(roles)
  const prefersReduced = useReducedMotion()

  const scrollToProjects = useCallback(() => {
    document
      .getElementById('projects')
      ?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <style>{`
        @keyframes nameShimmer {
          0% { background-position: 120% center; }
          45% { background-position: 0% center; }
          55% { background-position: 0% center; }
          100% { background-position: 120% center; }
        }

        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.85); }
        }

        @keyframes blink {
          0%,100% { opacity:1; }
          50% { opacity:0; }
        }

        @keyframes badgePulse {
          0%,100% {
            box-shadow:0 0 0 0 oklch(from var(--color-primary) l c h / 0.45);
          }
          50% {
            box-shadow:0 0 0 7px oklch(from var(--color-primary) l c h / 0);
          }
        }

        @keyframes btnShimmer {
          0% { background-position:-200% center; }
          100% { background-position:200% center; }
        }

        @keyframes scrollBounce {
          0%,100% { transform:translateY(0); }
          50% { transform:translateY(7px); }
        }

        :is(button,a,[role="button"]):focus-visible {
          outline:2px solid var(--color-primary) !important;
          outline-offset:3px !important;
          border-radius:inherit;
        }

        #hero {
          -webkit-font-smoothing:antialiased;
          -moz-osx-font-smoothing:grayscale;
        }

        @media (max-width:900px) {
          .dot-grid-wrapper {
            display:none;
          }
        }

        @media (max-width:480px) {
          #hero .hero-content {
            padding-inline:var(--space-4);
          }
        }
      `}</style>

      <section
        id="hero"
        style={{
          position: 'relative',
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <ThreeBackground />

        <NameGlow />

        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 80% 60% at 20% 50%, transparent 40%, oklch(0 0 0 / 0.28) 100%)',
          }}
        />

        <div
          className="dot-grid-wrapper"
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <DotGrid />
        </div>

        <div
          className="container hero-content"
          style={{
            position: 'relative',
            zIndex: 1,
            paddingBlock: 'var(--space-32)',
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.55, ease: EASE }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '1px',
                background:
                  'linear-gradient(135deg, oklch(from var(--color-primary) l c h / 0.5), oklch(from var(--color-accent) l c h / 0.3))',
                borderRadius: 'var(--radius-full)',
                marginBottom: 'var(--space-8)',
                animation: prefersReduced
                  ? 'none'
                  : 'badgePulse 3s ease-in-out infinite',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-1) var(--space-4)',
                  background:
                    'oklch(from var(--color-primary) l c h / 0.07)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-primary)',
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    animation: prefersReduced
                      ? 'none'
                      : 'pulse 2s ease-in-out infinite',
                  }}
                />

                <Sparkles size={11} strokeWidth={2.2} />

                Open to Opportunities · B.Tech CSE · 2027
              </span>
            </motion.div>

            <h1
              style={{
                fontSize: 'clamp(3.5rem, 2.5rem + 5vw, 6.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.045em',
                lineHeight: 0.92,
                marginBottom: 'var(--space-6)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  color: 'var(--color-text)',
                }}
              >
                <AnimatedWord text="Nabanna" delay={0.1} />
              </span>

              <span style={{ display: 'block' }}>
                <AnimatedWord
                  text="Choudhury"
                  delay={0.38}
                  gradient
                  shimmer
                />
              </span>
            </h1>

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
                marginBottom: 'var(--space-8)',
              }}
            >
              <span className="sr-only">
                Role: {displayed || roles[0]}
              </span>

              <span
                aria-hidden
                style={{ color: 'var(--color-primary)' }}
              >
                {displayed}
              </span>

              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: 2.5,
                  height: '1.1em',
                  background: 'var(--color-primary)',
                  borderRadius: 2,
                  animation: 'blink 1s step-end infinite',
                }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.6, ease: EASE }}
              style={{
                fontSize:
                  'clamp(0.9375rem, 0.85rem + 0.44vw, 1.0625rem)',
                color: 'var(--color-text-muted)',
                lineHeight: 1.8,
                marginBottom: 'var(--space-10)',
                maxWidth: 540,
              }}
            >
              Building intelligent web experiences with{' '}
              <span
                style={{
                  color: 'var(--color-text)',
                  fontWeight: 600,
                }}
              >
                React
              </span>
              ,{' '}
              <span
                style={{
                  color: 'var(--color-text)',
                  fontWeight: 600,
                }}
              >
                Node.js
              </span>{' '}
              &amp;{' '}
              <span
                style={{
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                }}
              >
                AI
              </span>
              .
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.6, ease: EASE }}
              style={{
                display: 'flex',
                gap: 'var(--space-3)',
                flexWrap: 'wrap',
                marginBottom: 'var(--space-10)',
              }}
            >
              <motion.button
                onClick={scrollToProjects}
                whileHover={
                  prefersReduced
                    ? {}
                    : {
                        y: -2,
                      }
                }
                whileTap={{ scale: 0.96 }}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  padding: 'var(--space-3) var(--space-8)',
                  background:
                    'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  const shine = e.currentTarget.querySelector(
                    '.btn-shine'
                  ) as HTMLElement

                  if (shine) shine.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  const shine = e.currentTarget.querySelector(
                    '.btn-shine'
                  ) as HTMLElement

                  if (shine) shine.style.opacity = '0'
                }}
              >
                <span
                  className="btn-shine"
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(105deg, transparent 30%, oklch(1 0 0 / 0.18) 50%, transparent 70%)',
                    backgroundSize: '200% 100%',
                    animation: prefersReduced
                      ? 'none'
                      : 'btnShimmer 1.6s linear infinite',
                    opacity: 0,
                    transition: 'opacity 200ms ease',
                    pointerEvents: 'none',
                  }}
                />

                View Projects
              </motion.button>

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
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                Download CV
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.5 }}
              style={{
                display: 'flex',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-16)',
              }}
            >
              {[
                {
                  href: personalInfo.github,
                  icon: <GitBranch size={17} />,
                  label: 'GitHub',
                },
                {
                  href: personalInfo.linkedin,
                  icon: <Linkedin size={17} />,
                  label: 'LinkedIn',
                },
                {
                  href: `mailto:${personalInfo.email}`,
                  icon: <Mail size={17} />,
                  label: 'Email',
                },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={
                    s.href.startsWith('mailto') ? undefined : '_blank'
                  }
                  rel={
                    s.href.startsWith('mailto')
                      ? undefined
                      : 'noopener noreferrer'
                  }
                  aria-label={s.label}
                  whileHover={
                    prefersReduced
                      ? {}
                      : {
                          y: -3,
                          scale: 1.07,
                        }
                  }
                  whileTap={{ scale: 0.91 }}
                  style={{
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--color-text-muted)',
                    textDecoration: 'none',
                  }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-2)',
                color: 'var(--color-text-faint)',
              }}
            >
              <div
                style={{
                  width: 1,
                  height: 24,
                  background:
                    'linear-gradient(to bottom, transparent, var(--color-text-faint))',
                }}
              />

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  animation: prefersReduced
                    ? 'none'
                    : 'scrollBounce 2.2s ease-in-out infinite',
                }}
              >
                <ArrowDown size={13} strokeWidth={2.2} />

                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}
                >
                  Scroll to explore
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
