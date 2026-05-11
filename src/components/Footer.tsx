import { personalInfo } from '../data/portfolio'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      padding: 'var(--space-8) 0',
      background: 'var(--color-bg)',
    }}>
      <div className="container" style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 'var(--text-sm)', color: 'var(--color-text)',
        }}>
          Nabanna Choudhury
        </span>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
          Crafted with React · Three.js · Framer Motion · {new Date().getFullYear()}
        </p>
        <a
          href={`mailto:${personalInfo.email}`}
          style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textDecoration: 'none' }}
        >
          {personalInfo.email}
        </a>
      </div>
    </footer>
  )
}