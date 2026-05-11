import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ────────────────────────────────────────────────────────────
    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Theme colors ────────────────────────────────────────────────────────
    const isDark        = document.documentElement.getAttribute('data-theme') !== 'light'
    const primaryColor  = new THREE.Color(isDark ? '#2dd4bf' : '#0d9488')
    const accentColor   = new THREE.Color(isDark ? '#fbbf24' : '#d97706')
    const neutralColor  = new THREE.Color(isDark ? '#3a3a37' : '#c0bebb')

    // ── Particles ───────────────────────────────────────────────────────────
    const particleCount = 700
    const positions     = new Float32Array(particleCount * 3)
    const colors        = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 120   // wider X spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200   // tall Y — covers full page scroll
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60
      const r = Math.random()
      const c = r < 0.15 ? primaryColor : r < 0.28 ? accentColor : neutralColor
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors,    3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.22, vertexColors: true,
      transparent: true, opacity: isDark ? 0.65 : 0.45,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── 3-D Floating Shapes ─────────────────────────────────────────────────
    // Spread shapes across the full Y range so they appear in every section
    const shapeDefs = [
      { geo: new THREE.IcosahedronGeometry(3.5, 0), color: primaryColor, pos: [-22,  18, -8],  rSpeed: [0.003, 0.005] },
      { geo: new THREE.OctahedronGeometry(2.2,  0), color: accentColor,  pos: [ 20, -5,  -6],  rSpeed: [0.004, 0.003] },
      { geo: new THREE.TetrahedronGeometry(2.5,  0), color: primaryColor, pos: [-18, -24, -10], rSpeed: [0.002, 0.006] },
      { geo: new THREE.IcosahedronGeometry(2.0,  0), color: accentColor,  pos: [ 22,  38, -5],  rSpeed: [0.005, 0.002] },
      { geo: new THREE.OctahedronGeometry(1.8,  0), color: neutralColor,  pos: [-24, -45, -12], rSpeed: [0.003, 0.004] },
      { geo: new THREE.TetrahedronGeometry(3.0,  0), color: primaryColor, pos: [ 18,  58, -8],  rSpeed: [0.004, 0.003] },
    ]

    const meshes: { mesh: THREE.Mesh; rSpeed: number[]; baseY: number }[] = []

    shapeDefs.forEach(({ geo, color, pos, rSpeed }) => {
      const mat  = new THREE.MeshBasicMaterial({
        color, wireframe: true, transparent: true,
        opacity: isDark ? 0.14 : 0.09,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(pos[0], pos[1], pos[2])
      // Random initial rotation so shapes look different
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      scene.add(mesh)
      meshes.push({ mesh, rSpeed, baseY: pos[1] })
    })

    // ── Connecting lines between nearby particles (sparse graph) ────────────
    // Gives a neural-network / circuit feel
    const linePositions: number[] = []
    const lineColors: number[]    = []
    const maxDist  = 12
    const maxLines = 120

    let lineCount = 0
    for (let i = 0; i < particleCount && lineCount < maxLines; i++) {
      for (let j = i + 1; j < particleCount && lineCount < maxLines; j++) {
        const dx = positions[i * 3]     - positions[j * 3]
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < maxDist) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
          )
          const alpha = 1 - dist / maxDist
          lineColors.push(
            primaryColor.r * alpha, primaryColor.g * alpha, primaryColor.b * alpha,
            primaryColor.r * alpha, primaryColor.g * alpha, primaryColor.b * alpha,
          )
          lineCount++
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3))
    lineGeo.setAttribute('color',    new THREE.BufferAttribute(new Float32Array(lineColors), 3))
    const lineMat  = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true,
      opacity: isDark ? 0.12 : 0.07,
    })
    const lineNetwork = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineNetwork)

    // ── Mouse tracking ──────────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.7) * 2
      mouseY = -(e.clientY / window.innerHeight - 0.7) * 2
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    // ── Scroll → move camera Y so scene follows the page ───────────────────
    // This is the key trick: as user scrolls, camera moves down in 3D space
    let scrollY = 0
    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── Resize ──────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize, { passive: true })

    // ── Animation loop ──────────────────────────────────────────────────────
    let t = 0, animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.003

      // Scroll parallax: map scrollY → camera Y
      // document.body.scrollHeight varies, so normalise to a -60..60 range
      const maxScroll  = Math.max(document.body.scrollHeight - window.innerHeight, 1)
      const scrollFrac = scrollY / maxScroll          // 0 → 1
      const targetCamY = scrollFrac * -80             // moves camera down through the scene
      camera.position.y += (targetCamY - camera.position.y) * 0.06   // smooth lerp

      // Mouse parallax on X
      camera.position.x += (mouseX * 4 - camera.position.x) * 0.025

      // Particle slow drift
      particles.rotation.y = t * 0.025
      particles.rotation.x = t * 0.008

      // Line network follows particles
      lineNetwork.rotation.y = particles.rotation.y
      lineNetwork.rotation.x = particles.rotation.x

      // Shapes rotate + float
      meshes.forEach(({ mesh, rSpeed, baseY }, i) => {
        mesh.rotation.x += rSpeed[0]
        mesh.rotation.y += rSpeed[1]
        // Subtle bobbing — offset per shape so they don't sync
        mesh.position.y = baseY + Math.sin(t * 0.6 + i * 1.3) * 0.6
      })

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll',    onScroll)
      window.removeEventListener('resize',    onResize)

      particleGeo.dispose()
      particleMat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      shapeDefs.forEach(s => s.geo.dispose())
      meshes.forEach(({ mesh }) => (mesh.material as THREE.Material).dispose())
      renderer.dispose()

      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden
      style={{
        position: 'fixed',      // ← fixed instead of absolute = covers full viewport always
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        contain: 'strict',
      }}
    />
  )
}