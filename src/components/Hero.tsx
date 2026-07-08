import { useEffect, useRef, useState } from 'react';

const TITLES = ['Full-Stack Developer', 'React & Node.js Engineer', 'UI/UX Enthusiast', 'Open Source Contributor'];

export default function Hero() {
  const [titleIdx, setTitleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter effect
  useEffect(() => {
    const target = TITLES[titleIdx];
    if (typing) {
      if (displayed.length < target.length) {
        timeoutRef.current = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
      } else {
        timeoutRef.current = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setTitleIdx((i) => (i + 1) % TITLES.length);
        setTyping(true);
      }
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, typing, titleIdx]);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'clamp(2rem, 6vw, 6rem) clamp(1rem, 4vw, 3rem)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Greeting */}
      <p
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-primary)',
          marginBottom: 'var(--space-4)',
          opacity: 0.9,
        }}
      >
        Hi, I&apos;m
      </p>

      {/* Name */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.8rem, 1rem + 6vw, 7rem)',
          fontWeight: 700,
          lineHeight: 1.05,
          marginBottom: 'var(--space-4)',
          background: 'linear-gradient(135deg, var(--color-text) 30%, var(--color-primary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Nabanna Choudhury
      </h1>

      {/* Typewriter */}
      <div
        style={{
          fontSize: 'clamp(1.1rem, 0.8rem + 1.5vw, 1.8rem)',
          fontFamily: 'var(--font-display)',
          color: 'var(--color-accent)',
          fontWeight: 500,
          minHeight: '2.4em',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          marginBottom: 'var(--space-8)',
        }}
      >
        <span>{displayed}</span>
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1.1em',
            background: 'var(--color-accent)',
            animation: 'blink 1s step-end infinite',
            borderRadius: '1px',
            marginLeft: '1px',
            flexShrink: 0,
          }}
        />
      </div>

      {/* Bio */}
      <p
        style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-muted)',
          maxWidth: '52ch',
          lineHeight: 1.7,
          marginBottom: 'var(--space-10)',
        }}
      >
        Final-year CSE student from Guwahati, building full-stack web apps with
        modern tools — React, Node.js, TypeScript &amp; MongoDB.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="#projects"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-8)',
            background: 'var(--color-primary)',
            color: 'var(--color-text-inverse)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600, fontSize: 'var(--text-sm)',
            textDecoration: 'none',
            transition: 'background var(--transition-interactive), transform var(--transition-interactive), box-shadow var(--transition-interactive)',
            boxShadow: '0 4px 16px oklch(from var(--color-primary) l c h / 0.3)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-hover)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-primary)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          View Projects
        </a>
        <a
          href="#contact"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-8)',
            background: 'transparent',
            color: 'var(--color-text)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600, fontSize: 'var(--text-sm)',
            textDecoration: 'none',
            border: '1.5px solid var(--color-border)',
            transition: 'border-color var(--transition-interactive), transform var(--transition-interactive)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          Get in Touch
        </a>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 'var(--space-8)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-2)',
          color: 'var(--color-text-faint)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.1em',
          animation: 'scrollBounce 2s ease-in-out infinite',
        }}
      >
        <span style={{ textTransform: 'uppercase' }}>Scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scrollBounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }
      `}</style>
    </section>
  );
}
