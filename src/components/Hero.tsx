import { useEffect, useRef, useState, useCallback } from 'react'
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
  const state = useRef({
    idx: 0,
    deleting: false,
    charIdx: 0,
  })

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
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: '999px',
                  background:
                    'oklch(from var(--color-primary) l c h / 0.08)',
                  color: 'var(--color-primary)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
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
                lineHeight: 0.92,
                letterSpacing: '-0.045em',
                marginTop: 'var(--space-8)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <span style={{ display: 'block' }}>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: 'var(--space-8)',
                minHeight: '30px',
              }}
            >
              <span
                style={{
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                }}
              >
                {displayed}
              </span>

              <span
                style={{
                  width: 2,
                  height: 24,
                  background: 'var(--color-primary)',
                  animation: 'blink 1s infinite',
                }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{
                maxWidth: 600,
                lineHeight: 1.8,
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-10)',
              }}
            >
              Building intelligent web experiences with React, Node.js &
              AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                flexWrap: 'wrap',
                marginBottom: 'var(--space-12)',
              }}
            >
              <motion.button
                whileHover={prefersReduced ? {} : { y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={scrollToProjects}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#fff',
                  background:
                    'linear-gradient(135deg,var(--color-primary),var(--color-primary-hover))',
                }}
              >
                <span
                  className="btn-shine"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                    backgroundSize: '200% 100%',
                    animation: prefersReduced
                      ? 'none'
                      : 'btnShimmer 1.6s linear infinite',
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
                  padding: '14px 28px',
                  borderRadius: '999px',
                  border: '1px solid var(--color-border)',
                  textDecoration: 'none',
                  color: 'var(--color-text)',
                  fontWeight: 600,
                }}
              >
                Download CV
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-16)',
              }}
            >
              {[
                {
                  href: personalInfo.github,
                  icon: <GitBranch size={18} />,
                  label: 'GitHub',
                },
                {
                  href: personalInfo.linkedin,
                  icon: <Linkedin size={18} />,
                  label: 'LinkedIn',
                },
                {
                  href: `mailto:${personalInfo.email}`,
                  icon: <Mail size={18} />,
                  label: 'Email',
                },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={
                    item.href.startsWith('mailto')
                      ? undefined
                      : '_blank'
                  }
                  rel={
                    item.href.startsWith('mailto')
                      ? undefined
                      : 'noopener noreferrer'
                  }
                  whileHover={
                    prefersReduced
                      ? {}
                      : {
                          y: -3,
                          scale: 1.05,
                        }
                  }
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    textDecoration: 'none',
                  }}
                >
                  {item.icon}
                </motion.a>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animation: prefersReduced
                    ? 'none'
                    : 'scrollBounce 2.2s ease-in-out infinite',
                }}
              >
                <ArrowDown size={13} />

                <span
                  style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
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
