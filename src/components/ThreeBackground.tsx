Here is an enhanced Three.js background component with creative visual effects.
```tsx
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
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Theme colors ────────────────────────────────────────────────────────
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
    const primaryColor = new THREE.Color(isDark ? '#2dd4bf' : '#0d9488')
    const accentColor = new THREE.Color(isDark ? '#fbbf24' : '#d97706')
    const neutralColor = new THREE.Color(isDark ? '#3a3a37' : '#c0bebb')
    const glowColor = new THREE.Color(isDark ? '#818cf8' : '#6366f1')
    const warmColor = new THREE.Color(isDark ? '#f472b6' : '#db2777')

    // ── Particle System (Main) ──────────────────────────────────────────────
    const particleCount = 1200
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution with some randomness
      const radius = 40 + Math.random() * 30
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.8 // Flatten slightly
      positions[i * 3 + 2] = radius * Math.cos(phi) - 15
      
      // Color based on position and randomness
      const r = Math.random()
      let c
      if (r < 0.12) c = glowColor
      else if (r < 0.24) c = warmColor
      else if (r < 0.4) c = accentColor
      else if (r < 0.6) c = primaryColor
      else c = neutralColor
      
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
      
      sizes[i] = 0.12 + Math.random() * 0.2
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.7 : 0.5,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── Second Particle Layer (Stars / Dust) ────────────────────────────────
    const dustCount = 2000
    const dustPositions = new Float32Array(dustCount * 3)
    const dustColors = new Float32Array(dustCount * 3)

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 180
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 120
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 20
      
      const brightness = 0.3 + Math.random() * 0.5
      dustColors[i * 3] = brightness * (isDark ? 0.8 : 0.6)
      dustColors[i * 3 + 1] = brightness * (isDark ? 0.9 : 0.7)
      dustColors[i * 3 + 2] = brightness
    }

    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3))

    const dustMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.4 : 0.2,
      sizeAttenuation: true,
    })

    const dustParticles = new THREE.Points(dustGeo, dustMat)
    scene.add(dustParticles)

    // ── Floating Shapes (Enhanced) ──────────────────────────────────────────
    const shapeDefs = [
      { geo: new THREE.IcosahedronGeometry(3.8, 0), color: primaryColor, pos: [-24, 20, -12], rSpeed: [0.002, 0.004], floatAmp: 0.8, floatSpeed: 0.4 },
      { geo: new THREE.OctahedronGeometry(2.5, 0), color: accentColor, pos: [22, -8, -8], rSpeed: [0.003, 0.003], floatAmp: 0.6, floatSpeed: 0.5 },
      { geo: new THREE.TetrahedronGeometry(2.8, 0), color: glowColor, pos: [-20, -28, -14], rSpeed: [0.002, 0.005], floatAmp: 0.7, floatSpeed: 0.45 },
      { geo: new THREE.DodecahedronGeometry(2.2, 0), color: warmColor, pos: [24, 42, -7], rSpeed: [0.004, 0.002], floatAmp: 0.5, floatSpeed: 0.6 },
      { geo: new THREE.OctahedronGeometry(2.0, 0), color: neutralColor, pos: [-26, -48, -15], rSpeed: [0.003, 0.004], floatAmp: 0.6, floatSpeed: 0.5 },
      { geo: new THREE.IcosahedronGeometry(3.2, 0), color: primaryColor, pos: [20, 62, -10], rSpeed: [0.003, 0.003], floatAmp: 0.9, floatSpeed: 0.35 },
      { geo: new THREE.TorusKnotGeometry(1.8, 0.5, 64, 8, 3, 4), color: glowColor, pos: [-15, -55, -5], rSpeed: [0.005, 0.003], floatAmp: 0.7, floatSpeed: 0.5 },
      { geo: new THREE.SphereGeometry(2.0, 16, 16), color: warmColor, pos: [28, -70, -12], rSpeed: [0.002, 0.004], floatAmp: 0.5, floatSpeed: 0.6 },
    ]

    const meshes: { mesh: THREE.Mesh; rSpeed: number[]; baseY: number; floatAmp: number; floatSpeed: number; originalMat: THREE.Material }[] = []

    shapeDefs.forEach(({ geo, color, pos, rSpeed, floatAmp, floatSpeed }) => {
      const mat = new THREE.MeshStandardMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.12 : 0.07,
        emissive: color,
        emissiveIntensity: isDark ? 0.08 : 0.03,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(pos[0], pos[1], pos[2])
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      scene.add(mesh)
      meshes.push({ mesh, rSpeed, baseY: pos[1], floatAmp, floatSpeed, originalMat: mat })
    })

    // ── Floating Orbs (Glowing Spheres) ─────────────────────────────────────
    const orbCount = 5
    const orbs: { mesh: THREE.Mesh; baseY: number; floatAmp: number; floatSpeed: number; pulseSpeed: number; originalScale: number }[] = []

    for (let i = 0; i < orbCount; i++) {
      const size = 1.2 + Math.random() * 1.5
      const orbColor = i % 2 === 0 ? glowColor : warmColor
      const orbMat = new THREE.MeshStandardMaterial({
        color: orbColor,
        emissive: orbColor,
        emissiveIntensity: isDark ? 0.4 : 0.15,
        transparent: true,
        opacity: 0.25,
        roughness: 0.3,
        metalness: 0.1,
      })
      const orb = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 32), orbMat)
      const xPos = (Math.random() - 0.5) * 70
      const zPos = (Math.random() - 0.5) * 40 - 10
      orb.position.set(xPos, (Math.random() - 0.5) * 100, zPos)
      scene.add(orb)
      orbs.push({
        mesh: orb,
        baseY: orb.position.y,
        floatAmp: 1.5 + Math.random() * 2,
        floatSpeed: 0.3 + Math.random() * 0.4,
        pulseSpeed: 0.5 + Math.random() * 0.5,
        originalScale: size,
      })
    }

    // ── Particle Rings / Orbits ─────────────────────────────────────────────
    const ringParticleCount = 300
    const ringPositions = new Float32Array(ringParticleCount * 3)
    const ringColors = new Float32Array(ringParticleCount * 3)

    for (let i = 0; i < ringParticleCount; i++) {
      const angle = (i / ringParticleCount) * Math.PI * 2
      const radius = 28
      ringPositions[i * 3] = Math.cos(angle) * radius
      ringPositions[i * 3 + 1] = Math.sin(angle) * radius * 0.3
      ringPositions[i * 3 + 2] = -5 + Math.sin(angle * 2) * 2
      
      const mixColor = primaryColor.clone().lerp(accentColor, Math.sin(angle))
      ringColors[i * 3] = mixColor.r
      ringColors[i * 3 + 1] = mixColor.g
      ringColors[i * 3 + 2] = mixColor.b
    }

    const ringGeo = new THREE.BufferGeometry()
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3))
    ringGeo.setAttribute('color', new THREE.BufferAttribute(ringColors, 3))

    const ringMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.5 : 0.3,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })

    const ring = new THREE.Points(ringGeo, ringMat)
    scene.add(ring)

    // ── Connecting Lines (Dynamic) ──────────────────────────────────────────
    const linePositions: number[] = []
    const lineColors: number[] = []
    const maxDist = 14
    const maxLines = 200
    let lineCount = 0

    for (let i = 0; i < particleCount && lineCount < maxLines; i++) {
      for (let j = i + 1; j < particleCount && lineCount < maxLines; j++) {
        const dx = positions[i * 3] - positions[j * 3]
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < maxDist && dist > 2) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
          )
          const alpha = 1 - dist / maxDist
          const lineColor = primaryColor.clone().lerp(accentColor, Math.random())
          for (let k = 0; k < 2; k++) {
            lineColors.push(lineColor.r * alpha, lineColor.g * alpha, lineColor.b * alpha)
          }
          lineCount++
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3))
    lineGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineColors), 3))
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.1 : 0.05,
    })
    const lineNetwork = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineNetwork)

    // ── Ambient Light & Fog ─────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)
    
    const backLight = new THREE.PointLight(0x2dd4bf, 0.5)
    backLight.position.set(0, 0, 20)
    scene.add(backLight)
    
    scene.fog = new THREE.FogExp2(isDark ? 0x000000 : 0x111111, isDark ? 0.008 : 0.012)

    // ── Mouse tracking ──────────────────────────────────────────────────────
    let mouseX = 0
    let mouseY = 0
    let targetRotationX = 0
    let targetRotationY = 0
    
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
      targetRotationY = mouseX * 0.3
      targetRotationX = mouseY * 0.15
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    // ── Scroll ──────────────────────────────────────────────────────────────
    let scrollY = 0
    const onScroll = () => {
      scrollY = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── Resize ──────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize, { passive: true })

    // ── Animation loop ──────────────────────────────────────────────────────
    let t = 0
    let animId: number
    let currentRotX = 0
    let currentRotY = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.004

      // Smooth camera follow
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
      const scrollFrac = scrollY / maxScroll
      const targetCamY = scrollFrac * -70
      camera.position.y += (targetCamY - camera.position.y) * 0.05
      
      // Mouse parallax with smoothing
      currentRotX += (targetRotationX - currentRotX) * 0.05
      currentRotY += (targetRotationY - currentRotY) * 0.05
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.02
      camera.lookAt(currentRotX * 2, currentRotY * 2, 0)

      // Main particle system rotation and pulsation
      particles.rotation.y = t * 0.02
      particles.rotation.x = Math.sin(t * 0.1) * 0.1
      
      // Dust particles slow drift
      dustParticles.rotation.y = t * 0.005
      dustParticles.rotation.x = t * 0.003
      
      // Ring rotation
      ring.rotation.x = Math.sin(t * 0.2) * 0.5
      ring.rotation.y = t * 0.15
      ring.rotation.z = Math.cos(t * 0.1) * 0.3
      
      // Line network follows main particles
      lineNetwork.rotation.y = particles.rotation.y
      lineNetwork.rotation.x = particles.rotation.x

      // Shapes rotation + floating with individual characteristics
      meshes.forEach(({ mesh, rSpeed, baseY, floatAmp, floatSpeed, originalMat }) => {
        mesh.rotation.x += rSpeed[0]
        mesh.rotation.y += rSpeed[1]
        mesh.position.y = baseY + Math.sin(t * floatSpeed + baseY * 0.1) * floatAmp
        
        // Pulse material opacity
        if (originalMat instanceof THREE.MeshStandardMaterial) {
          const pulse = 0.08 + Math.sin(t * 0.8 + baseY) * 0.04
          originalMat.emissiveIntensity = isDark ? pulse : pulse * 0.5
        }
      })

      // Animate orbs - floating and pulsing
      orbs.forEach((orb, idx) => {
        orb.mesh.position.y = orb.baseY + Math.sin(t * orb.floatSpeed + idx) * orb.floatAmp
        const scale = orb.originalScale + Math.sin(t * orb.pulseSpeed) * 0.15
        orb.mesh.scale.setScalar(scale)
        
        if (orb.mesh.material instanceof THREE.MeshStandardMaterial) {
          const intensity = 0.25 + Math.sin(t * orb.pulseSpeed * 1.5) * 0.15
          orb.mesh.material.emissiveIntensity = isDark ? intensity : intensity * 0.6
        }
      })

      // Dynamic particle size based on distance from center
      const timeScale = 0.5 + Math.sin(t * 1.5) * 0.1
      particleMat.size = 0.18 * timeScale

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)

      particleGeo.dispose()
      particleMat.dispose()
      dustGeo.dispose()
      dustMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      
      shapeDefs.forEach(s => s.geo.dispose())
      meshes.forEach(({ mesh, originalMat }) => {
        originalMat.dispose()
        mesh.geometry.dispose()
      })
      orbs.forEach(({ mesh }) => {
        (mesh.material as THREE.Material).dispose()
        mesh.geometry.dispose()
      })
      
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
      }}
    />
  )
}
```
