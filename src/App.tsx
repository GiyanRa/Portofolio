import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants, useInView } from 'framer-motion'
import profilePhoto from './imports/foto.png'
import bookstoreImg from './imports/image-18.webp'
import journeyscapeImg from './imports/image-15.webp'
import indotexImg from './imports/image-16.png'

const NAV_LINKS = ['about', 'skills', 'projects', 'experience', 'research', 'contact']

const SKILLS = [
  { category: 'Languages', emoji: '⌨', items: ['TypeScript', 'Python', 'Java', 'Lua', 'SQL', 'PHP'] },
  { category: 'Frontend', emoji: '◈', items: ['React', 'Next.js', 'Tailwind CSS', 'WebGL', 'GraphQL'] },
  { category: 'Backend', emoji: '⬡', items: ['Node.js', 'FastAPI', 'PostgreSQL', 'Laravel'] },
  { category: 'Tools', emoji: '⚙', items: ['Git', 'Linux', 'Antigravity', 'Figma', 'Canva'] },
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
    image: '/portofatika.webp',
    censor: false,
    link: 'https://fatika-portofolio.vercel.app/',
  },
  {
    id: '02', name: 'Pixel Dungeon', year: '2026', status: 'Live Project',
    desc: 'A retro-style pixel art dungeon game built with pure JavaScript and HTML5 Canvas. Features a hero who battles enemies across procedurally inspired floors, complete with attack animations, score tracking, and classic arcade gameplay.',
    tags: ['JavaScript', 'HTML5 Canvas', 'Game Dev', 'Vercel'],
    image: '/pixeldungeon.webp',
    censor: false,
    link: 'https://pixel-dungeon-wheat.vercel.app/',
  },
  {
    id: '03', name: 'BookStore', year: '2026', status: 'Web App',
    desc: 'An end-to-end e-commerce platform featuring product browsing, advanced search, discount management, blog integration, and a comprehensive admin panel. Engineered for high-volume catalog management and active concurrent readership.',
    tags: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 'JavaScript'],
    image: bookstoreImg,
    censor: false,
  },
  {
    id: '04', name: 'JourneyScape', year: '2026', status: 'Web App',
    desc: 'Travel and tourism platform offering tour packages, WhatsApp-based booking, vehicle rental services, and curated destination highlights across Indonesia and abroad.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'WhatsApp API'],
    image: journeyscapeImg,
    censor: false,
  },
  {
    id: '05', name: 'Production Recording System', year: '2024', status: 'Internal App',
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

// ─── Animation Variants ──────────────────────────
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -24, y: 12 },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 24, y: 12 },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const viewportConfig = { once: false, amount: 0.15 }

// ─── Typewriter Hook ──────────────────────────
function useTypewriter(words: string[], typingSpeed = 80, deletingSpeed = 50, pauseTime = 2000) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.slice(0, text.length + 1))
        if (text.length === currentWord.length) {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        setText(currentWord.slice(0, text.length - 1))
        if (text.length === 0) {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime])

  return text
}

// ─── Count-up Hook ──────────────────────────
function useCountUp(target: string, duration = 1500) {
  const [count, setCount] = useState('0')
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const numMatch = target.match(/\d+/)
    if (!numMatch) { setCount(target); return }

    const numTarget = parseInt(numMatch[0])
    const suffix = target.replace(/\d+/, '')
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(numTarget * eased)
      setCount(current + suffix)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, target, duration])

  return { count, ref }
}

// ─── Active Section Hook ──────────────────────────
function useActiveSection() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      let current = ''
      const scrollPos = window.scrollY + window.innerHeight / 3 // Trigger point at 33% from top

      NAV_LINKS.forEach((link) => {
        const el = document.getElementById(link)
        if (el) {
          const offsetTop = el.offsetTop
          const offsetBottom = offsetTop + el.offsetHeight

          if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
            current = link
          }
        }
      })

      // Handle the case when scrolled to the very bottom
      if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 100) {
        current = NAV_LINKS[NAV_LINKS.length - 1]
      }

      if (current !== active) {
        setActive(current)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    setTimeout(handleScroll, 100)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [active])

  return active
}

// ─── SVG Icons ──────────────────────────
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EFFF4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// ─── NavBar ──────────────────────────
function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useActiveSection()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled && !menuOpen ? 'bg-[#10131A]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent border-b border-transparent py-6'
          }`}
      >
        <div className="max-w-[1400px] mx-auto w-full px-6 flex items-center justify-between">
          {/* Logo with subtle glow */}
          <motion.span
            className={`font-serif text-2xl md:text-3xl font-bold tracking-tighter transition-all duration-500 relative z-50 ${scrolled && !menuOpen ? 'text-[#EFFF4F]' : 'text-white'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            style={{ textShadow: scrolled ? '0 0 20px rgba(239, 255, 79, 0.3)' : 'none' }}
          >
            G.
          </motion.span>

          {/* Desktop nav with active indicator */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((l, index) => (
              <motion.a
                key={l}
                href={`#${l}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + (index * 0.1), // Stagger delay for wave effect
                  type: 'spring',
                  stiffness: 80
                }}
                whileHover={{ scale: 1.15, y: -5, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-block font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300"
              >
                <span className={`transition-colors duration-300 ${activeSection === l ? 'text-[#EFFF4F]' : 'text-zinc-400 hover:text-[#EFFF4F]'}`}>
                  {l}
                </span>
                {/* Active dot indicator */}
                {activeSection === l && (
                  <motion.span
                    layoutId="activeNavDot"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#EFFF4F]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          {/* CTA button */}
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }} // Appears after the wave
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`hidden md:block font-mono text-xs uppercase tracking-[0.15em] px-6 py-3 border transition-all duration-500 ${scrolled && !menuOpen
              ? 'border-[#EFFF4F]/40 text-[#EFFF4F] hover:bg-[#EFFF4F] hover:text-[#10131A] hover:shadow-[0_0_30px_rgba(239,255,79,0.2)]'
              : 'border-zinc-600 text-zinc-300 hover:bg-[#EFFF4F] hover:text-[#10131A] hover:border-[#EFFF4F]'
              }`}
          >
            Hire Me
          </motion.a>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 transition-colors relative z-50 ${menuOpen || !scrolled ? 'text-white' : 'text-[#EFFF4F]'}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col pt-24 bg-[#10131A]"
          >
            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l}
                  href={`#${l}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="font-serif text-3xl md:text-4xl text-white font-medium hover:text-[#EFFF4F] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.08, duration: 0.4 }}
                className="mt-8 font-mono text-xs uppercase tracking-[0.2em] px-8 py-4 border border-[#EFFF4F] text-[#EFFF4F] hover:bg-[#EFFF4F] hover:text-[#10131A] transition-all"
                onClick={() => setMenuOpen(false)}
              >
                Hire Me
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── GIYAN RADH Animated Text ─────────────────────────
function GiyanText() {
  const giyanLetters = ['G', 'I', 'Y', 'A', 'N']
  const radhLetters = ['R', 'A', 'D', 'H']

  return (
    <div className="hero-name-row flex items-center justify-center whitespace-nowrap">
      {/* GIYAN — outline stroke, ONLY GIYAN has the wipe transition loop */}
      <div className="giyan-wipe-container">
        <div className="giyan-wipe-wrapper">
          <div className="flex items-center">
            {giyanLetters.map((letter, i) => (
              <motion.span
                key={`g-${i}`}
                className="giyan-outline-letter"
                data-letter={letter}
                initial={{ y: '115%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.3 + i * 0.06,
                  opacity: { duration: 0.4, delay: 0.3 + i * 0.06 }
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Space between GIYAN and RADH */}
      <span className="name-word-space" aria-hidden="true" />

      {/* RADH — solid white fill, NO wipe animation (stays continuously solid) */}
      <div className="flex items-center">
        {radhLetters.map((letter, i) => (
          <motion.span
            key={`r-${i}`}
            className="radh-solid-letter"
            data-letter={letter}
            initial={{ y: '115%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.65 + i * 0.06,
              opacity: { duration: 0.4, delay: 0.65 + i * 0.06 }
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// ─── Spotlight Color Reveal Photo ─────────────────────────
function SpotlightPhoto({ src, alt, className, style }: {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const colorLayerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const colorLayer = colorLayerRef.current
    if (!container || !colorLayer) return

    const RADIUS = 100

    const setMask = (x: number, y: number) => {
      const mask = `radial-gradient(circle ${RADIUS}px at ${x}px ${y}px, black 0%, black 35%, rgba(0,0,0,0.5) 65%, transparent 100%)`
      colorLayer.style.webkitMaskImage = mask
      colorLayer.style.maskImage = mask
    }

    const onMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) return

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const isInside = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        )

        if (isInside) {
          setMask(x, y)
          colorLayer.style.transition = 'opacity 0.15s ease'
          colorLayer.style.opacity = '1'
        } else {
          colorLayer.style.transition = 'opacity 0.5s ease'
          colorLayer.style.opacity = '0'
        }
      })
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return
      const t = e.touches[0]
      const rect = container.getBoundingClientRect()
      if (
        t.clientX >= rect.left &&
        t.clientX <= rect.right &&
        t.clientY >= rect.top &&
        t.clientY <= rect.bottom
      ) {
        setMask(t.clientX - rect.left, t.clientY - rect.top)
        colorLayer.style.transition = 'opacity 0.15s ease'
        colorLayer.style.opacity = '1'
      } else {
        colorLayer.style.transition = 'opacity 0.5s ease'
        colorLayer.style.opacity = '0'
      }
    }

    const onTouchEnd = () => {
      colorLayer.style.transition = 'opacity 0.5s ease'
      colorLayer.style.opacity = '0'
    }

    const rect = container.getBoundingClientRect()
    if (rect.width > 0) setMask(rect.width / 2, rect.height / 2)

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`sp-wrap ${className ?? ''}`}
      style={style}
    >
      {/* Layer bawah — grayscale */}
      <img src={src} alt={alt} className="sp-img sp-img--gray" draggable={false} />
      {/* Layer atas — warna asli, opacity & mask diatur lewat JS */}
      <div ref={colorLayerRef} className="sp-color-layer">
        <img src={src} alt="" aria-hidden className="sp-img sp-img--color" draggable={false} />
      </div>
    </div>
  )
}

// ─── Hero ──────────────────────────
function Hero() {
  const [emailCopied, setEmailCopied] = useState(false)

  const handleEmailAction = (e: React.MouseEvent) => {
    e.preventDefault()
    const email = 'giyanraditya024@gmail.com'

    // Copy to clipboard with universal fallback
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(email)
      } else {
        const ta = document.createElement('textarea')
        ta.value = email
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
    } catch (_) {
      const ta = document.createElement('textarea')
      ta.value = email
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }

    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 4000)

    // Trigger mailto safely
    try {
      window.location.href = `mailto:${email}`
    } catch (_) {}
  }

  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com/GiyanRa', icon: <GithubIcon /> },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/giyan-radhietya-32a394220/', icon: <LinkedInIcon /> },
    { label: 'Instagram', href: 'https://www.instagram.com/giyanradh/', icon: <InstagramIcon /> },
    { label: 'Email', href: 'mailto:giyanraditya024@gmail.com', icon: <EmailIcon /> },
  ]

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] lg:min-h-0 lg:h-[100svh] lg:max-h-[960px] 2xl:max-h-[1100px] flex items-center bg-[#0d1117] overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 z-0 hero-grid-bg" />
      {/* Vignette overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0d1117]/60 via-transparent to-[#0d1117]/80 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0d1117]/70 via-transparent to-[#0d1117]/70 pointer-events-none" />

      {/* ── Center photo & Behind-Head Name ── */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none">
        <motion.div
          className="relative h-[56svh] sm:h-[70svh] md:h-[82svh] max-h-[620px] 2xl:max-h-[720px] aspect-[427/585] max-w-[88vw] flex items-end justify-center pointer-events-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          {/* ── GIYAN RADH Name: Positioned directly behind head, hair overlapping bottom of letters ── */}
          <div className="absolute -top-[3%] sm:-top-[2%] md:top-[0%] lg:top-[1%] left-1/2 -translate-x-1/2 z-[5] pointer-events-none select-none flex justify-center items-center w-max">
            <GiyanText />
          </div>

          {/* Subtle soft glow behind photo */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[260px] sm:w-[340px] h-[340px] sm:h-[500px] bg-gradient-to-t from-white/5 via-transparent to-transparent blur-3xl pointer-events-none" />

          {/* Spotlight Photo (z-10, hair sits in front of the letters) */}
          <div className="relative z-10 h-full w-full flex items-end justify-center">
            <SpotlightPhoto
              src={profilePhoto}
              alt="Giyan Radhietya"
              className="hero-profile-photo"
              style={{ maxHeight: '100%' }}
            />
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-32 bg-gradient-to-t from-[#0d1117] to-transparent z-20 pointer-events-none" />
        </motion.div>
      </div>

      {/* ── Content container (Left info panel + Right social pills, constrained within max-w-[1400px]) ── */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-16 flex items-start md:items-center justify-between min-h-[100svh] lg:min-h-0 lg:h-full pt-20 sm:pt-28 md:pt-0 pb-8 pointer-events-none">
        <motion.div
          className="flex flex-col items-start max-w-[320px] sm:max-w-sm pointer-events-auto md:translate-y-8 lg:translate-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-2 sm:mb-3">
            Full Stack Developer
          </h1>

          {/* Tagline / Subtitle */}
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-4 sm:mb-6 max-w-[280px] sm:max-w-sm">
            Designing digital products that are clear, usable, and conversion focused.
          </p>

          {/* Actions: CTA button + Social icons on mobile */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white text-[#0d1117] font-semibold text-xs sm:text-sm tracking-wide hover:bg-zinc-200 transition-all duration-300 shadow-md"
            >
              <span>Let's collaborate</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>

            {/* Mobile-only compact social icon buttons */}
            <div className="flex md:hidden items-center gap-1.5">
              {socialLinks.map((s) => {
                const isEmail = s.label === 'Email'
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    onClick={isEmail ? handleEmailAction : undefined}
                    target={isEmail ? undefined : '_blank'}
                    rel={isEmail ? undefined : 'noopener noreferrer'}
                    aria-label={s.label}
                    title={isEmail ? 'Klik untuk salin email' : s.label}
                    className={`w-9 h-9 flex items-center justify-center rounded-full border backdrop-blur-sm transition-all shadow-sm ${
                      isEmail && emailCopied
                        ? 'border-[#EFFF4F] bg-[#EFFF4F]/25 text-[#EFFF4F]'
                        : 'border-white/15 bg-white/5 hover:bg-white/15 hover:border-white/30 text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 flex items-center justify-center text-zinc-400">
                      {isEmail && emailCopied ? <CheckIcon /> : s.icon}
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Right social pills (Desktop) — anchored within max-w-[1400px], seragam & sejajar rapi ── */}
        <motion.div
          className="pointer-events-auto hidden md:flex flex-col items-end gap-3.5 md:translate-y-8 lg:translate-y-12"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {socialLinks.map((s, i) => {
            const isEmail = s.label === 'Email'
            return (
              <motion.a
                key={s.label}
                href={s.href}
                onClick={isEmail ? handleEmailAction : undefined}
                target={isEmail ? undefined : '_blank'}
                rel={isEmail ? undefined : 'noopener noreferrer'}
                className={`group flex items-center gap-3 w-[138px] px-4 py-2.5 rounded-full border transition-all duration-300 text-xs font-medium backdrop-blur-sm shadow-sm cursor-pointer ${
                  isEmail && emailCopied
                    ? 'border-[#EFFF4F] bg-[#EFFF4F]/20 text-[#EFFF4F] shadow-[0_0_18px_rgba(239,255,79,0.35)]'
                    : 'border-white/15 bg-white/5 hover:bg-white/15 hover:border-white/35 text-zinc-300 hover:text-white'
                }`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.1, duration: 0.4 }}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.96 }}
                title={isEmail ? 'Klik untuk salin email & opsi kirim' : s.label}
              >
                <span className="w-4 h-4 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors shrink-0">
                  {isEmail && emailCopied ? <CheckIcon /> : s.icon}
                </span>
                <span className="tracking-wide">
                  {isEmail && emailCopied ? 'Copied!' : s.label}
                </span>
              </motion.a>
            )
          })}
        </motion.div>
      </div>

      {/* Floating toast notification when Email is copied */}
      <AnimatePresence>
        {emailCopied && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#10131A]/95 border border-[#EFFF4F]/40 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(239,255,79,0.25)] px-4 py-3 rounded-xl backdrop-blur-xl pointer-events-auto"
          >
            <div className="w-7 h-7 rounded-full bg-[#EFFF4F]/20 text-[#EFFF4F] flex items-center justify-center shrink-0">
              <CheckIcon />
            </div>
            <div className="flex flex-col pr-1">
              <span className="font-sans font-semibold text-xs text-white">Email tersalin ke clipboard!</span>
              <span className="font-mono text-[11px] text-[#EFFF4F]">giyanraditya024@gmail.com</span>
            </div>
            <div className="flex items-center gap-1.5 ml-2 border-l border-zinc-800 pl-3">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=giyanraditya024@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-[#EFFF4F] hover:bg-white text-[#10131A] font-semibold font-mono text-[10px] tracking-wide transition-colors"
              >
                Buka Gmail
              </a>
              <a
                href="#contact"
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-[10px] tracking-wide transition-colors"
              >
                Form Kontak
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">scroll</span>
        <div className="animate-scroll-bounce">
          <svg width="14" height="20" viewBox="0 0 16 24" fill="none" className="text-zinc-500">
            <path d="M8 4L8 18M8 18L3 13M8 18L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}

// ─── Stats / About ──────────────────────────
function Stats() {
  const items = [
    { value: '2+', label: 'Years Experience' },
    { value: `${PROJECTS.length}+`, label: 'Key Projects' },
    { value: '2025', label: 'S.Kom Informatics' },
  ]

  return (
    <section id="about" className="bg-[#10131A] py-20 md:py-32 relative dot-pattern overflow-hidden">
      {/* Decorative diagonal line */}
      <div className="absolute top-0 right-0 w-px h-48 bg-gradient-to-b from-[#EFFF4F]/20 to-transparent hidden lg:block" style={{ right: '15%' }} />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center relative">

        {/* Profile photo with glow ring */}
        <motion.div
          className="lg:col-span-5 flex justify-center lg:justify-start order-2 lg:order-1 w-full"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={scaleVariants}
        >
          <div className="glow-ring w-3/4 sm:w-1/2 lg:w-full max-w-[320px] lg:max-w-md">
            <div className="aspect-[3/4] overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700 relative group border border-zinc-800/50">
              <div className="absolute inset-0 bg-[#EFFF4F]/5 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img
                src={profilePhoto}
                alt="Giyan Radhietya Akmal"
                className="w-full h-full object-cover object-top scale-105 group-hover:scale-100 transition-transform duration-700"
              />
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#EFFF4F]/30 z-20" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#EFFF4F]/30 z-20" />
            </div>
          </div>
        </motion.div>

        {/* Text content */}
        <motion.div className="lg:col-span-7 order-1 lg:order-2" initial="hidden" whileInView="visible" viewport={viewportConfig} variants={slideRightVariants}>
          {/* Section label */}
          <div className="flex items-center gap-4 mb-6 md:mb-8 justify-center lg:justify-start">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EFFF4F]/60">About me</span>
            <div className="h-px w-12 bg-[#EFFF4F]/20" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-white font-bold mb-8 text-center lg:text-left leading-snug">
            Engineering with<br />
            <span className="gradient-text">precision.</span>
          </h2>
          <p className="font-sans text-zinc-400 text-base md:text-lg leading-relaxed font-light mb-12 max-w-xl text-center lg:text-left mx-auto lg:mx-0">
            I am a software engineer and UI/UX enthusiast based in Bandung, Indonesia.
            I specialize in building scalable web architectures and crafting intuitive digital experiences
            that bridge the gap between complex logic and beautiful design.
          </p>

          {/* Animated count-up stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-6 text-center sm:text-left mx-auto lg:mx-0">
            {items.map((item, i) => {
              const { count, ref } = useCountUp(item.value, 1500)
              return (
                <motion.div
                  key={item.label}
                  ref={ref}
                  className="flex flex-col gap-3 md:gap-4 items-center sm:items-start group"
                  initial="hidden" whileInView="visible" viewport={viewportConfig}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.15 } } }}
                >
                  <div className="font-serif text-5xl md:text-6xl font-bold text-[#EFFF4F] tracking-tighter transition-all duration-300 group-hover:text-shadow-[0_0_30px_rgba(239,255,79,0.3)]">
                    {count}
                  </div>
                  <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.15em] text-zinc-500 leading-relaxed max-w-[120px]">
                    {item.label}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Personal quote */}
          <motion.div
            className="mt-12 pt-8 border-t border-zinc-800/50 text-center lg:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="font-sans text-sm text-zinc-600 italic">
              "Code is like humor. When you have to explain it, it's bad."
              <span className="text-zinc-700 not-italic ml-2">— Cory House</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Skills ──────────────────────────
function Skills() {
  return (
    <section id="skills" className="bg-[#0d1016] py-20 md:py-32 border-t border-zinc-800/30 relative overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#EFFF4F]/[0.02] blur-3xl pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-12 md:mb-20 text-center md:text-left"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          <div>
            <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EFFF4F]/60">What I use</span>
              <div className="h-px w-12 bg-[#EFFF4F]/20" />
            </div>
            <h2 className="font-serif text-4xl md:text-6xl text-white font-bold tracking-tight">Tech Stack</h2>
          </div>
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 max-w-xs mx-auto md:mx-0 mt-4 md:mt-0">
            Tools and technologies I use to build robust digital solutions.
          </p>
        </motion.div>

        {/* Staggered grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 md:gap-y-16">
          {SKILLS.map((group, index) => (
            <motion.div
              key={group.category}
              className="group flex flex-col items-center md:items-start"
              initial="hidden" whileInView="visible" viewport={viewportConfig}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: index * 0.12 } } }}
              style={{ marginTop: index % 2 !== 0 ? '2rem' : '0' }}
            >
              {/* Category header with emoji */}
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#EFFF4F] font-bold mb-5 md:mb-6 flex items-center gap-3 w-full justify-center md:justify-start">
                <span className="text-base opacity-60">{group.emoji}</span>
                <span>{group.category}</span>
                <div className="h-px flex-1 bg-zinc-800 group-hover:bg-[#EFFF4F]/30 transition-colors duration-700" />
              </div>

              {/* Skill tags with hover float effect */}
              <div className="flex flex-wrap gap-2.5 md:gap-3 justify-center md:justify-start">
                {group.items.map((skill, si) => (
                  <motion.span
                    key={skill}
                    className="font-mono text-xs md:text-sm px-3.5 md:px-4 py-2 border border-zinc-700/60 text-zinc-400 hover:text-[#10131A] hover:bg-[#EFFF4F] hover:border-[#EFFF4F] hover:shadow-[0_8px_25px_rgba(239,255,79,0.15)] transition-all duration-300 cursor-default rounded-sm hover:-translate-y-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + si * 0.05, duration: 0.4 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Projects ──────────────────────────
function Projects() {
  return (
    <section id="projects" className="bg-[#10131A] py-20 md:py-32 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 md:mb-20 text-center md:text-left"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          <div>
            <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EFFF4F]/60">Selected work</span>
              <div className="h-px w-12 bg-[#EFFF4F]/20" />
            </div>
            <h2 className="font-serif text-4xl md:text-6xl text-white font-bold tracking-tight">Projects</h2>
          </div>
          <span className="font-mono text-[10px] md:text-xs text-zinc-600 tracking-widest uppercase">{PROJECTS.length} projects</span>
        </motion.div>

        <div className="flex flex-col gap-24 md:gap-32">
          {PROJECTS.map((p, i) => (
            <div key={p.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>

              {/* Project image with glassmorphism overlay on hover */}
              <motion.div
                className={`lg:col-span-7 relative group ${i % 2 !== 0 ? 'lg:order-2' : ''}`}
                initial="hidden" whileInView="visible" viewport={viewportConfig} variants={scaleVariants}
                style={{
                  filter: 'drop-shadow(0 0 1px rgba(239,200,79,0.45)) drop-shadow(0 0 10px rgba(239,200,79,0.12))',
                }}
              >
                <div
                  className="aspect-[16/10] overflow-hidden relative bg-zinc-900"
                  style={{
                    clipPath: 'polygon(22px 0%, calc(100% - 22px) 0%, 100% 22px, 100% calc(100% - 22px), calc(100% - 22px) 100%, 22px 100%, 0% calc(100% - 22px), 0% 22px)',
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.06] transition-all duration-700"
                    style={{ borderRadius: 0 }}
                  />
                  {p.censor && (
                    <div className="absolute bottom-[16%] left-[1%] w-[50%] h-[22%] overflow-hidden">
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                    </div>
                  )}
                  {/* Glassmorphism overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10131A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>

              {/* Project info */}
              <motion.div
                className={`lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left ${i % 2 !== 0 ? 'lg:order-1 lg:items-end lg:text-right' : ''}`}
                initial="hidden" whileInView="visible" viewport={viewportConfig}
                variants={i % 2 !== 0 ? slideRightVariants : slideLeftVariants}
              >
                {/* Project number with subtle glow */}
                <span
                  className="font-mono text-5xl md:text-6xl font-bold text-zinc-800/80 mb-4 md:mb-6"
                  style={{ textShadow: '0 0 40px rgba(239, 255, 79, 0.05)' }}
                >
                  {p.id}
                </span>

                {/* Status + year */}
                <div className={`flex items-center gap-4 mb-4 md:mb-6 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <span className={`font-mono text-[10px] md:text-xs uppercase tracking-widest px-3 py-1.5 flex items-center gap-2 ${p.status === 'Live Project'
                    ? 'bg-[#EFFF4F] text-[#10131A]'
                    : 'border border-zinc-700/60 text-zinc-400'
                    }`}>
                    {/* Pulse dot for live projects */}
                    {p.status === 'Live Project' && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10131A]/40" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10131A]" />
                      </span>
                    )}
                    {p.status}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">{p.year}</span>
                </div>

                {/* Project name */}
                <h3 className="font-serif text-2xl md:text-3xl text-white font-bold mb-4 md:mb-6">
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noreferrer" className="group/link hover:text-[#EFFF4F] transition-colors duration-300">
                      {p.name}
                      <span className="inline-block ml-2 opacity-0 group-hover/link:opacity-100 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-all duration-300 text-[#EFFF4F]">↗</span>
                    </a>
                  ) : (
                    p.name
                  )}
                </h3>

                <p className="font-sans text-zinc-400 text-sm md:text-base leading-relaxed font-light mb-6 md:mb-8 max-w-md">
                  {p.desc}
                </p>

                {/* Tags with stagger animation */}
                <div className={`flex flex-wrap gap-2 justify-center lg:justify-start ${i % 2 !== 0 ? 'lg:justify-end' : ''}`}>
                  {p.tags.map((t, ti) => (
                    <motion.span
                      key={t}
                      className="font-mono text-[10px] md:text-xs text-zinc-300 border border-zinc-700/40 bg-zinc-900/50 px-3 py-1.5 rounded-sm hover:border-[#EFFF4F]/30 hover:text-[#EFFF4F] transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: ti * 0.08, duration: 0.4 }}
                    >
                      {t}
                    </motion.span>
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

// ─── Experience — Timeline Style ──────────────────────────
function Experience() {
  return (
    <section id="experience" className="bg-[#0d1016] py-20 md:py-32 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
        <motion.div className="lg:col-span-4 text-center lg:text-left" initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}>
          <div className="flex items-center gap-4 mb-4 justify-center lg:justify-start">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EFFF4F]/60">Career</span>
            <div className="h-px w-12 bg-[#EFFF4F]/20" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-bold tracking-tight mb-4 md:mb-8">Experience</h2>
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-400 leading-relaxed">
            Professional journey and roles.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="lg:col-span-8 flex flex-col gap-0 relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#EFFF4F]/40 via-[#EFFF4F]/15 to-transparent hidden sm:block" />

          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={i}
              className="group relative pl-0 sm:pl-12 md:pl-14 pb-12 md:pb-16 last:pb-0"
              initial="hidden" whileInView="visible" viewport={viewportConfig}
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: i * 0.15 } } }}
            >
              {/* Timeline dot */}
              <div className="absolute left-[-5px] md:left-[11px] top-1.5 hidden sm:flex">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EFFF4F]/30" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EFFF4F] border-2 border-[#0d1016]" />
                </span>
              </div>

              {/* Card with left gradient border */}
              <div className="relative rounded-sm overflow-hidden border border-zinc-800/30 hover:border-zinc-700/50 transition-colors duration-500 bg-zinc-900/20">
                {/* Left gradient accent */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#EFFF4F] to-[#EFFF4F]/10" />

                <div className="p-6 md:p-8">
                  {/* Period badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 text-center sm:text-left">
                    <h3 className="font-serif text-lg md:text-xl text-white font-medium group-hover:text-[#EFFF4F] transition-colors duration-500">{exp.role}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#10131A] bg-[#EFFF4F]/80 px-3 py-1 rounded-sm shrink-0 self-center sm:self-auto">
                      {exp.period}
                    </span>
                  </div>

                  <div className="font-mono text-xs md:text-sm text-zinc-300 font-bold mb-4 text-center sm:text-left">{exp.company}</div>
                  <p className="font-sans text-zinc-400 text-sm md:text-base leading-relaxed font-light mb-6 max-w-2xl text-center sm:text-left">
                    {exp.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 md:gap-3 justify-center sm:justify-start">
                    {exp.tech.map(t => (
                      <span key={t} className="font-mono text-[10px] md:text-xs text-zinc-400 border border-zinc-700/40 px-3 py-1.5 rounded-sm hover:bg-[#EFFF4F] hover:text-[#10131A] hover:border-[#EFFF4F] transition-all duration-300 cursor-default">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Research ──────────────────────────
function Research() {
  return (
    <section id="research" className="bg-[#10131A] py-20 md:py-32 border-t border-zinc-800/30 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          className="flex items-center gap-4 mb-4 justify-center md:justify-start"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EFFF4F]/60">Academic</span>
          <div className="h-px w-12 bg-[#EFFF4F]/20" />
        </motion.div>

        <motion.h2
          className="font-serif text-4xl md:text-5xl text-white font-bold tracking-tight mb-12 md:mb-16 text-center md:text-left"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          Research & Academics
        </motion.h2>

        {/* Card with animated gradient border */}
        <motion.div
          className="relative p-[1px] rounded-sm overflow-hidden group"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          {/* Animated border gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EFFF4F]/20 via-zinc-700/30 to-[#EFFF4F]/20 animate-gradient-shift rounded-sm opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative bg-[#0d1016] p-6 md:p-16 rounded-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12 border-b border-zinc-800/50 pb-6 md:pb-8 text-center md:text-left">
              <h3 className="font-serif text-xl md:text-3xl text-white font-bold">
                Fabric Production Failure Classification
              </h3>
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#10131A] bg-[#EFFF4F] px-3 py-1.5 rounded-sm shrink-0">
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
                  highlight: true,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className={`flex flex-col gap-2 md:gap-3 text-center md:text-left ${(item as any).highlight ? 'relative' : ''}`}
                  initial="hidden" whileInView="visible" viewport={viewportConfig}
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: index * 0.1 } } }}
                >
                  {/* Highlight background for Key Results */}
                  {(item as any).highlight && (
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#EFFF4F]/5 to-transparent rounded-sm -z-10" />
                  )}
                  <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-300 font-bold">{item.label}</span>
                  <p className="font-sans text-zinc-400 text-sm md:text-base leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 md:gap-6">
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-300 font-bold">Stack</span>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {['Python', 'Scikit-learn', 'SMOTE', 'Pandas', 'Matplotlib', 'Seaborn'].map((t, i) => (
                  <motion.span
                    key={t}
                    className="font-mono text-[10px] md:text-xs text-zinc-300 border border-zinc-700/40 px-3 py-1.5 rounded-sm hover:border-[#EFFF4F]/30 hover:text-[#EFFF4F] transition-all duration-300"
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Contact Background (Ringan, hanya render saat terlihat di layar) ──────────────────────────
function ContactBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = canvas.clientWidth)
    let height = (canvas.height = canvas.clientHeight)
    let isVisible = false
    let animationFrameId: number | null = null

    // Elements
    const stars: { x: number; y: number; size: number; speed: number }[] = []
    const starCount = width < 768 ? 16 : 35
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.4 + 0.1
      })
    }

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

    const render = () => {
      if (!isVisible) return

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        width = canvas.width = canvas.clientWidth
        height = canvas.height = canvas.clientHeight
      }

      ctx.clearRect(0, 0, width, height)

      // --- Draw Gemini Constellation ---
      const isMobile = width < 768
      const geminiCx = isMobile ? width * 0.5 : width * 0.8
      const geminiCy = height * 0.5
      const gScale = Math.max(0.5, Math.min(width, height) / 800)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
      ctx.lineWidth = 1.2
      geminiLines.forEach(([i, j]) => {
        const p1 = geminiPoints[i]
        const p2 = geminiPoints[j]
        ctx.beginPath()
        ctx.moveTo(geminiCx + p1.x * gScale, geminiCy + p1.y * gScale)
        ctx.lineTo(geminiCx + p2.x * gScale, geminiCy + p2.y * gScale)
        ctx.stroke()
      })

      const pulse = Math.sin(Date.now() * 0.002) * 0.25 + 0.75
      geminiPoints.forEach(p => {
        const px = geminiCx + p.x * gScale
        const py = geminiCy + p.y * gScale
        const r = p.name ? 4.5 * gScale : 2.2 * gScale

        // Outer soft glow for key stars without expensive shadowBlur
        if (p.name) {
          ctx.beginPath()
          ctx.arc(px, py, r * 2.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(239, 255, 79, ${pulse * 0.18})`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fillStyle = p.name ? `rgba(255, 255, 255, ${pulse})` : 'rgba(255, 255, 255, 0.4)'
        ctx.fill()
      })

      // Draw Stars (ringan & halus)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
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

    // IntersectionObserver: hanya jalankan render saat canvas terlihat
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible
        isVisible = entry.isIntersecting
        if (!wasVisible && isVisible) {
          animationFrameId = requestAnimationFrame(render)
        } else if (wasVisible && !isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(canvas)

    const handleResize = () => {
      if (canvasRef.current) {
        width = canvas.width = canvasRef.current.clientWidth
        height = canvas.height = canvasRef.current.clientHeight
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      observer.disconnect()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
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

// ─── Contact ──────────────────────────
function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [contactEmailCopied, setContactEmailCopied] = useState(false)

  const copyContactEmail = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    const email = 'giyanraditya024@gmail.com'
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(email)
      } else {
        const ta = document.createElement('textarea')
        ta.value = email
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
    } catch (_) {
      const ta = document.createElement('textarea')
      ta.value = email
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setContactEmailCopied(true)
    setTimeout(() => setContactEmailCopied(false), 3500)

    try {
      window.location.href = `mailto:${email}`
    } catch (_) {}
  }

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
        <motion.div
          className="flex items-center gap-4 mb-4 justify-center"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          <div className="h-px w-12 bg-[#EFFF4F]/20" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EFFF4F]/60">Contact</span>
          <div className="h-px w-12 bg-[#EFFF4F]/20" />
        </motion.div>

        <motion.h2
          className="font-serif text-4xl md:text-6xl text-white font-bold tracking-tight mb-16 md:mb-20 text-center"
          initial="hidden" whileInView="visible" viewport={viewportConfig} variants={revealVariants}
        >
          Let's build <span className="gradient-text">something.</span>
        </motion.h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Info side */}
          <motion.div
            className="flex flex-col gap-8 md:gap-10 text-center md:text-left"
            initial="hidden" whileInView="visible" viewport={viewportConfig} variants={slideLeftVariants}
          >
            <p className="font-sans text-zinc-400 text-base md:text-lg leading-relaxed font-light">
              I am currently open to full-time roles and selective freelance opportunities.
              Drop a message, and I'll get back to you within 24 hours.
            </p>

            <div className="flex flex-col gap-5 md:gap-6">
              {/* Email row dengan copy & buka Gmail */}
              <div className="flex flex-col gap-1.5 md:gap-2 group">
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-[#EFFF4F] text-xs">✉</span>
                  EMAIL
                  {contactEmailCopied && (
                    <span className="text-[#EFFF4F] text-[10px] font-mono normal-case tracking-normal px-2 py-0.5 rounded bg-[#EFFF4F]/15 border border-[#EFFF4F]/30 ml-2 flex items-center gap-1">
                      ✓ Tersalin ke clipboard!
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2.5 flex-wrap justify-center md:justify-start">
                  <button
                    type="button"
                    onClick={copyContactEmail}
                    title="Klik untuk salin email"
                    className="font-sans text-sm md:text-base text-zinc-200 hover:text-[#EFFF4F] transition-colors duration-300 break-all md:break-normal cursor-pointer flex items-center gap-2 group/btn text-left"
                  >
                    <span>giyanraditya024@gmail.com</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-zinc-700/60 bg-white/5 text-zinc-400 group-hover/btn:border-[#EFFF4F]/50 group-hover/btn:text-[#EFFF4F] transition-all">
                      {contactEmailCopied ? 'Tersalin ✓' : 'Salin'}
                    </span>
                  </button>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=giyanraditya024@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono px-2.5 py-0.5 rounded border border-[#EFFF4F]/40 bg-[#EFFF4F]/10 text-[#EFFF4F] hover:bg-[#EFFF4F] hover:text-[#10131A] transition-all"
                  >
                    Buka Gmail ↗
                  </a>
                </div>
              </div>

              {/* Tautan lainnya */}
              {[
                { k: 'LinkedIn', v: 'linkedin.com/in/giyan-radhietya', href: 'https://www.linkedin.com/in/giyan-radhietya-32a394220/', icon: '◆' },
                { k: 'Instagram', v: '@giyanradh', href: 'https://www.instagram.com/giyanradh/', icon: '◉' },
                { k: 'Location', v: 'Bandung, Indonesia', href: null, icon: '◎' },
              ].map(({ k, v, href, icon }) => (
                <div key={k} className="flex flex-col gap-1.5 md:gap-2 group">
                  <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-[#EFFF4F]/40 text-xs">{icon}</span>
                    {k}
                  </span>
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer" className="font-sans text-sm md:text-base text-zinc-300 hover:text-[#EFFF4F] transition-colors duration-300 break-all md:break-normal">
                      {v}
                    </a>
                  ) : (
                    <span className="font-sans text-sm md:text-base text-zinc-300">{v}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form side with glassmorphism */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={viewportConfig} variants={slideRightVariants}
          >
            {sent ? (
              <div className="h-full glass rounded-sm p-8 md:p-12 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-[#EFFF4F]/10 flex items-center justify-center mb-6"
                >
                  <span className="text-3xl text-[#EFFF4F]">✓</span>
                </motion.div>
                <p className="font-sans text-lg md:text-xl text-white font-medium mb-2">Message Sent</p>
                <p className="font-mono text-[10px] md:text-xs text-zinc-500">I will reply shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-sm p-6 md:p-8 flex flex-col gap-5 md:gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  {/* Name field with floating label */}
                  <div className="flex flex-col gap-1 relative">
                    <label className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 absolute left-0 ${focusedField === 'name' || form.name ? 'text-[#EFFF4F]/60 -top-0 text-[9px]' : 'text-zinc-500 top-3'
                      }`}>Name</label>
                    <input
                      required type="text" value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="bg-transparent border-b border-zinc-700/60 pt-4 pb-2 text-white focus:outline-none focus:border-[#EFFF4F]/60 transition-colors font-sans text-sm rounded-none"
                    />
                  </div>
                  {/* Email field */}
                  <div className="flex flex-col gap-1 relative">
                    <label className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 absolute left-0 ${focusedField === 'email' || form.email ? 'text-[#EFFF4F]/60 -top-0 text-[9px]' : 'text-zinc-500 top-3'
                      }`}>Email</label>
                    <input
                      required type="email" value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="bg-transparent border-b border-zinc-700/60 pt-4 pb-2 text-white focus:outline-none focus:border-[#EFFF4F]/60 transition-colors font-sans text-sm rounded-none"
                    />
                  </div>
                </div>
                {/* Message field */}
                <div className="flex flex-col gap-1 relative">
                  <label className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 absolute left-0 ${focusedField === 'message' || form.message ? 'text-[#EFFF4F]/60 -top-0 text-[9px]' : 'text-zinc-500 top-3'
                    }`}>Message</label>
                  <textarea
                    required rows={4} value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className="bg-transparent border-b border-zinc-700/60 pt-4 pb-2 text-white focus:outline-none focus:border-[#EFFF4F]/60 transition-colors font-sans text-sm resize-none rounded-none"
                  />
                </div>

                {/* Submit button with gradient hover */}
                <button
                  type="submit" disabled={isSubmitting}
                  className="group mt-2 md:mt-4 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] py-3.5 md:py-4 bg-[#EFFF4F] text-[#10131A] hover:shadow-[0_0_40px_rgba(239,255,79,0.25)] disabled:opacity-50 transition-all duration-500 rounded-sm font-bold w-full relative overflow-hidden"
                >
                  <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────
function Footer() {
  return (
    <footer className="bg-[#10131A] relative py-8 md:py-12 overflow-hidden">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EFFF4F]/20 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <motion.span
          className="font-serif text-2xl md:text-3xl font-bold text-[#EFFF4F] tracking-tighter"
          whileHover={{ scale: 1.1, textShadow: '0 0 20px rgba(239, 255, 79, 0.4)' }}
        >
          G.
        </motion.span>

        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] md:text-xs text-zinc-600">
            © {new Date().getFullYear()} Giyan Radhietya Akmal.
          </span>
          <span className="font-mono text-[9px] text-zinc-700">
            Built with ♥ in Bandung
          </span>
        </div>

        {/* Social icons (SVG) */}
        <div className="flex gap-5 md:gap-6 justify-center items-center">
          {[
            { icon: <GithubIcon />, url: 'https://github.com/GiyanRa', label: 'GitHub' },
            { icon: <LinkedInIcon />, url: 'https://www.linkedin.com/in/giyan-radhietya-32a394220/', label: 'LinkedIn' },
            { icon: <InstagramIcon />, url: 'https://www.instagram.com/giyanradh/', label: 'Instagram' },
            { icon: <EmailIcon />, url: 'mailto:giyanraditya024@gmail.com', label: 'Email' },
          ].map(s => (
            <motion.a
              key={s.label}
              href={s.url}
              target={s.label === 'Email' ? undefined : '_blank'}
              rel={s.label === 'Email' ? undefined : 'noreferrer'}
              title={s.label}
              className="text-zinc-500 hover:text-[#EFFF4F] transition-colors duration-300"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              {s.icon}
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─── Main App ──────────────────────────
export default function App() {
  return (
    <div className="bg-[#10131A] min-h-screen selection:bg-[#EFFF4F] selection:text-[#10131A] w-full max-w-[100vw] overflow-x-hidden relative">
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
