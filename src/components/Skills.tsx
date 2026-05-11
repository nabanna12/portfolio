import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { skills } from '../data/portfolio'

function Track({ reverse = false }: { reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let x = reverse ? -50 : 0
    let raf: number

    const animate = () => {
      x += reverse ? 0.4 : -0.4
      if (x <= -50) x = 0
      if (x >= 0 && reverse) x = -50
      track.style.transform = `translateX(${x}%)`
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [reverse])

  const doubled = [...skills, ...skills]

  return (
    <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
      <div
        ref={trackRef}
        style={{ display: 'flex', gap: 'var(--space-3)', width: 'max-content', willChange: 'transform' }}
      >
        {doubled.map((skill, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: 'var(--space-3) var(--space-5)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              whiteSpace: 'nowrap', flexShrink: 0,
              fontSize: 'var(--text-sm)', fontWeight: 500,
              color: 'var(--color-text-muted)',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{skill.icon}</span>
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" style={{
      paddingBlock: 'clamp(var(--space-12), 6vw, var(--space-24))',
      overflow: 'hidden',
    }}>
      <div className="container" style={{ marginBottom: 'var(--space-12)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p style={{
            fontSize: 'var(--text-sm)', color: 'var(--color-primary)',
            fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.1em', marginBottom: 'var(--space-2)',
          }}>
            Tech Stack
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
            fontWeight: 700, letterSpacing: '-0.02em',
          }}>
            Tools I <span className="gradient-text">build with</span>
          </h2>
        </motion.div>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}>
        <Track />
        <Track reverse />
      </div>
    </section>
  )
}