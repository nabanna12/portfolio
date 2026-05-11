// src/App.tsx
import ThreeBackground from './components/ThreeBackground'
import Navbar   from './components/Navbar'
import Hero     from './components/Hero'
import About    from './components/About'
import Skills   from './components/Skills'
import Projects from './components/Projects'
import Resume   from './components/Resume'
import Contact  from './components/Contact'
import Footer   from './components/Footer'
import { useCursor } from './hooks/useCursor'

export default function App() {
  const { dotRef, ringRef } = useCursor()

  return (
    <>
      {/* Custom cursor */}
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />

      {/* Full-page 3D background — fixed, sits behind everything */}
      <ThreeBackground />

      <Navbar />

      {/* zIndex: 1 lifts all content above the Three.js canvas */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Resume />
        <Contact />
      </main>

      <Footer />

      <style>{`
        footer {
          position: relative;
          z-index: 1;
        }
        @media (hover: none) {
          .cursor-dot, .cursor-ring { display: none; }
          body, button { cursor: auto !important; }
        }
      `}</style>
    </>
  )
}