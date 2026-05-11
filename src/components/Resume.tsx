import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Download, FileText, Award, ExternalLink, CheckCircle } from 'lucide-react'
import { personalInfo, certifications } from '../data/portfolio'

// ─── Cert logo + glow config ──────────────────────────────────────────────────
const CERT_META: Record<string, { logo: string; glowColor: string }> = {
  'HackerRank': {
    logo: '/logos/hackerrank.jpg',
    glowColor: '#00ea64',
  },
  'University of Colorado via Coursera': {
    logo: '/logos/coursera.jpg',
    glowColor: '#0056d2',
  },
  'IBM via Coursera': {
    logo: '/logos/coursera.jpg',
    glowColor: '#0056d2',
  },
}

const CERT_GLOW_CSS = `
@keyframes certHalo {
  0%, 100% { opacity: 0.50; transform: scale(1); }
  50%       { opacity: 0.85; transform: scale(1.16); }
}
.cert-logo-halo { animation: certHalo 2.6s ease-in-out infinite; }
`

function InjectCertGlow() {
  if (typeof document !== 'undefined' && !document.getElementById('cert-glow-css')) {
    const s = document.createElement('style')
    s.id = 'cert-glow-css'
    s.textContent = CERT_GLOW_CSS
    document.head.appendChild(s)
  }
  return null
}

// ─── Reveal ───────────────────────────────────────────────────────────────────
function Reveal({
  children, delay = 0, y = 20, x = 0, style = {},
}: {
  children: React.ReactNode
  delay?: number; y?: number; x?: number
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y, x: reduced ? 0 : x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: reduced ? 0.15 : 0.55, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '2px',
        // ↓ tighter padding than before (was space-4 space-5)
        padding: 'var(--space-3) var(--space-4)',
        background: 'oklch(from var(--color-primary) l c h / 0.07)',
        border: '1px solid oklch(from var(--color-primary) l c h / 0.18)',
        borderRadius: 'var(--radius-xl)', minWidth: 68, cursor: 'default',
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        // ↓ was text-lg, now text-base — less vertical bulk
        fontSize: 'var(--text-base)', color: 'var(--color-primary)', lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{
        fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)',
        textAlign: 'center', lineHeight: 1.2,
      }}>
        {label}
      </span>
    </motion.div>
  )
}

// ─── Cert card ────────────────────────────────────────────────────────────────
function CertCard({ cert, i }: { cert: { name: string; issuer: string; date: string }; i: number }) {
  const [hovered, setHovered] = useState(false)
  const meta = CERT_META[cert.issuer]
  const glowColor = meta?.glowColor ?? 'var(--color-primary)'

  return (
    <Reveal delay={0.06 + i * 0.08} x={16} y={0}>
      <motion.div
        className="glow-card"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ x: 3 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        style={{
          // ↓ was space-4 space-5 — now more compact
          padding: 'var(--space-3) var(--space-4)',
          display: 'flex', alignItems: 'center',
          gap: 'var(--space-3)', position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Left accent bar */}
        <motion.div
          animate={{ scaleY: hovered ? 1 : 0.35, opacity: hovered ? 1 : 0.45 }}
          transition={{ duration: 0.22 }}
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: 3, background: glowColor,
            borderRadius: '0 2px 2px 0', transformOrigin: 'center',
          }}
        />

        {/* Logo + halo */}
        {meta?.logo && (
          <div style={{ position: 'relative', flexShrink: 0, width: 36, height: 36 }}>
            <div
              className="cert-logo-halo"
              aria-hidden
              style={{
                position: 'absolute', inset: -5, borderRadius: '50%',
                background: `radial-gradient(circle, ${glowColor}50 0%, ${glowColor}00 70%)`,
                filter: 'blur(3px)',
                animationDelay: `${i * 0.4}s`,
              }}
            />
            <img
              src={meta.logo}
              alt={cert.issuer}
              width={36} height={36}
              loading="lazy"
              style={{
                position: 'relative', zIndex: 1,
                width: 36, height: 36,
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${glowColor}44`,
                background: 'var(--color-surface-2)',
                padding: 3,
              }}
            />
          </div>
        )}

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0, paddingLeft: meta?.logo ? 0 : 'var(--space-3)' }}>
          <p style={{
            fontWeight: 600, fontSize: 'var(--text-sm)',
            color: 'var(--color-text)', lineHeight: 1.35,
          }}>
            {cert.name}
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 1 }}>
            {cert.issuer}
          </p>
        </div>

        {/* Date + tick */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
          <AnimatePresence>
            {hovered && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.16 }}
              >
                <CheckCircle size={13} color={glowColor} />
              </motion.span>
            )}
          </AnimatePresence>
          <span className="tag">{cert.date}</span>
        </div>
      </motion.div>
    </Reveal>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Resume() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced    = useReducedMotion()
  const [copied, setCopied] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef, offset: ['start end', 'end start'],
  })
  const cardRotate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [2.5, -2.5])
  const cardY      = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [10, -10])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section
      id="resume"
      ref={sectionRef}
      aria-labelledby="resume-heading"
      className="section"
      style={{
        // ↓ was clamp(space-16, 7vw, space-24) — reduced top/bottom
        paddingBlock: 'clamp(var(--space-10), 5vw, var(--space-16))',
        position: 'relative', zIndex: 1,
      }}
    >
      <InjectCertGlow />
      <div className="container">

        {/* ── Heading ── */}
        <Reveal style={{ marginBottom: 'var(--space-8)' }}>  {/* was space-14 */}
          <p style={{
            fontSize: 'var(--text-xs)', color: 'var(--color-primary)',
            fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.14em', marginBottom: 'var(--space-1)',
          }}>
            Resume
          </p>
          <h2 id="resume-heading" style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
            fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            My <span className="gradient-text">credentials</span>
          </h2>
        </Reveal>

        {/* ── Main grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          // ↓ was clamp(space-8, 4vw, space-14)
          gap: 'clamp(var(--space-6), 3vw, var(--space-10))',
          alignItems: 'start',
        }}>

          {/* ── LEFT: PDF preview + stats ── */}
          <Reveal x={-20} y={0} delay={0.05}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>  {/* was space-6 */}

              <motion.div style={{ rotateZ: cardRotate, y: cardY, transformOrigin: 'center bottom' }}>
                <div className="glow-card" style={{
                  overflow: 'hidden', aspectRatio: '4/3', position: 'relative',
                  boxShadow: '0 16px 48px oklch(0 0 0 / 0.22), 0 4px 12px oklch(0 0 0 / 0.12)',
                  // ↓ override default glow-card padding for the iframe
                  padding: 0,
                }}>
                  <iframe
                    src={`${personalInfo.resume}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    title="Nabanna Choudhury Resume Preview"
                    style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, oklch(from var(--color-bg) l c h / 0.85) 0%, transparent 45%)',
                    display: 'flex', alignItems: 'flex-end', padding: 'var(--space-4)',
                  }}>
                    <motion.a
                      href={personalInfo.resume}
                      target="_blank" rel="noopener noreferrer"
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-3)',
                        background: 'oklch(from var(--color-surface) l c h / 0.92)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-xs)', fontWeight: 600,
                        color: 'var(--color-text)', textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={11} /> Open full PDF
                    </motion.a>
                  </div>
                </div>
              </motion.div>

              {/* Stat pills — tighter row */}
              <Reveal delay={0.16}>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <StatPill icon="🏫" value="8.2" label="CGPA"       />
                  <StatPill icon="💼" value="1+"  label="Internship" />
                  <StatPill icon="🚀" value="2+"  label="Projects"   />
                  <StatPill icon="📜" value="3"   label="Certs"      />
                </div>
              </Reveal>

            </div>
          </Reveal>

          {/* ── RIGHT: Download + Certifications ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>  {/* was space-6 */}

            {/* Download card */}
            <Reveal delay={0.1} x={20} y={0}>
              <div className="glow-card" style={{
                // ↓ was space-7 — now space-5 for less bulk
                padding: 'var(--space-5)',
                display: 'flex', gap: 'var(--space-4)', alignItems: 'center',
                background: 'oklch(from var(--color-primary) l c h / 0.05)',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Background radial */}
                <div aria-hidden style={{
                  position: 'absolute', right: -32, top: -32,
                  width: 130, height: 130, borderRadius: '50%',
                  background: 'radial-gradient(circle, oklch(from var(--color-primary) l c h / 0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, -4, 0] }}
                  transition={{ duration: 0.45 }}
                  style={{
                    // ↓ was 56×56
                    width: 48, height: 48,
                    borderRadius: 'var(--radius-xl)', flexShrink: 0,
                    background: 'oklch(from var(--color-primary) l c h / 0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <FileText size={22} color="var(--color-primary)" />
                </motion.div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)',
                    fontWeight: 700,
                    // ↓ was space-1 then space-4 — tightened
                    marginBottom: 2,
                  }}>
                    Nabanna-Choudhury-Resume.pdf
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-3)',  // was space-4
                  }}>
                    Updated May 2026 · Full-Stack Developer
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <motion.a
                      href={personalInfo.resume}
                      download="Nabanna-Choudhury-Resume.pdf"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                        // ↓ was space-2 space-5
                        padding: 'var(--space-2) var(--space-4)',
                        background: 'var(--color-primary)', color: '#fff',
                        borderRadius: 'var(--radius-full)', fontWeight: 600,
                        fontSize: 'var(--text-xs)', textDecoration: 'none',
                        boxShadow: '0 3px 12px oklch(from var(--color-primary) l c h / 0.3)',
                        transition: 'box-shadow var(--transition-interactive)',
                      }}
                    >
                      <Download size={12} /> Download PDF
                    </motion.a>

                    <motion.button
                      onClick={handleCopyEmail}
                      whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)',
                        padding: 'var(--space-2) var(--space-3)',
                        border: '1px solid var(--color-border)',
                        background: 'transparent', color: 'var(--color-text-muted)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-xs)', fontWeight: 500, cursor: 'pointer',
                        transition: 'all var(--transition-interactive)',
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={copied ? 'copied' : 'copy'}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.14 }}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          {copied
                            ? <><CheckCircle size={11} color="var(--color-primary)" /> Copied!</>
                            : <>✉ Copy Email</>
                          }
                        </motion.span>
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Certifications */}
            <div>
              <Reveal delay={0.12}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)',  // was text-lg
                  fontWeight: 700,
                  marginBottom: 'var(--space-3)',  // was space-5
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 24, height: 24, borderRadius: 'var(--radius-md)',  // was 28×28
                    background: 'oklch(from var(--color-primary) l c h / 0.12)',
                  }}>
                    <Award size={13} color="var(--color-primary)" />
                  </span>
                  Certifications
                </h3>
              </Reveal>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>  {/* was space-3 */}
                {certifications.map((cert, i) => (
                  <CertCard key={i} cert={cert} i={i} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}