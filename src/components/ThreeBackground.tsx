import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({
      antialias: false,           // off = big GPU win, barely visible difference
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)) // cap at 1× — 2× DPR = 4× fill
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Theme colors ────────────────────────────────────────────────────────
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
    const primaryColor  = new THREE.Color(isDark ? '#2dd4bf' : '#0d9488')
    const accentColor   = new THREE.Color(isDark ? '#fbbf24' : '#d97706')
    const neutralColor  = new THREE.Color(isDark ? '#3a3a37' : '#c0bebb')
    const glowColor     = new THREE.Color(isDark ? '#818cf8' : '#6366f1')
    const warmColor     = new THREE.Color(isDark ? '#f472b6' : '#db2777')

    // ── Main Particle System (reduced 1200 → 600) ───────────────────────────
    const particleCount = 600
    const positions = new Float32Array(particleCount * 3)
    const colors    = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const radius = 40 + Math.random() * 30
      const theta  = Math.random() * Math.PI * 2
      const phi    = Math.acos(2 * Math.random() - 1)
      positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.8
      positions[i * 3 + 2] = radius * Math.cos(phi) - 15

      const r = Math.random()
      const c = r < 0.12 ? glowColor : r < 0.24 ? warmColor : r < 0.4 ? accentColor : r < 0.6 ? primaryColor : neutralColor
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors,    3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.7 : 0.5,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,          // skip depth writes for transparent points
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── Dust Layer (reduced 2000 → 800) ─────────────────────────────────────
    const dustCount     = 800
    const dustPositions = new Float32Array(dustCount * 3)
    const dustColors    = new Float32Array(dustCount * 3)

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3]     = (Math.random() - 0.5) * 180
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 120
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 20
      const brightness       = 0.3 + Math.random() * 0.5
      dustColors[i * 3]     = brightness * (isDark ? 0.8 : 0.6)
      dustColors[i * 3 + 1] = brightness * (isDark ? 0.9 : 0.7)
      dustColors[i * 3 + 2] = brightness
    }

    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    dustGeo.setAttribute('color',    new THREE.BufferAttribute(dustColors,    3))
    const dustMat = new THREE.PointsMaterial({
      size: 0.06, vertexColors: true, transparent: true,
      opacity: isDark ? 0.35 : 0.18, sizeAttenuation: true, depthWrite: false,
    })
    const dustParticles = new THREE.Points(dustGeo, dustMat)
    scene.add(dustParticles)

    // ── Floating Shapes — MeshBasicMaterial (NO PBR lighting cost) ──────────
    const shapeDefs = [
      { geo: new THREE.IcosahedronGeometry(3.8, 0), color: primaryColor, pos: [-24, 20,  -12], rSpeed: [0.002, 0.004], floatAmp: 0.8, floatSpeed: 0.4  },
      { geo: new THREE.OctahedronGeometry(2.5,  0), color: accentColor,  pos: [ 22, -8,   -8], rSpeed: [0.003, 0.003], floatAmp: 0.6, floatSpeed: 0.5  },
      { geo: new THREE.TetrahedronGeometry(2.8,  0), color: glowColor,   pos: [-20,-28,  -14], rSpeed: [0.002, 0.005], floatAmp: 0.7, floatSpeed: 0.45 },
      { geo: new THREE.DodecahedronGeometry(2.2, 0), color: warmColor,   pos: [ 24, 42,   -7], rSpeed: [0.004, 0.002], floatAmp: 0.5, floatSpeed: 0.6  },
      { geo: new THREE.OctahedronGeometry(2.0,  0), color: neutralColor, pos: [-26,-48,  -15], rSpeed: [0.003, 0.004], floatAmp: 0.6, floatSpeed: 0.5  },
    ]

    const meshes: { mesh: THREE.Mesh; rSpeed: number[]; baseY: number; floatAmp: number; floatSpeed: number }[] = []

    shapeDefs.forEach(({ geo, color, pos, rSpeed, floatAmp, floatSpeed }) => {
      // MeshBasicMaterial: no lighting calculations at all — huge GPU saving
      const mat = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.12 : 0.07,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(pos[0], pos[1], pos[2])
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      scene.add(mesh)
      meshes.push({ mesh, rSpeed, baseY: pos[1], floatAmp, floatSpeed })
    })

    // ── Particle Ring (reduced 300 → 150) ───────────────────────────────────
    const ringCount     = 150
    const ringPositions = new Float32Array(ringCount * 3)
    const ringColors    = new Float32Array(ringCount * 3)

    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2
      const radius = 28
      ringPositions[i * 3]     = Math.cos(angle) * radius
      ringPositions[i * 3 + 1] = Math.sin(angle) * radius * 0.3
      ringPositions[i * 3 + 2] = -5 + Math.sin(angle * 2) * 2
      const mixColor = primaryColor.clone().lerp(accentColor, Math.sin(angle))
      ringColors[i * 3]     = mixColor.r
      ringColors[i * 3 + 1] = mixColor.g
      ringColors[i * 3 + 2] = mixColor.b
    }

    const ringGeo = new THREE.BufferGeometry()
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3))
    ringGeo.setAttribute('color',    new THREE.BufferAttribute(ringColors,    3))
    const ringMat = new THREE.PointsMaterial({
      size: 0.15, vertexColors: true, transparent: true,
      opacity: isDark ? 0.5 : 0.3, blending: THREE.AdditiveBlending,
      sizeAttenuation: true, depthWrite: false,
    })
    const ring = new THREE.Points(ringGeo, ringMat)
    scene.add(ring)

    // ── Ambient Light (single, no point lights) ──────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    scene.fog = new THREE.FogExp2(isDark ? 0x000000 : 0x111111, isDark ? 0.008 : 0.012)

    // ── Mouse / Scroll / Resize ──────────────────────────────────────────────
    let mouseX = 0, mouseY = 0
    let targetRotX = 0, targetRotY = 0
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
      targetRotY = mouseX * 0.3
      targetRotX = mouseY * 0.15
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    let scrollY = 0
    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Cache maxScroll — recompute only on resize, not every frame
    let maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
    }
    window.addEventListener('resize', onResize, { passive: true })

    // ── Animation loop ───────────────────────────────────────────────────────
    let t = 0
    let animId: number
    let currentRotX = 0
    let currentRotY = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.004

      // Camera — scroll + mouse parallax
      const scrollFrac = scrollY / maxScroll
      camera.position.y += (scrollFrac * -70 - camera.position.y) * 0.05
      currentRotX += (targetRotX - currentRotX) * 0.05
      currentRotY += (targetRotY - currentRotY) * 0.05
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.02
      camera.lookAt(currentRotX * 2, currentRotY * 2, 0)

      // Particle groups — simple rotation only, no per-particle updates
      particles.rotation.y = t * 0.02
      particles.rotation.x = Math.sin(t * 0.1) * 0.1
      dustParticles.rotation.y = t * 0.005
      dustParticles.rotation.x = t * 0.003
      ring.rotation.x = Math.sin(t * 0.2) * 0.5
      ring.rotation.y = t * 0.15
      ring.rotation.z = Math.cos(t * 0.1) * 0.3

      // Shapes — rotation + float (no material mutations)
      meshes.forEach(({ mesh, rSpeed, baseY, floatAmp, floatSpeed }) => {
        mesh.rotation.x += rSpeed[0]
        mesh.rotation.y += rSpeed[1]
        mesh.position.y  = baseY + Math.sin(t * floatSpeed + baseY * 0.1) * floatAmp
      })

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      particleGeo.dispose(); particleMat.dispose()
      dustGeo.dispose();     dustMat.dispose()
      ringGeo.dispose();     ringMat.dispose()
      shapeDefs.forEach(s => s.geo.dispose())
      meshes.forEach(({ mesh }) => { ;(mesh.material as THREE.Material).dispose(); mesh.geometry.dispose() })
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        contain: 'strict',
        willChange: 'transform',
      }}
    />
  )
}
