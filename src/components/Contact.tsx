import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Send } from 'lucide-react'
import { personalInfo } from '../data/portfolio'

// ─── Inject styles once ───────────────────────────────────────────────────────
const CONTACT_CSS = `
@keyframes socialGlow {
  0%, 100% { box-shadow: 0 0 0px 0px var(--glow-c, transparent); }
  50%       { box-shadow: 0 0 16px 4px var(--glow-c, transparent); }
}
.social-icon-wrap { animation: socialGlow 3s ease-in-out infinite; }
.contact-input:focus {
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 3px oklch(from var(--color-primary) l c h / 0.15);
}
@keyframes ping {
  0%   { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(2.2); opacity: 0; }
}
`

function InjectContactStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('contact-css')) {
    const s = document.createElement('style')
    s.id = 'contact-css'
    s.textContent = CONTACT_CSS
    document.head.appendChild(s)
  }
  return null
}

// ─── Reveal helper ────────────────────────────────────────────────────────────
function Reveal({
  children, delay = 0, x = 0, y = 22, style = {},
}: {
  children: React.ReactNode
  delay?: number; x?: number; y?: number
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y, x: reduced ? 0 : x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: reduced ? 0.15 : 0.6,
        delay: reduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ─── Social config ────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label:   'GitHub',
    handle:  '@nabanna12',
    hrefKey: 'github'   as const,
    logo:    '/logos/github.jpg',
    bg:      '#1a1e22',
    hoverBg: '#2d3339',
    glow:    'rgba(36,41,46,0.65)',
    radius:  '50%',
  },
  {
    label:   'LinkedIn',
    handle:  'nabanna-choudhury',
    hrefKey: 'linkedin' as const,
    logo:    '/logos/linkedin.jpg',
    bg:      '#0077b5',
    hoverBg: '#0089d0',
    glow:    'rgba(0,119,181,0.60)',
    radius:  'var(--radius-lg)',
  },
  {
    label:   'Email',
    handle:  '',
    hrefKey: 'email'    as const,
    logo:    '/logos/gmail.jpg',
    bg:      '#ffffff',
    hoverBg: '#f5f5f5',
    glow:    'rgba(234,67,53,0.50)',
    radius:  '50%',
  },
  {
    label:   'Location',
    handle:  '',
    hrefKey: 'location' as const,
    logo:    '/logos/maps.jpg',
    bg:      '#ffffff',
    hoverBg: '#f0faf2',
    glow:    'rgba(52,168,83,0.55)',
    radius:  '50%',
  },
]

// ─── Social card ──────────────────────────────────────────────────────────────
function SocialCard({
  label, handle, href, logo, bg, hoverBg, glow, radius, delay,
}: {
  label: string; handle: string; href: string
  logo: string; bg: string; hoverBg: string
  glow: string; radius: string; delay: number
}) {
  const [hovered, setHovered] = useState(false)

  // ✅ FIX: removed unused `isExternal` variable that was causing TS6133

  return (
    <Reveal delay={delay} x={-20} y={0}>
      <motion.a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ x: 4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className="glow-card"
        style={{
          display: 'flex', alignItems: 'center',
          gap: 'var(--space-4)',
          padding: 'var(--space-3) var(--space-4)',
          textDecoration: 'none', color: 'var(--color-text)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Brand bg wash on hover */}
        <motion.div
          aria-hidden
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'absolute', inset: 0,
            background: glow.replace(/[\d.]+\)$/, '0.06)'),
            pointerEvents: 'none',
          }}
        />

        {/* Logo bubble */}
        <motion.div
          className="social-icon-wrap"
          animate={{ scale: hovered ? 1.09 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            '--glow-c': glow,
            width: 44, height: 44,
            borderRadius: radius,
            background: hovered ? hoverBg : bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, overflow: 'hidden',
            border: '1px solid oklch(from var(--color-border) l c h / 0.6)',
            transition: 'background 0.25s ease',
          } as React.CSSProperties}
        >
          <img
            src={logo}
            alt={label}
            width={44} height={44}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </motion.div>

        {/* Text */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontWeight: 700, fontSize: 'var(--text-sm)',
            color: 'var(--color-text)', lineHeight: 1.3,
          }}>
            {label}
          </p>
          <p style={{
            fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
            marginTop: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {handle}
          </p>
        </div>

        {/* Arrow */}
        <motion.span
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.25 }}
          transition={{ duration: 0.2 }}
          style={{ color: 'var(--color-text-faint)', fontSize: 16, flexShrink: 0 }}
        >
          →
        </motion.span>
      </motion.a>
    </Reveal>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 'var(--space-3) var(--space-4)',
  background: 'var(--color-surface-offset)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text)',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 'var(--text-xs)',
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  marginBottom: 'var(--space-2)',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent]  = useState(false)

  const socials = SOCIALS.map(s => ({
    ...s,
    href:
      s.hrefKey === 'github'   ? personalInfo.github :
      s.hrefKey === 'linkedin' ? personalInfo.linkedin :
      s.hrefKey === 'email'    ? `mailto:${personalInfo.email}` :
      'https://maps.google.com/?q=Guwahati,Assam,India',
    handle:
      s.hrefKey === 'email'    ? personalInfo.email :
      s.hrefKey === 'location' ? personalInfo.location :
      s.handle,
  }))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body    = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    )
    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section"
      style={{
        background: 'var(--color-surface)',
        paddingBlock: 'clamp(var(--space-10), 5vw, var(--space-16))',
        position: 'relative', zIndex: 1,
      }}
    >
      <InjectContactStyles />
      <div className="container">

        {/* ── Heading ── */}
        <Reveal style={{ marginBottom: 'var(--space-10)' }}>
          <p style={{
            fontSize: 'var(--text-xs)', color: 'var(--color-primary)',
            fontWeight: 700, marginBottom: 'var(--space-2)',
            textTransform: 'uppercase', letterSpacing: '0.14em',
          }}>
            Get In Touch
          </p>
          <h2 id="contact-heading" style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
            fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            Let&apos;s build something{' '}
            <span className="gradient-text">together</span>
          </h2>
          <p style={{
            marginTop: 'var(--space-3)', color: 'var(--color-text-muted)',
            fontSize: 'var(--text-base)', maxWidth: '50ch', lineHeight: 1.7,
          }}>
            I&apos;m open to internship and full-time opportunities. Whether you have
            a project idea or just want to say hi — my inbox is always open.
          </p>
        </Reveal>

        {/* ── Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(var(--space-6), 4vw, var(--space-10))',
          alignItems: 'start',
        }}>

          {/* ── LEFT: Social cards ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {socials.map((s, i) => (
              <SocialCard
                key={s.label}
                label={s.label}
                handle={s.handle}
                href={s.href}
                logo={s.logo}
                bg={s.bg}
                hoverBg={s.hoverBg}
                glow={s.glow}
                radius={s.radius}
                delay={0.06 + i * 0.08}
              />
            ))}

            {/* Availability badge */}
            <Reveal delay={0.42}>
              <div style={{
                marginTop: 'var(--space-2)',
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'oklch(from var(--color-success) l c h / 0.08)',
                border: '1px solid oklch(from var(--color-success) l c h / 0.25)',
                borderRadius: 'var(--radius-xl)',
              }}>
                <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: 'var(--color-success)', display: 'block',
                  }} />
                  <span style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'var(--color-success)',
                    animation: 'ping 1.5s ease-in-out infinite', opacity: 0.4,
                  }} />
                </span>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-success)' }}>
                    Available for opportunities
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: 1 }}>
                    Actively looking · Guwahati / Remote
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT: Contact form ── */}
          <Reveal delay={0.12} x={24} y={0}>
            <form
              onSubmit={handleSubmit}
              className="glow-card"
              style={{
                padding: 'var(--space-6)',
                display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
              }}
            >
              <div>
                <label htmlFor="contact-name" style={labelStyle}>Name</label>
                <input
                  id="contact-name" type="text" name="name" required
                  placeholder="Your name" value={form.name} onChange={handleChange}
                  className="contact-input" style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="contact-email" style={labelStyle}>Email</label>
                <input
                  id="contact-email" type="email" name="email" required
                  placeholder="your@email.com" value={form.email} onChange={handleChange}
                  className="contact-input" style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="contact-message" style={labelStyle}>Message</label>
                <textarea
                  id="contact-message" name="message" required rows={5}
                  placeholder="Tell me about your project or opportunity..."
                  value={form.message} onChange={handleChange}
                  className="contact-input"
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ y: -2, boxShadow: '0 8px 24px oklch(from var(--color-primary) l c h / 0.35)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', gap: 'var(--space-2)',
                  padding: 'var(--space-3) var(--space-6)',
                  background: 'var(--color-primary)', color: 'white',
                  borderRadius: 'var(--radius-full)', fontWeight: 700,
                  fontSize: 'var(--text-sm)', border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 16px oklch(from var(--color-primary) l c h / 0.3)',
                  transition: 'background var(--transition-interactive)',
                  width: '100%',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={sent ? 'sent' : 'idle'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    {sent
                      ? <>✅ Opening email client...</>
                      : <><Send size={15} /> Send Message</>
                    }
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </form>
          </Reveal>

        </div>
      </div>
    </section>
  )
}
