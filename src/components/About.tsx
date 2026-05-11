import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { personalInfo, education, experience } from '../data/portfolio'

// ─── Types ────────────────────────────────────────────────────────────────────
type Education = { institution: string; degree: string; grade: string; period: string }
type Experience = { company: string; role: string; period: string; points: string[] }

// ─── Logo map ─────────────────────────────────────────────────────────────────
const LOGO_MAP: Record<string, string> = {
  'Assam Downtown University':   '/logos/adtu.png',
  'Salt Brook Academy':          '/logos/sba.png',
  'Vernovate Private Limited':   '/logos/vernovate.png',
}

// ─── Glow style injected once ─────────────────────────────────────────────────
const GLOW_CSS = `
@keyframes logoGlow {
  0%, 100% { box-shadow: 0 0  6px 1px oklch(from var(--color-primary) l c h / 0.30); }
  50%       { box-shadow: 0 0 18px 5px oklch(from var(--color-primary) l c h / 0.65); }
}
@keyframes borderPulse {
  0%, 100% { border-color: oklch(from var(--color-primary) l c h / 0.15); }
  50%       { border-color: oklch(from var(--color-primary) l c h / 0.45); }
}
.logo-glow {
  animation: logoGlow 2.4s ease-in-out infinite;
  border-radius: var(--radius-lg);
}
.logo-glow:hover { animation-duration: 0.9s; }
.about-card {
  animation: borderPulse 4s ease-in-out infinite;
}
`
function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('about-css')) {
    const s = document.createElement('style')
    s.id = 'about-css'; s.textContent = GLOW_CSS
    document.head.appendChild(s)
  }
  return null
}

// ─── Logo badge ───────────────────────────────────────────────────────────────
function LogoBadge({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null
  return (
    <img
      src={src} alt={alt}
      width={40} height={40} loading="lazy"
      className="logo-glow"
      style={{
        width: 40, height: 40,
        objectFit: 'contain',
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        flexShrink: 0, padding: 3,
      }}
    />
  )
}

// ─── Reusable scroll-reveal wrapper ──────────────────────────────────────────
// Animation plan:
//   Trigger  : IntersectionObserver via Framer Motion viewport prop
//   Type     : fade-up (opacity 0→1, y 28→0) — timeless, non-distracting
//   Duration : 0.65s with spring-like ease [0.16, 1, 0.3, 1]
//   Stagger  : delay prop offsets children sequentially
//   A11y     : useReducedMotion disables all transforms, keeps opacity fade only
function Reveal({
  children,
  delay = 0,
  x = 0,
  y = 28,
  style = {},
}: {
  children: React.ReactNode
  delay?: number
  x?: number
  y?: number
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y, x: reduced ? 0 : x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: reduced ? 0.2 : 0.65,
        delay: reduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ─── Education card ───────────────────────────────────────────────────────────
function EduCard({ e, i }: { e: Education; i: number }) {
  return (
    <Reveal delay={0.1 + i * 0.1} y={20}>
      <div
        className="glow-card about-card"
        style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <LogoBadge src={LOGO_MAP[e.institution]} alt={e.institution} />
          <div>
            <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.3 }}>
              {e.institution}
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
              {e.degree}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
          <span className="tag">{e.grade}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>{e.period}</span>
        </div>
      </div>
    </Reveal>
  )
}

// ─── Experience card ──────────────────────────────────────────────────────────
function ExpCard({ ex, i }: { ex: Experience; i: number }) {
  return (
    <Reveal delay={0.15 + i * 0.1} y={20}>
      <div className="glow-card about-card" style={{ padding: 'var(--space-6)' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <LogoBadge src={LOGO_MAP[ex.company]} alt={ex.company} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>{ex.company}</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 500 }}>{ex.role}</p>
            </div>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', alignSelf: 'flex-start' }}>
            {ex.period}
          </span>
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingLeft: 'var(--space-4)', listStyle: 'disc' }}>
          {ex.points.map((pt, j) => (
            <li key={j} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax: photo drifts up slightly as user scrolls through the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const photoY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="section"
      style={{
        // Tighter, adaptive padding — no blank voids
        paddingBlock: 'clamp(var(--space-16), 7vw, var(--space-24))',
        position: 'relative', zIndex: 1,
      }}
    >
      <InjectStyles />
      <div className="container">

        {/* ── Section label + heading ──────────────────────────────────────── */}
        <Reveal y={24} style={{ marginBottom: 'var(--space-14)' }}>
          <p style={{
            fontSize: 'var(--text-xs)', color: 'var(--color-primary)',
            fontWeight: 700, marginBottom: 'var(--space-2)',
            textTransform: 'uppercase', letterSpacing: '0.14em',
          }}>
            About Me
          </p>
          <h2
            id="about-heading"
            style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
              fontWeight: 800, letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Crafting experiences,{' '}
            <span className="gradient-text">not just code</span>
          </h2>
        </Reveal>

        {/* ── Two-column grid ──────────────────────────────────────────────── */}
        {/* Layout fix: minmax(280px,1fr) prevents 300px col from leaving gaps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(var(--space-8), 5vw, var(--space-16))',
          alignItems: 'start',
        }}>

          {/* ── Left: Photo + Bio ────────────────────────────────────────── */}
          <Reveal x={-28} y={0} delay={0.05}>
            {/* Photo with parallax drift */}
            <motion.div
              style={{
                y: photoY,
                width: '100%', maxWidth: 300,
                aspectRatio: '3/4',
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                marginBottom: 'var(--space-6)',
                border: '1px solid var(--color-border)',
                position: 'relative',
                // Pseudo-3D depth shadow
                boxShadow: '0 24px 64px oklch(0 0 0 / 0.22), 0 4px 16px oklch(0 0 0 / 0.12)',
              }}
            >
              <img
                src={personalInfo.photo}
                width={380} height={507}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
              />
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, oklch(from var(--color-primary) l c h / 0.35) 0%, transparent 55%)',
              }} />
              {/* Name badge overlaid on photo */}
              <div style={{
                position: 'absolute', bottom: 'var(--space-4)', left: 'var(--space-4)',
                background: 'oklch(from var(--color-surface) l c h / 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-2) var(--space-4)',
              }}>
              </div>
            </motion.div>

            {/* Bio */}
            <p style={{
              color: 'var(--color-text-muted)',
              lineHeight: 1.85, fontSize: 'var(--text-base)',
              maxWidth: '56ch',
            }}>
              {personalInfo.bio}
            </p>

            {/* Quick-stat pills — fills space, shows personality */}
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: 'var(--space-2)', marginTop: 'var(--space-6)',
            }}>
              {[
                { label: '🎓 Final Year B.Tech' },
                { label: '📍 Guwahati, Assam' },
                { label: '⚡ Open to Work' },
                { label: '🚀 2+ Projects Shipped' },
              ].map(pill => (
                <span
                  key={pill.label}
                  className="tag"
                  style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}
                >
                  {pill.label}
                </span>
              ))}
            </div>
          </Reveal>

          {/* ── Right: Education + Experience ───────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>

            {/* Education */}
            <div>
              <Reveal delay={0.08}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)',
                  fontWeight: 700, marginBottom: 'var(--space-5)',
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: 'var(--radius-md)',
                    background: 'oklch(from var(--color-primary) l c h / 0.12)',
                    fontSize: 14,
                  }}>🎓</span>
                  Education
                </h3>
              </Reveal>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {(education as Education[]).map((e, i) => (
                  <EduCard key={i} e={e} i={i} />
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <Reveal delay={0.08}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)',
                  fontWeight: 700, marginBottom: 'var(--space-5)',
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: 'var(--radius-md)',
                    background: 'oklch(from var(--color-accent) l c h / 0.12)',
                    fontSize: 14,
                  }}>💼</span>
                  Experience
                </h3>
              </Reveal>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {(experience as Experience[]).map((ex, i) => (
                  <ExpCard key={i} ex={ex} i={i} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}