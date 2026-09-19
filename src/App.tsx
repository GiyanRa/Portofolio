import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import profilePhoto from './imports/image.png'
import bookstoreImg from './imports/image-18.png'
import journeyscapeImg from './imports/image-15.png'
import indotexImg from './imports/image-16.png'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'

const NAV_LINKS = ['about', 'skills', 'projects', 'experience', 'research', 'contact']

const SKILLS = [
  { category: 'Languages', items: ['TypeScript', 'Python', 'Java', 'Lua', 'SQL', 'PHP'] },
  { category: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'WebGL', 'GraphQL'] },
  { category: 'Backend', items: ['Node.js', 'FastAPI', 'PostgreSQL', 'Laravel'] },
  { category: 'Tools', items: ['Git', 'Linux', 'Antigravity', 'Figma', 'Canva'] },
]

interface ProjectData {
  id: string;
  name: string;
  year: string;
  status: string;
  desc: string;
  tags: string[];
  image: string;
  censor: boolean;
  link?: string;
}

const PROJECTS: ProjectData[] = [
  {
    id: '01', name: 'Fatika Portofolio', year: '2026', status: 'Live Project',
    desc: 'A personal portfolio website for Fatika Rahmanisa, showcasing profile, education, experience, skills, and contact information with a modern green and cream color scheme.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    image: '/portofatika.jpg',
    censor: false,
    link: 'https://fatika-portofolio.vercel.app/',
  },
  {
    id: '02', name: 'BookStore', year: '2026', status: 'Web App',
    desc: 'An end-to-end e-commerce platform featuring product browsing, advanced search, discount management, blog integration, and a comprehensive admin panel. Engineered for high-volume catalog management and active concurrent readership.',
    tags: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 'JavaScript'],
    image: bookstoreImg,
    censor: false,
  },
  {
    id: '03', name: 'JourneyScape', year: '2026', status: 'Web App',
    desc: 'Travel and tourism platform offering tour packages, WhatsApp-based booking, vehicle rental services, and curated destination highlights across Indonesia and abroad.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'WhatsApp API'],
    image: journeyscapeImg,
    censor: false,
  },
  {
    id: '04', name: 'Production Recording System', year: '2024', status: 'Internal App',
    desc: 'Desktop-based application developed during internship to digitize factory floor data entry, track production output, and generate daily manufacturing reports.',
    tags: ['Java', 'MySQL', 'Desktop App', 'Database'],
    image: indotexImg,
    censor: true,
  },
]

const EXPERIENCE = [
  {
    role: 'Admin — IQCP Division', company: 'PT Indotex Lasindo Jaya', period: '3 Months',
    desc: 'Worked in the IQCP (International Quality Control & Production) division, handling export administration and documentation management.',
    tech: ['Export Administration', 'Quality Control', 'Documentation'],
  },
  {
    role: 'Internship — Software Developer', company: 'PT Indotex Lasindo Jaya', period: '3 Months',
    desc: 'Developed a production recording system as a desktop application to digitize and streamline factory floor data entry and reporting.',
    tech: ['Java', 'Application Development', 'Database'],
  },
]

// Reusable animation config for scroll reveal (triggers every time it comes into view)
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const viewportConfig = { once: false, amount: 0.15 }

function HeroBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    // Elements
    const stars: { x: number; y: number; size: number; speed: number }[] = []
    for (let i = 0; i < (width < 768 ? 20 : 50); i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1
      })
    }

    const clouds: { x: number; y: number; length: number; speed: number; color: string; thickness: number }[] = []
    const numClouds = width < 768 ? 15 : 30
    for (let i = 0; i < numClouds; i++) {
      const isDark = Math.random() > 0.5
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 300 + 100,
        speed: (Math.random() * 1.5 + 0.5) * (Math.random() > 0.5 ? 1 : -1),
        thickness: Math.random() * 20 + 10,
        color: isDark ? 'rgba(10, 25, 47, 0.9)' : 'rgba(255, 255, 255, 0.15)'
      })
    }

    let animationFrameId: number

    const render = () => {
      if (!canvas) return

      // Mencegah bulan menjadi lonjong saat di-zoom in dengan sinkronisasi resolusi canvas aktual
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        width = canvas.width = canvas.clientWidth
        height = canvas.height = canvas.clientHeight
      }

      // Responsive logic
      const isMobile = width < 768
      const moonX = isMobile ? width * 0.5 : width * 0.7
      const moonY = isMobile ? height * 0.35 : height * 0.5
      const moonRadius = Math.min(width, height) * (isMobile ? 0.3 : 0.35)

      // Background gradient
      const gradient = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, width)
      gradient.addColorStop(0, '#112240')
      gradient.addColorStop(1, '#0a192f')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // --- Draw Gemini Constellation ---
      // We place it slightly offset from the center
      const geminiCx = isMobile ? width * 0.5 : width * 0.25
      const geminiCy = isMobile ? height * 0.7 : height * 0.4
      // Pastikan skala memiliki batas minimal agar tetap terlihat saat di zoom ekstrem
      const gScale = Math.max(0.6, Math.min(width, height) / 800)

      const geminiPoints = [
        { x: -40, y: -120, name: 'Castor' },   // 0
        { x: 40, y: -100, name: 'Pollux' },    // 1
        { x: -50, y: -50 },                    // 2 Castor neck
        { x: 20, y: -40 },                     // 3 Pollux neck
        { x: -60, y: 30 },                     // 4 Castor waist
        { x: 10, y: 40 },                      // 5 Pollux waist
        { x: -80, y: 110 },                    // 6 Castor foot
        { x: -10, y: 120 },                    // 7 Pollux foot
        { x: -100, y: -30 },                   // 8 Castor arm
        { x: 70, y: -20 },                     // 9 Pollux arm
      ]

      const geminiLines = [
        [0, 2], [2, 4], [4, 6], // Castor body
        [1, 3], [3, 5], [5, 7], // Pollux body
        [4, 5],                 // Waist connection
        [2, 8], [3, 9]          // Arms
      ]

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)' // Diperjelas dari 0.15 ke 0.4
      ctx.lineWidth = 1.5 // Garis sedikit lebih tebal
      geminiLines.forEach(([i, j]) => {
        const p1 = geminiPoints[i]
        const p2 = geminiPoints[j]
        ctx.beginPath()
        ctx.moveTo(geminiCx + p1.x * gScale, geminiCy + p1.y * gScale)
        ctx.lineTo(geminiCx + p2.x * gScale, geminiCy + p2.y * gScale)
        ctx.stroke()
      })

      const pulse = Math.sin(Date.now() * 0.002) * 0.3 + 0.7
      geminiPoints.forEach(p => {
        ctx.beginPath()
        const r = p.name ? 5 * gScale : 2.5 * gScale // Bintang sedikit diperbesar
        ctx.arc(geminiCx + p.x * gScale, geminiCy + p.y * gScale, r, 0, Math.PI * 2)
        ctx.fillStyle = p.name ? `rgba(255, 255, 255, ${pulse})` : 'rgba(255, 255, 255, 0.7)'
        ctx.fill()

        if (p.name) {
          // Glow lebih terang untuk Castor & Pollux
          ctx.shadowColor = 'rgba(255, 255, 255, 0.9)'
          ctx.shadowBlur = 15
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // --- Draw Moon ---
      // 2D Moon has been replaced by 3D Interactive Moon via React Three Fiber

      // We still want the outer glow if it looks good, or we can just leave it to R3F.
      // Let's keep a subtle glow behind the 3D canvas
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0)'
      ctx.shadowColor = 'rgba(255, 255, 255, 0.15)'
      ctx.shadowBlur = 60
      ctx.fill()
      ctx.shadowBlur = 0 // Reset

      // Draw Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        star.y -= star.speed
        if (star.y < 0) {
          star.y = height
          star.x = Math.random() * width
        }
      })

      // Draw horizontal clouds/lines
      ctx.lineCap = 'round'
      clouds.forEach(cloud => {
        ctx.beginPath()
        ctx.moveTo(cloud.x, cloud.y)
        ctx.lineTo(cloud.x + cloud.length, cloud.y)
        ctx.lineWidth = cloud.thickness
        ctx.strokeStyle = cloud.color
        ctx.stroke()

        cloud.x += cloud.speed
        if (cloud.speed > 0 && cloud.x > width + 100) {
          cloud.x = -cloud.length - 100
          cloud.y = Math.random() * height
        } else if (cloud.speed < 0 && cloud.x + cloud.length < -100) {
          cloud.x = width + 100
          cloud.y = Math.random() * height
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full pointer-events-none"
    />
  )
}

function InteractiveMoon() {
  const groupRef = React.useRef<THREE.Group>(null)
  const pointsRef = React.useRef<THREE.Points>(null)
  const lineMatRef = React.useRef<THREE.LineBasicMaterial>(null)
  const [isGemini, setIsGemini] = useState(false)
  const progressRef = React.useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGemini(prev => !prev)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const { spherePositions, targetPositions, geminiLinesData, currentPositions } = React.useMemo(() => {
    const sphereGeo = new THREE.SphereGeometry(1, 48, 48)
    const sPos = sphereGeo.attributes.position.array
    const count = sPos.length / 3

    const geminiPoints = [
      { x: -40, y: -120 }, { x: 40, y: -100 }, { x: -50, y: -50 }, { x: 20, y: -40 },
      { x: -60, y: 30 }, { x: 10, y: 40 }, { x: -80, y: 110 }, { x: -10, y: 120 },
      { x: -100, y: -30 }, { x: 70, y: -20 }
    ]
    const scale = 0.008
    const gemini3D = geminiPoints.map(p => new THREE.Vector3(p.x * scale, -p.y * scale, 0))

    const tPos = new Float32Array(sPos.length)
    for (let i = 0; i < count; i++) {
      const target = gemini3D[i % gemini3D.length]
      tPos[i * 3] = target.x + (Math.random() - 0.5) * 0.03
      tPos[i * 3 + 1] = target.y + (Math.random() - 0.5) * 0.03
      tPos[i * 3 + 2] = target.z + (Math.random() - 0.5) * 0.03
    }

    const lines = [
      [0, 2], [2, 4], [4, 6],
      [1, 3], [3, 5], [5, 7],
      [4, 5], [2, 8], [3, 9]
    ]
    const lPos = new Float32Array(lines.length * 2 * 3)
    lines.forEach(([i, j], idx) => {
      lPos[idx * 6] = gemini3D[i].x; lPos[idx * 6 + 1] = gemini3D[i].y; lPos[idx * 6 + 2] = gemini3D[i].z;
      lPos[idx * 6 + 3] = gemini3D[j].x; lPos[idx * 6 + 4] = gemini3D[j].y; lPos[idx * 6 + 5] = gemini3D[j].z;
    })

    const cPos = new Float32Array(sPos)
    return { spherePositions: sPos, targetPositions: tPos, geminiLinesData: lPos, currentPositions: cPos }
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005
      groupRef.current.rotation.z += 0.0002
    }

    const targetP = isGemini ? 1 : 0
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetP, delta * 2.5)
    let p = Math.max(0, Math.min(1, progressRef.current))

    // Cubic ease-in-out
    const easeP = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2

    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i++) {
        positions[i] = THREE.MathUtils.lerp(spherePositions[i], targetPositions[i], easeP)
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (lineMatRef.current) {
      lineMatRef.current.opacity = easeP * 0.4
      lineMatRef.current.visible = lineMatRef.current.opacity > 0.01
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[currentPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.015} color="#88aaff" transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[geminiLinesData, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial ref={lineMatRef} color="#ffffff" transparent opacity={0} linewidth={2} />
      </lineSegments>
    </group>
  )
}

function MoonContainer() {
  const [moonStyle, setMoonStyle] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isMobile = width < 768
      const moonX = isMobile ? width * 0.5 : width * 0.7
      const moonY = isMobile ? height * 0.35 : height * 0.5
      // increase radius slightly to fill the canvas nicely
      const moonRadius = Math.min(width, height) * (isMobile ? 0.3 : 0.35)
      const size = moonRadius * 2

      setMoonStyle({
        left: moonX - moonRadius,
        top: moonY - moonRadius,
        width: size,
        height: size
      })
      setIsReady(true)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isReady) return null

  return (
    <div className="absolute z-10 pointer-events-auto cursor-grab active:cursor-grabbing" style={{ ...moonStyle }}>
      <Canvas camera={{ position: [0, 0, 2.7], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[-5, 3, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[5, -3, -5]} intensity={0.5} color="#cbd5e1" />
        <React.Suspense fallback={null}>
          <InteractiveMoon />
        </React.Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={2.0}
        />
      </Canvas>
    </div>
  )
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled && !menuOpen ? 'bg-white/90 backdrop-blur-md border-b border-zinc-200 py-4' : 'bg-transparent border-b border-transparent py-6'
          }`}
      >
        <div className="max-w-[1400px] mx-auto w-full px-6 flex items-center justify-between">
          <span className={`font-serif text-2xl md:text-3xl font-bold tracking-tighter transition-colors relative z-50 ${scrolled && !menuOpen ? 'text-black' : 'text-white'}`}>
            G.
          </span>

          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(l => (
              <a
                key={l}
                href={`#${l}`}
                className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${scrolled && !menuOpen ? 'text-zinc-500 hover:text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                {l}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className={`hidden md:block font-mono text-xs uppercase tracking-[0.15em] px-6 py-3 border transition-all duration-300 ${scrolled && !menuOpen ? 'border-zinc-300 text-black hover:bg-black hover:text-white' : 'border-zinc-600 text-white hover:bg-white hover:text-black'}`}
          >
            Hire Me
          </a>

          <button
            className={`md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 transition-colors relative z-50 ${menuOpen || !scrolled ? 'text-white' : 'text-black'}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col pt-24 bg-black"
          >
            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              {NAV_LINKS.map(l => (
                <a
                  key={l}
                  href={`#${l}`}
                  className="font-serif text-3xl md:text-4xl text-white font-medium hover:text-zinc-400 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </a>
              ))}
              <a
                href="#contact"
                className="mt-8 font-mono text-xs uppercase tracking-[0.2em] px-8 py-4 border border-white text-white hover:bg-white hover:text-black transition-all"
                onClick={() => setMenuOpen(false)}
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center bg-[#0a192f] overflow-hidden pt-16 md:pt-20"
    >
      <div className="absolute inset-0 z-0">
        <HeroBackground />
        <MoonContainer />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a192f]/90 z-20 pointer-events-none" />
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col justify-center relative z-20 py-12 md:py-20 h-full pointer-events-none">
        <motion.div
          className="flex flex-col items-start w-full max-w-3xl pointer-events-auto"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          {/* Garis aksen minimalis ala Kuon Yagi */}
          <div className="flex flex-col gap-2 md:gap-3 mb-8 md:mb-12">
            <div className="h-[2px] w-10 md:w-12 bg-white/50" />
            <div className="h-[2px] w-6 md:w-8 bg-white/50" />
            <div className="h-[2px] w-10 md:w-12 bg-white/50" />

            <div className="flex gap-3 md:gap-4 mt-6 md:mt-8">
              <div className="h-[2px] md:h-[3px] w-12 md:w-16 bg-[#ff4d4f]" />
              <div className="h-[2px] md:h-[3px] w-20 md:w-24 bg-[#ff4d4f]" />
            </div>
          </div>

          {/* text-5xl on mobile prevents overflow from the long word "RADHIETYA" */}
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold text-white leading-[1.1] tracking-tight mb-6 md:mb-8 break-words w-full">
            GIYAN<br />
            RADHIETYA
          </h1>

          <div className="font-mono text-xs sm:text-sm md:text-base tracking-[0.1em] sm:tracking-[0.25em] text-white/80 flex flex-col gap-2 md:gap-3 mb-10 md:mb-12">
            <span>web developer /</span>
            <span>software engineer.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start w-full sm:w-auto mt-2 md:mt-4">
            <a href="#projects" className="w-full sm:w-auto text-center font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] px-8 md:px-10 py-4 md:py-5 bg-[#ff4d4f] text-white hover:bg-white hover:text-[#ff4d4f] transition-all duration-300 font-bold border border-[#ff4d4f]">
              Project
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Stats() {
  const items = [
    { value: '2+', label: 'Years Experience' },
    { value: '3+', label: 'Key Projects' },
    { value: '2025', label: 'B.Sc Informatics' },
  ]
  return (
    <section id="about" className="bg-white py-20 md:py-32 relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">

        {/* Foto profil dipindah ke sini agar layout Hero lebih lega dan tahan zoom */}
        <motion.div
          className="lg:col-span-5 flex justify-center lg:justify-start order-2 lg:order-1 w-full"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={scaleVariants}
        >
          <div className="w-3/4 sm:w-1/2 lg:w-full max-w-[320px] lg:max-w-md aspect-[3/4] overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700 relative group border border-zinc-200 mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
            <img
              src={profilePhoto}
              alt="Giyan Radhietya Akmal"
              className="w-full h-full object-cover object-top scale-105 group-hover:scale-100 transition-transform duration-700"
            />
          </div>
        </motion.div>

        <motion.div className="lg:col-span-7 order-1 lg:order-2" initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}>
          <h2 className="font-serif text-4xl md:text-5xl text-black font-bold mb-8 text-center lg:text-left">Engineering with precision.</h2>
          <p className="font-sans text-zinc-600 text-base md:text-lg leading-relaxed font-light mb-12 max-w-xl text-center lg:text-left mx-auto lg:mx-0">
            I am a software engineer and UI/UX enthusiast based in Bandung, Indonesia.
            I specialize in building scalable web architectures and crafting intuitive digital experiences
            that bridge the gap between complex logic and beautiful design.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-6 text-center sm:text-left mx-auto lg:mx-0">
            {items.map((item, i) => (
              <motion.div
                key={item.label} className="flex flex-col gap-3 md:gap-4 items-center sm:items-start"
                initial="hidden" whileInView="visible" viewport={viewportConfig}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } } }}
              >
                <div className="font-serif text-5xl md:text-6xl font-bold text-black tracking-tighter">
                  {item.value}
                </div>
                <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.15em] text-zinc-500 leading-relaxed max-w-[120px]">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="bg-zinc-50 py-20 md:py-32 border-t border-zinc-200">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-12 md:mb-20 text-center md:text-left"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          <h2 className="font-serif text-4xl md:text-6xl text-black font-bold tracking-tight">Tech Stack</h2>
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 max-w-xs mx-auto md:mx-0 mt-4 md:mt-0">
            Tools and technologies I use to build robust digital solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 md:gap-y-16">
          {SKILLS.map((group, index) => (
            <motion.div
              key={group.category} className="group flex flex-col items-center md:items-start"
              initial="hidden" whileInView="visible" viewport={viewportConfig}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1 } } }}
            >
              <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-black font-bold mb-4 md:mb-6 flex items-center gap-4 w-full justify-center md:justify-start">
                {group.category}
                <div className="h-px flex-1 bg-zinc-300 group-hover:bg-black transition-colors duration-500" />
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                {group.items.map(skill => (
                  <span
                    key={skill}
                    className="font-mono text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 border border-zinc-300 text-zinc-700 hover:text-white hover:bg-black hover:border-black transition-all duration-300 cursor-default rounded-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="bg-black py-20 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.h2
          className="font-serif text-4xl md:text-6xl text-white font-bold tracking-tight mb-16 md:mb-20 text-center md:text-left"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          Project
        </motion.h2>

        <div className="flex flex-col gap-24 md:gap-32">
          {PROJECTS.map((p, i) => (
            <div key={p.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>

              <motion.div
                className={`lg:col-span-7 relative group ${i % 2 !== 0 ? 'lg:order-2' : ''}`}
                initial="hidden" whileInView="visible" viewport={viewportConfig} variants={scaleVariants}
              >
                <div className="aspect-[16/10] overflow-hidden rounded-sm relative bg-zinc-900 border border-zinc-800">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  {p.censor && (
                    <div className="absolute bottom-[16%] left-[1%] w-[50%] h-[22%] rounded overflow-hidden">
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                className={`lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left ${i % 2 !== 0 ? 'lg:order-1 lg:items-end lg:text-right' : ''}`}
                initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
              >
                <span className="font-mono text-5xl md:text-6xl font-bold text-zinc-800 mb-4 md:mb-6">{p.id}</span>
                <div className={`flex items-center gap-4 mb-4 md:mb-6 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <span className={`font-mono text-[10px] md:text-xs uppercase tracking-widest px-3 py-1 ${p.status === 'Live Project' ? 'bg-white text-black' : 'border border-zinc-700 text-zinc-400'}`}>
                    {p.status}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">{p.year}</span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl text-white font-bold mb-4 md:mb-6">
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noreferrer" className="hover:text-zinc-400 transition-colors">
                      {p.name} <span className="font-sans text-xl inline-block -rotate-45 ml-2">→</span>
                    </a>
                  ) : (
                    p.name
                  )}
                </h3>

                <p className="font-sans text-zinc-400 text-sm md:text-base leading-relaxed font-light mb-6 md:mb-8 max-w-md">
                  {p.desc}
                </p>

                <div className={`flex flex-wrap gap-2 justify-center lg:justify-start ${i % 2 !== 0 ? 'lg:justify-end' : ''}`}>
                  {p.tags.map(t => (
                    <span key={t} className="font-mono text-[10px] md:text-xs text-zinc-300 border border-zinc-700 bg-zinc-900 px-3 py-1 rounded-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" className="bg-white py-20 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
        <motion.div className="lg:col-span-4 text-center lg:text-left" initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}>
          <h2 className="font-serif text-4xl md:text-5xl text-black font-bold tracking-tight mb-4 md:mb-8">Experience</h2>
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 leading-relaxed">
            Professional journey and roles.
          </p>
        </motion.div>

        <div className="lg:col-span-8 flex flex-col gap-10 md:gap-12">
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={i} className="group border-b border-zinc-200 pb-10 md:pb-12 last:border-0 last:pb-0"
              initial="hidden" whileInView="visible" viewport={viewportConfig}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1 } } }}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 md:gap-4 mb-2 md:mb-4 text-center sm:text-left">
                <h3 className="font-serif text-xl md:text-2xl text-black font-medium group-hover:text-zinc-600 transition-colors">{exp.role}</h3>
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-zinc-500">{exp.period}</span>
              </div>
              <div className="font-mono text-xs md:text-sm text-zinc-500 font-bold mb-4 md:mb-6 text-center sm:text-left">{exp.company}</div>
              <p className="font-sans text-zinc-700 text-sm md:text-base leading-relaxed font-light mb-6 md:mb-8 max-w-2xl text-center sm:text-left">
                {exp.desc}
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center sm:justify-start">
                {exp.tech.map(t => (
                  <span key={t} className="font-mono text-[10px] md:text-xs text-black border border-zinc-300 px-3 py-1.5 rounded-sm hover:bg-black hover:text-white transition-colors cursor-default">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Research() {
  return (
    <section id="research" className="bg-zinc-50 py-20 md:py-32 border-t border-zinc-200">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.h2
          className="font-serif text-4xl md:text-5xl text-black font-bold tracking-tight mb-12 md:mb-16 text-center md:text-left"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          Research & Academics
        </motion.h2>

        <motion.div
          className="bg-white border border-zinc-200 p-6 md:p-16 rounded-sm hover:border-black transition-colors duration-500 shadow-sm hover:shadow-md"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12 border-b border-zinc-200 pb-6 md:pb-8 text-center md:text-left">
            <h3 className="font-serif text-xl md:text-3xl text-black font-bold">
              Fabric Production Failure Classification
            </h3>
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white bg-black px-3 py-1.5 rounded-sm shrink-0">
              Hybrid Machine Learning
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 md:gap-y-12">
            {[
              {
                label: 'Background',
                text: 'Development of a predictive classification system to detect 10 types of fabric defects (e.g., oil stains, chemical spots, watermarks) in textile manufacturing.',
              },
              {
                label: 'Problem',
                text: 'The real-world dataset exhibited extreme class imbalance and ambiguous categorical features, causing the baseline Naïve Bayes model to achieve only 24% accuracy.',
              },
              {
                label: 'Approach',
                text: 'Pre-processing & label encoding of categorical features. Meta-feature extraction via stacking Multinomial Naïve Bayes posterior probabilities. Class imbalance addressed via SMOTE. Random Forest used as the final meta-classifier.',
              },
              {
                label: 'Key Results',
                text: 'Overall accuracy improved from 24% to 57%. Significant gains in minority classes — the "Mold Stain" class achieved Precision 1.00 and F1-Score 0.75.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.label} className="flex flex-col gap-2 md:gap-3 text-center md:text-left"
                initial="hidden" whileInView="visible" viewport={viewportConfig}
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: index * 0.1 } } }}
              >
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">{item.label}</span>
                <p className="font-sans text-zinc-700 text-sm md:text-base leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 md:gap-6">
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">Stack</span>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {['Python', 'Scikit-learn', 'SMOTE', 'Pandas', 'Matplotlib', 'Seaborn'].map(t => (
                <span key={t} className="font-mono text-[10px] md:text-xs text-black border border-zinc-300 px-3 py-1 rounded-sm">{t}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ContactBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = canvas.width = canvas.clientWidth
    let height = canvas.height = canvas.clientHeight

    // Elements
    const stars: { x: number; y: number; size: number; speed: number }[] = []
    for (let i = 0; i < (width < 768 ? 30 : 80); i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1
      })
    }

    let animationFrameId: number

    const render = () => {
      if (!canvas) return

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        width = canvas.width = canvas.clientWidth
        height = canvas.height = canvas.clientHeight
      }

      ctx.clearRect(0, 0, width, height)

      // --- Draw Gemini Constellation ---
      const isMobile = width < 768
      const geminiCx = isMobile ? width * 0.5 : width * 0.8
      const geminiCy = isMobile ? height * 0.5 : height * 0.5
      const gScale = Math.max(0.5, Math.min(width, height) / 800)

      const geminiPoints = [
        { x: -40, y: -120, name: 'Castor' },
        { x: 40, y: -100, name: 'Pollux' },
        { x: -50, y: -50 },
        { x: 20, y: -40 },
        { x: -60, y: 30 },
        { x: 10, y: 40 },
        { x: -80, y: 110 },
        { x: -10, y: 120 },
        { x: -100, y: -30 },
        { x: 70, y: -20 },
      ]

      const geminiLines = [
        [0, 2], [2, 4], [4, 6],
        [1, 3], [3, 5], [5, 7],
        [4, 5],
        [2, 8], [3, 9]
      ]

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.lineWidth = 1.5
      geminiLines.forEach(([i, j]) => {
        const p1 = geminiPoints[i]
        const p2 = geminiPoints[j]
        ctx.beginPath()
        ctx.moveTo(geminiCx + p1.x * gScale, geminiCy + p1.y * gScale)
        ctx.lineTo(geminiCx + p2.x * gScale, geminiCy + p2.y * gScale)
        ctx.stroke()
      })

      const pulse = Math.sin(Date.now() * 0.002) * 0.3 + 0.7
      geminiPoints.forEach(p => {
        ctx.beginPath()
        const r = p.name ? 5 * gScale : 2.5 * gScale
        ctx.arc(geminiCx + p.x * gScale, geminiCy + p.y * gScale, r, 0, Math.PI * 2)
        ctx.fillStyle = p.name ? `rgba(255, 255, 255, ${pulse})` : 'rgba(255, 255, 255, 0.4)'
        ctx.fill()

        if (p.name) {
          ctx.shadowColor = 'rgba(255, 255, 255, 0.6)'
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Draw Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        star.y -= star.speed
        if (star.y < 0) {
          star.y = height
          star.x = Math.random() * width
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      if (canvasRef.current) {
        width = canvas.width = canvasRef.current.clientWidth
        height = canvas.height = canvasRef.current.clientHeight
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full pointer-events-none"
    />
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const object = { ...form, access_key: "308695aa-372d-4016-9054-613e781312ce" }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(object)
      })
      const result = await res.json()
      if (result.success) {
        setSent(true)
        setForm({ name: '', email: '', message: '' })
      }
    } catch (error) {
      console.log(error)
      alert("Error sending message.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="bg-[#050b14] py-20 md:py-32 relative overflow-hidden">
      <ContactBackground />
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-20">
        <motion.h2
          className="font-serif text-4xl md:text-6xl text-white font-bold tracking-tight mb-16 md:mb-20 text-center"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          Let's build something.
        </motion.h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <motion.div
            className="flex flex-col gap-8 md:gap-10 text-center md:text-left"
            initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
          >
            <p className="font-sans text-zinc-400 text-base md:text-lg leading-relaxed font-light">
              I am currently open to full-time roles and selective freelance opportunities.
              Drop a message, and I'll get back to you within 24 hours.
            </p>

            <div className="flex flex-col gap-4 md:gap-6">
              {[
                { k: 'Email', v: 'giyanraditya024@gmail.com', href: 'mailto:giyanraditya024@gmail.com' },
                { k: 'LinkedIn', v: 'linkedin.com/in/giyan-radhietya', href: 'https://www.linkedin.com/in/giyan-radhietya-32a394220/' },
                { k: 'Instagram', v: '@giyanradh', href: 'https://www.instagram.com/giyanradh/' },
                { k: 'Location', v: 'Bandung, Indonesia', href: null },
              ].map(({ k, v, href }) => (
                <div key={k} className="flex flex-col gap-1 md:gap-2">
                  <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-600">{k}</span>
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer" className="font-sans text-sm md:text-base text-zinc-300 hover:text-white transition-colors break-all md:break-normal">
                      {v}
                    </a>
                  ) : (
                    <span className="font-sans text-sm md:text-base text-zinc-300">{v}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
          >
            {sent ? (
              <div className="h-full border border-zinc-800 bg-zinc-900/50 p-8 md:p-12 flex flex-col items-center justify-center text-center rounded-sm">
                <div className="font-serif text-4xl md:text-5xl text-white mb-4 md:mb-6">✓</div>
                <p className="font-sans text-lg md:text-xl text-white font-medium mb-2">Message Sent</p>
                <p className="font-mono text-[10px] md:text-xs text-zinc-500">I will reply shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col gap-2 md:gap-3">
                    <label className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500">Name</label>
                    <input required type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="bg-transparent border-b border-zinc-700 p-2 md:p-3 text-white focus:outline-none focus:border-white transition-colors font-sans text-sm rounded-none" />
                  </div>
                  <div className="flex flex-col gap-2 md:gap-3">
                    <label className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500">Email</label>
                    <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="bg-transparent border-b border-zinc-700 p-2 md:p-3 text-white focus:outline-none focus:border-white transition-colors font-sans text-sm rounded-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:gap-3">
                  <label className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500">Message</label>
                  <textarea required rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="bg-transparent border-b border-zinc-700 p-2 md:p-3 text-white focus:outline-none focus:border-white transition-colors font-sans text-sm resize-none rounded-none" />
                </div>
                <button type="submit" disabled={isSubmitting}
                  className="mt-4 md:mt-6 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] py-3 md:py-4 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 transition-colors rounded-sm font-bold w-full">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 text-center sm:text-left">
        <span className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tighter">G.</span>
        <span className="font-mono text-[10px] md:text-xs text-zinc-600">© 2025 Giyan Radhietya Akmal.</span>
        <div className="flex gap-6 md:gap-8 justify-center">
          {[
            { label: 'GH', url: 'https://github.com/GiyanRa' },
            { label: 'LI', url: 'https://www.linkedin.com/in/giyan-radhietya-32a394220/' },
            { label: 'IG', url: 'https://www.instagram.com/giyanradh/' },
          ].map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
              className="font-mono text-[10px] md:text-xs text-zinc-500 hover:text-white transition-colors">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="bg-white min-h-screen selection:bg-black selection:text-white">
      <NavBar />
      <Hero />
      <Stats />
      <Skills />
      <Projects />
      <Experience />
      <Research />
      <Contact />
      <Footer />
    </div>
  )
}
