import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const navLinks = [
  { label: 'HOME',     href: '#home'     },
  { label: 'ABOUT',    href: '#about'    },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'RESUME',   href: '#resume'   },
  { label: 'CONTACT',  href: '#contact'  },
]

// ── Active-link pill that slides between items ─────────────────────────────
function NavLink({ link, active }: {
  link: { label: string; href: string }
  active: boolean
}) {
  return (
    <li style={{ position: 'relative' }}>
      <a
        href={link.href}
        style={{
          position: 'relative', zIndex: 1,
          fontSize: 'var(--text-xs)', fontWeight: 600,
          letterSpacing: '0.08em',
          color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
          textDecoration: 'none',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-full)',
          transition: 'color 0.2s ease',
          display: 'block',
        }}
      >
        {link.label}
        {active && (
          <motion.span
            layoutId="nav-active-dot"
            style={{
              position: 'absolute', bottom: 2, left: '50%',
              transform: 'translateX(-50%)',
              width: 4, height: 4,
              borderRadius: '50%',
              background: 'var(--color-primary)',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </a>
    </li>
  )
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active,   setActive]   = useState('home')

  // ── 3-D tilt ──────────────────────────────────────────────────────────────
  const navRef  = useRef<HTMLElement>(null)
  const mouseX  = useMotionValue(0)
  const mouseY  = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-1, 1], [ 1.2, -1.2])
  const rotateY = useTransform(mouseX, [-1, 1], [-1.5,  1.5])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = navRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(((e.clientX - rect.left)  / rect.width  - 0.5) * 2)
    mouseY.set(((e.clientY - rect.top)   / rect.height - 0.5) * 2)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0); mouseY.set(0)
  }, [mouseX, mouseY])

  // ── Spotlight ──────────────────────────────────────────────────────────────
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null)

  const onNavMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = navRef.current?.getBoundingClientRect()
    if (!rect) return
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    handleMouseMove(e)
  }

  // ── Scroll listener ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Active section tracker ─────────────────────────────────────────────────
  useEffect(() => {
    const ids = navLinks.map(l => l.href.slice(1))
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { threshold: 0.4 }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* ── Perspective wrapper — full width, centered ─────────────────────── */}
      <div style={{
        position: 'fixed', top: 16, left: 0, right: 0,
        zIndex: 1000, perspective: 1200,
        display: 'flex', justifyContent: 'center',
        padding: '0 clamp(1rem, 4vw, 3rem)',
      }}>
        <motion.nav
          ref={navRef}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0,    opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            rotateX, rotateY,
            transformStyle: 'preserve-3d',
            width: '100%',
            maxWidth: 1100,
            height: 60,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 var(--space-6)',
            borderRadius: 'var(--radius-2xl)',

            // ── Glassmorphism ──────────────────────────────────────────────
            background: scrolled
              ? 'oklch(from var(--color-surface) l c h / 0.55)'
              : 'oklch(from var(--color-surface) l c h / 0.35)',
            backdropFilter:         'blur(24px) saturate(160%) brightness(1.08)',
            WebkitBackdropFilter:   'blur(24px) saturate(160%) brightness(1.08)',

            // ── 3-D raised slab borders ────────────────────────────────────
            border: '1px solid oklch(from var(--color-text) l c h / 0.10)',
            boxShadow: `
              0  1px 0 0 oklch(from var(--color-text-inverse) l c h / 0.18) inset,
              0 -1px 0 0 oklch(from var(--color-text)         l c h / 0.06) inset,
              0  8px 32px oklch(0 0 0 / 0.18),
              0  2px  8px oklch(0 0 0 / 0.10),
              0  0   0 1px oklch(from var(--color-primary) l c h / ${scrolled ? '0.08' : '0'})
            `,

            overflow: 'hidden',
            willChange: 'transform',
            transition: 'background 0.4s ease, box-shadow 0.4s ease',
            position: 'relative',
          }}
          onMouseMove={onNavMouseMove}
          onMouseLeave={() => { handleMouseLeave(); setSpot(null) }}
        >

          {/* ── Spotlight follow ─────────────────────────────────────────── */}
          {spot && (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                left: spot.x - 80, top: spot.y - 80,
                width: 160, height: 160,
                borderRadius: '50%',
                background: 'radial-gradient(circle, oklch(from var(--color-primary) l c h / 0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* ── Top-surface sheen (3-D depth layer) ──────────────────────── */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(160deg, oklch(from var(--color-text-inverse) l c h / 0.06) 0%, transparent 55%)',
            borderRadius: 'inherit',
          }} />

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <a
            href="#home"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, zIndex: 1 }}
          >
            <motion.div
              whileHover={{ scale: 1.08, rotateZ: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="NC Logo">
                <rect width="32" height="32" rx="8" fill="var(--color-primary)" opacity="0.15"/>
                <rect x="1" y="1" width="30" height="30" rx="7"
                  stroke="var(--color-primary)" strokeWidth="1.5" fill="none"/>
                <rect x="4" y="4" width="24" height="24" rx="5"
                  fill="none" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.3"/>
                <text x="16" y="22" fontFamily="var(--font-display)" fontWeight="700"
                  fontSize="15" fill="var(--color-primary)" textAnchor="middle">N</text>
              </svg>
            </motion.div>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'var(--text-sm)', color: 'var(--color-text)',
              letterSpacing: '-0.02em',
            }}>
              Nabanna
            </span>
          </a>

          {/* ── Desktop nav links ─────────────────────────────────────────── */}
          <ul
            className="desktop-nav"
            style={{
              display: 'flex', gap: 'var(--space-1)',
              listStyle: 'none', margin: 0, padding: 0,
              position: 'absolute', left: '50%',
              transform: 'translateX(-50%)',   // ← perfectly centered
              zIndex: 1,
            }}
          >
            {navLinks.map(link => (
              <NavLink
                key={link.href}
                link={link}
                active={active === link.href.slice(1)}
              />
            ))}
          </ul>

          {/* ── Right controls ────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0, zIndex: 1 }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92, rotateZ: 20 }}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                width: 36, height: 36, borderRadius: 'var(--radius-full)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'oklch(from var(--color-surface-offset) l c h / 0.8)',
                border: '1px solid oklch(from var(--color-text) l c h / 0.10)',
                color: 'var(--color-text-muted)',
                boxShadow: '0 1px 0 oklch(from var(--color-text-inverse) l c h / 0.15) inset',
                cursor: 'pointer',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={theme}
                  initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                  exit={{    rotate:  30, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex' }}
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMenuOpen(o => !o)}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
              style={{
                width: 36, height: 36, borderRadius: 'var(--radius-full)',
                display: 'none', alignItems: 'center', justifyContent: 'center',
                background: 'oklch(from var(--color-surface-offset) l c h / 0.8)',
                border: '1px solid oklch(from var(--color-text) l c h / 0.10)',
                color: 'var(--color-text)',
                cursor: 'pointer',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={menuOpen ? 'x' : 'menu'}
                  initial={{ rotate: -30, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{    rotate:  30, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'flex' }}
                >
                  {menuOpen ? <X size={17} /> : <Menu size={17} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0,   scaleY: 1    }}
            exit={{    opacity: 0, y: -16, scaleY: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', top: 88,
              left: 'clamp(1rem, 4vw, 3rem)',
              right: 'clamp(1rem, 4vw, 3rem)',
              zIndex: 999,
              background: 'oklch(from var(--color-surface) l c h / 0.75)',
              backdropFilter:       'blur(24px) saturate(160%)',
              WebkitBackdropFilter: 'blur(24px) saturate(160%)',
              border: '1px solid oklch(from var(--color-text) l c h / 0.10)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: '0 8px 32px oklch(0 0 0 / 0.18)',
              padding: 'var(--space-5)',
              display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
              transformOrigin: 'top center',
            }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0   }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                style={{
                  fontSize: 'var(--text-sm)', fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: active === link.href.slice(1)
                    ? 'var(--color-primary)'
                    : 'var(--color-text-muted)',
                  textDecoration: 'none',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  background: active === link.href.slice(1)
                    ? 'oklch(from var(--color-primary) l c h / 0.08)'
                    : 'transparent',
                  transition: 'background 0.2s, color 0.2s',
                  display: 'block',
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          nav { transition: none !important; }
        }
      `}</style>
    </>
  )
}