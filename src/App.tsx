import { useState, useEffect } from 'react'
import profilePhoto from './imports/image.png'
import bookstoreImg from './imports/image-18.png'
import journeyscapeImg from './imports/image-15.png'
import indotexImg from './imports/image-16.png'

const NAV_LINKS = ['about', 'skills', 'projects', 'experience', 'research', 'contact']

const SKILLS = [
  { category: 'Languages', items: ['TypeScript', 'Python', 'Java', 'Lua', 'SQL', 'PHP'] },
  { category: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'WebGL', 'GraphQL'] },
  { category: 'Backend', items: ['Node.js', 'FastAPI', 'PostgreSQL', 'Laravel'] },
  { category: 'Infrastructure', items: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'] },
  { category: 'Tools', items: ['Git', 'Linux', 'Antigravity', 'Figma', 'Canva'] },
  { category: 'Concepts', items: ['Microservices', 'DDD', 'TDD', 'WebSockets', 'OAuth2'] },
]

const PROJECTS = [
  {
    id: '01', name: 'BookStore', year: '2026', status: 'Web App',
    desc: 'An end-to-end e-commerce platform featuring product browsing, advanced search, discount management, blog integration, and a comprehensive admin panel. Engineered for high-volume catalog management and active concurrent readership.',
    tags: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 'JavaScript'],
    image: bookstoreImg,
    censor: false,
  },
  {
    id: '02', name: 'JourneyScape', year: '2026', status: 'Web App',
    desc: 'Travel and tourism platform offering tour packages, WhatsApp-based booking, vehicle rental services, and curated destination highlights across Indonesia and abroad.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'WhatsApp API'],
    image: journeyscapeImg,
    censor: false,
  },
  {
    id: '03', name: 'Production Recording System', year: '2024', status: 'Internal App',
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

const TERMINAL_LINES = [
  { cmd: 'whoami', out: 'Giyan Radhietya Akmal — Software Engineer' },
  { cmd: 'cat skills.txt', out: 'Go · TypeScript · Rust · Python · K8s' },
  { cmd: 'git log --oneline -1', out: 'a3f2c8d feat: open to new opportunities' },
]

const mono = { fontFamily: "'JetBrains Mono', monospace" }
const serif = { fontFamily: "'Playfair Display', serif" }
const sans = { fontFamily: "'Inter', sans-serif" }

function TerminalTyper() {
  const [step, setStep] = useState(0)
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<'typing' | 'showing'>('typing')

  useEffect(() => {
    if (step >= TERMINAL_LINES.length) return
    const line = TERMINAL_LINES[step]
    if (phase === 'typing') {
      if (typed.length < line.cmd.length) {
        const t = setTimeout(() => setTyped(line.cmd.slice(0, typed.length + 1)), 65)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('showing'), 400)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => { setStep(s => s + 1); setTyped(''); setPhase('typing') }, 1400)
      return () => clearTimeout(t)
    }
  }, [step, typed, phase])

  return (
    <div style={{ ...mono, fontSize: 13, lineHeight: '1.9' }}>
      {TERMINAL_LINES.slice(0, step).map((l, i) => (
        <div key={i}>
          <span style={{ color: '#888' }}>$ </span>
          <span style={{ color: '#111' }}>{l.cmd}</span>
          <div style={{ color: '#999', paddingLeft: 16 }}>→ {l.out}</div>
        </div>
      ))}
      {step < TERMINAL_LINES.length && (
        <div>
          <span style={{ color: '#888' }}>$ </span>
          <span style={{ color: '#111' }}>{typed}</span>
          <span className="cursor-blink" style={{ color: '#111' }}>▋</span>
        </div>
      )}
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

  // On dark hero: white text. Scrolled into cream: dark text.
  const logoColor = scrolled ? '#111111' : '#ffffff'
  const linkColor = scrolled ? '#888888' : 'rgba(255,255,255,0.65)'
  const linkHover = scrolled ? '#111111' : '#ffffff'
  const btnBorder = scrolled ? '#111111' : 'rgba(255,255,255,0.55)'
  const btnColor = scrolled ? '#111111' : '#ffffff'
  const btnHoverBg = scrolled ? '#111111' : '#ffffff'
  const btnHoverTx = scrolled ? '#f5f0e8' : '#1e0e0e'
  const hamburgerColor = scrolled ? '#111111' : '#ffffff'

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? 'rgba(245,240,232,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #ddd6c8' : '1px solid transparent',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        <div className="w-full px-6 h-16 flex items-center justify-between" style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Logo */}
          <span style={{ fontFamily: '"Jim Nightshade", cursive', color: logoColor, fontSize: 30, paddingLeft: 24, paddingRight: 10, transition: 'color 0.4s ease', lineHeight: 1, flexShrink: 0 }}>
            G
          </span>

          {/* Desktop links — centered absolutely */}
          <div className="hidden md:flex items-center gap-8" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {NAV_LINKS.map(l => (
              <a
                key={l}
                href={`#${l}`}
                style={{ ...mono, color: linkColor, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', textDecoration: 'none', transition: 'color 0.4s ease', fontWeight: 700 }}
                onMouseEnter={e => (e.currentTarget.style.color = linkHover)}
                onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="hidden md:block"
            style={{ ...mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '10px 20px', border: `1px solid ${btnBorder}`, color: btnColor, textDecoration: 'none', fontWeight: 600, transition: 'all 0.4s ease', flexShrink: 0, marginRight: 48 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = btnHoverBg; el.style.color = btnHoverTx }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = btnColor; el.style.borderColor = btnBorder }}
          >
            Hire Me
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: hamburgerColor, transition: 'color 0.4s ease', marginRight: 16 }}
          >
            <div style={{ width: 22, height: 2, background: 'currentColor', marginBottom: 5, borderRadius: 1 }} />
            <div style={{ width: 22, height: 2, background: 'currentColor', marginBottom: 5, borderRadius: 1 }} />
            <div style={{ width: 22, height: 2, background: 'currentColor', borderRadius: 1 }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-16"
          style={{ background: 'linear-gradient(135deg, #1e0e0e 0%, #2a1010 50%, #1e0e0e 100%)' }}
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex flex-col items-center justify-center flex-1 gap-10">
            {NAV_LINKS.map(l => (
              <a
                key={l}
                href={`#${l}`}
                style={{ ...serif, color: '#f0ebe0', fontSize: 28, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.01em' }}
                onClick={() => setMenuOpen(false)}
              >
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </a>
            ))}
            <a
              href="#contact"
              style={{ ...mono, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.18em', padding: '14px 32px', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', textDecoration: 'none', marginTop: 16 }}
              onClick={() => setMenuOpen(false)}
            >
              Hire Me
            </a>
          </div>
        </div>
      )}
    </>
  )
}

function Hero() {
  return (
    <section
      id="hero"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e0e0e 0%, #2a1010 40%, #3d1a1a 70%, #1e0e0e 100%)', display: 'flex', alignItems: 'stretch' }}
    >
      {/* Mobile layout: photo as background, text overlay */}
      <div className="md:hidden w-full" style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Full-screen photo */}
        <img
          src={profilePhoto}
          alt="Giyan Radhietya Akmal"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
        />
        {/* Dark gradient overlay — bottom heavy so text is readable */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,24,20,0.25) 0%, rgba(26,24,20,0.55) 50%, rgba(26,24,20,0.85) 100%)' }} />
        {/* Text on top */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '100vh', padding: '80px 28px 52px' }}>
          <p style={{ ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b89a5e', marginBottom: 18 }}>
            Software Engineer &amp; IT Professional
          </p>
          <h1 style={{ ...serif, fontSize: 'clamp(2.8rem, 11vw, 4.5rem)', fontWeight: 700, color: 'rgba(240,235,224,0.92)', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: 22 }}>
            Giyan<br />Radhietya<br />Akmal
          </h1>
          <p style={{ ...serif, fontSize: 17, fontStyle: 'italic', color: 'rgba(184,154,94,0.9)', marginBottom: 12, fontWeight: 400 }}>
            Crafted with precision, driven by purpose.
          </p>
          <p style={{ ...sans, fontSize: 13, color: 'rgba(138,128,112,0.85)', fontWeight: 400 }}>
            Bandung, Indonesia
          </p>
        </div>
      </div>

      {/* Desktop layout: two columns */}
      <div
        className="hidden md:grid w-full"
        style={{ maxWidth: 1100, margin: '0 auto', gridTemplateColumns: '1fr 360px', alignItems: 'center', minHeight: '100vh', paddingTop: '64px', paddingBottom: 0, paddingLeft: 0, paddingRight: 0, gap: 0 }}
      >
        {/* Text column */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '80px 48px 80px 64px' }}>
          <div>
            <p style={{ ...mono, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b89a5e', marginBottom: 28 }}>
              Software Engineer &amp; IT Professional
            </p>
            <h1 style={{ ...serif, fontSize: 'clamp(3.2rem, 6.5vw, 6rem)', fontWeight: 700, color: '#f0ebe0', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: 32 }}>
              Giyan<br />Radhietya<br />Akmal
            </h1>
            <p style={{ ...serif, fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontStyle: 'italic', color: '#b89a5e', marginBottom: 20, fontWeight: 400 }}>
              Crafted with precision, driven by purpose.
            </p>
            <p style={{ ...sans, fontSize: 14, color: '#8a8070', fontWeight: 400, letterSpacing: '0.01em' }}>
              Bandung, Indonesia
            </p>
          </div>
        </div>

        {/* Photo column */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '80px 64px 80px 0' }}>
          <div style={{ width: '100%', overflow: 'hidden', aspectRatio: '3/4' }}>
            <img
              src={profilePhoto}
              alt="Giyan Radhietya Akmal"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const items = [
    { value: '2+', label: 'Years of Experience' },
    { value: '3', label: 'Projects' },
    { value: '2025', label: 'S.Kom. Informatics' },
  ]
  return (
    <section id="about" style={{ background: '#f5f0e8', padding: '64px 0 56px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', paddingLeft: 'clamp(24px, 8vw, 120px)', paddingRight: 'clamp(24px, 4vw, 48px)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '0 1px', background: '#ddd6c8' }}>
          {items.map(item => (
            <div
              key={item.label}
              style={{ background: '#f5f0e8', paddingTop: 0, paddingRight: 28, paddingBottom: 28, paddingLeft: 28 }}
            >
              <div style={{ height: 2, background: '#b89a5e', marginBottom: 24, marginTop: 0 }} />
              <div style={{
                ...serif,
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: 700,
                color: '#b89a5e',
                lineHeight: 1,
                marginBottom: 12,
                letterSpacing: '-0.02em',
              }}>
                {item.value}
              </div>
              <div style={{
                ...mono,
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#b89a5e',
                lineHeight: 1.4,
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bio paragraph */}
        <div style={{ marginTop: 48, paddingLeft: 'clamp(0px, 1vw, 8px)', maxWidth: 720 }}>
          <p style={{ ...sans, fontSize: 15, color: '#7a6a50', lineHeight: 1.85, fontWeight: 300 }}>
            I'm <span style={{ fontWeight: 500, color: '#5a4a30' }}>Giyan Radhietya Akmal</span>, a fullstack developer, UI/UX designer, and machine learning engineer based in Bandung, Indonesia. I hold a bachelor's degree in Informatics Engineering from <span style={{ fontWeight: 500, color: '#5a4a30' }}>Universitas Jenderal Achmad Yani</span>.
          </p>
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" style={{ padding: '80px 0', borderTop: '1px solid #ddd6c8' }}>
      <div className="w-full px-10 md:px-16">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <h2 style={{ ...serif, fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 700, color: '#111' }}>Tech Stack</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 1, background: '#ddd6c8' }}>
          {SKILLS.map(group => (
            <div
              key={group.category}
              style={{ background: '#f5f0e8', padding: '24px 20px', transition: 'background 0.18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f5f0e8' }}
            >
              <div style={{ ...mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#999', marginBottom: 14 }}>{group.category}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {group.items.map(skill => (
                  <span
                    key={skill}
                    style={{ ...mono, fontSize: 11, padding: '5px 10px', border: '1px solid #ddd6c8', color: '#555', cursor: 'default', transition: 'all 0.15s' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#111'; el.style.color = '#f5f0e8'; el.style.borderColor = '#111' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#555'; el.style.borderColor = '#ddd6c8' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Projects() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="projects" style={{ padding: '80px 0', borderTop: '1px solid #ddd6c8' }}>
      <div className="w-full px-10 md:px-16">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h2 style={{ ...serif, fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 700, color: '#111' }}>Projects</h2>
          </div>
          <a href="#" style={{ ...mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#aaa', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#111')}
            onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
          >All Projects →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
          {PROJECTS.map(p => (
            <div
              key={p.id}
              style={{ display: 'block', background: hovered === p.id ? '#fff' : '#f5f0e8', border: '1px solid #ddd6c8', textDecoration: 'none', transition: 'background 0.18s', overflow: 'hidden' }}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Screenshot thumbnail */}
              <div style={{ width: '100%', height: 200, overflow: 'hidden', borderBottom: '1px solid #ddd6c8', position: 'relative' }}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                />
                {/* Censor overlay for company name */}
                {p.censor && (
                  <div style={{
                    position: 'absolute',
                    bottom: '16%',
                    left: '1%',
                    width: '50%',
                    height: '22%',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}>
                    {/* Blurred copy of area using a pseudo-element approach */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 150, 136, 0.55)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                    }} />
                    {/* Fallback solid for browsers without backdrop-filter */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 140, 130, 0.82)',
                      mixBlendMode: 'normal',
                    }} />
                  </div>
                )}
              </div>
              <div style={{ padding: '28px 28px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ ...mono, fontSize: 24, fontWeight: 700, color: '#e8e0d0' }}>{p.id}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ ...mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '4px 10px', border: '1px solid #ccc', color: '#777' }}>{p.status}</span>
                    <span style={{ ...mono, fontSize: 10, color: '#bbb' }}>{p.year}</span>
                  </div>
                </div>
                <h3 style={{ ...serif, fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 10 }}>{p.name}</h3>
                <p style={{ ...sans, fontSize: 13, color: '#777', lineHeight: 1.7, marginBottom: 18, fontWeight: 300 }}>{p.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ ...mono, fontSize: 10, color: '#aaa', border: '1px solid #e8e0d0', padding: '3px 8px' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" style={{ padding: '80px 0', borderTop: '1px solid #ddd6c8' }}>
      <div className="w-full px-10 md:px-16">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <h2 style={{ ...serif, fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 700, color: '#111' }}>Experience</h2>
        </div>
        <div style={{ position: 'relative' }}>
          <div className="hidden sm:block" style={{ position: 'absolute', left: 11, top: 0, bottom: 0, width: 1, background: '#ddd6c8' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="sm:pl-14" style={{ position: 'relative' }}>
                <div className="hidden sm:flex" style={{ position: 'absolute', left: 0, top: 4, width: 24, height: 24, border: '1px solid #bbb', background: '#f5f0e8', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: 6, height: 6, background: '#111', display: 'block' }} />
                </div>
                <div
                  style={{ border: '1px solid #ddd6c8', padding: '24px', background: '#fdfaf5', transition: 'background 0.18s, border-color 0.18s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#fff'; el.style.borderColor = '#bbb' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#fdfaf5'; el.style.borderColor = '#ddd6c8' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                    <h3 style={{ ...sans, fontSize: 16, fontWeight: 600, color: '#111' }}>{exp.role}</h3>
                    <span style={{ ...mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', border: '1px solid #ddd6c8', padding: '4px 10px', color: '#aaa', whiteSpace: 'nowrap' }}>{exp.period}</span>
                  </div>
                  <div style={{ ...mono, fontSize: 11, color: '#888', marginBottom: 10 }}>{exp.company}</div>
                  <p style={{ ...sans, fontSize: 13, color: '#777', lineHeight: 1.7, marginBottom: 14, fontWeight: 300 }}>{exp.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {exp.tech.map(t => (
                      <span key={t} style={{ ...mono, fontSize: 10, color: '#aaa', border: '1px solid #e8e0d0', padding: '3px 8px' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Research() {
  return (
    <section id="research" style={{ padding: '80px 0', borderTop: '1px solid #ddd6c8' }}>
      <div className="w-full px-10 md:px-16">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <h2 style={{ ...serif, fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 700, color: '#111' }}>Research</h2>
        </div>

        <div style={{ border: '1px solid #ddd6c8', background: '#fdfaf5', padding: '36px' }}>
          {/* Title */}
          <h3 style={{ ...serif, fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 20 }}>
            Fabric Production Failure Classification
            <span style={{ ...mono, fontSize: 11, fontWeight: 400, color: '#b89a5e', marginLeft: 12 }}>Hybrid Machine Learning</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                label: 'Background',
                text: 'Development of a predictive classification system to detect 10 types of fabric defects (e.g., oil stains, chemical spots, watermarks) in textile manufacturing.',
              },
              {
                label: 'Problem',
                text: 'The real-world dataset exhibited extreme class imbalance and ambiguous categorical features, causing the baseline model (standard Naïve Bayes) to achieve only 24% accuracy.',
              },
              {
                label: 'Approach',
                text: 'Pre-processing & label encoding of categorical features (pattern, color, batch, quality). Meta-feature extraction by combining Multinomial Naïve Bayes posterior probabilities with original features (stacking). Class imbalance addressed via SMOTE. Random Forest ensemble used as the final meta-classifier.',
              },
              {
                label: 'Key Results',
                text: 'Overall accuracy improved from 24% to 57%. Significant gains in minority classes — the "Mold Stain" class achieved Precision 1.00 and F1-Score 0.75.',
              },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <span style={{ ...mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#b89a5e', width: 80, flexShrink: 0, paddingTop: 2 }}>{item.label}</span>
                <p style={{ ...sans, fontSize: 13, color: '#666', lineHeight: 1.75, fontWeight: 300, flex: 1 }}>{item.text}</p>
              </div>
            ))}

            {/* Tech tags */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <span style={{ ...mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#b89a5e', width: 80, flexShrink: 0, paddingTop: 6 }}>Tech</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Python', 'Scikit-learn', 'SMOTE', 'Pandas', 'Matplotlib', 'Seaborn'].map(t => (
                  <span key={t} style={{ ...mono, fontSize: 10, color: '#888', border: '1px solid #ddd6c8', padding: '4px 10px' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Pesan dari ${form.name} (${form.email})`)
    const body = encodeURIComponent(`Nama: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:giyanraditya024@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
  }
  const inputStyle: React.CSSProperties = {
    ...mono, width: '100%', background: '#fdfaf5', border: '1px solid #ddd6c8',
    padding: '12px 14px', fontSize: 13, color: '#111', outline: 'none', transition: 'border-color 0.15s',
  }

  return (
    <section id="contact" style={{ padding: '80px 0', borderTop: '1px solid #ddd6c8' }}>
      <div className="w-full px-10 md:px-16">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <h2 style={{ ...serif, fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 700, color: '#111' }}>Contact</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 48, alignItems: 'start' }}>
          <div>
            <p style={{ ...sans, color: '#777', fontSize: 15, lineHeight: 1.8, marginBottom: 36, fontWeight: 300 }}>
              Open to full-time roles and select consulting. I respond within 24 hours.
            </p>
            {[
              { k: 'Email', v: 'giyanraditya024@gmail.com', href: 'mailto:giyanraditya024@gmail.com' },
              { k: 'LinkedIn', v: 'linkedin.com/in/giyan-radhietya', href: 'https://www.linkedin.com/in/giyan-radhietya-32a394220/' },
              { k: 'Instagram', v: 'instagram.com/giyanradh', href: 'https://www.instagram.com/giyanradh/' },
              { k: 'Location', v: 'Bandung, Indonesia (Remote-friendly)', href: null },
              { k: 'Timezone', v: 'WIB (UTC+7)', href: null },
            ].map(({ k, v, href }) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 0', borderBottom: '1px solid #e8e0d0' }}>
                <span style={{ ...mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#bbb', width: 80, flexShrink: 0 }}>{k}</span>
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" style={{ ...sans, fontSize: 13, color: '#b89a5e', textDecoration: 'none', borderBottom: '1px solid #e8c87a' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#8a6a30')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#b89a5e')}
                  >{v}</a>
                ) : (
                  <span style={{ ...sans, fontSize: 13, color: '#555' }}>{v}</span>
                )}
              </div>
            ))}
          </div>
          <div>
            {sent ? (
              <div style={{ border: '1px solid #ddd6c8', padding: '48px 28px', textAlign: 'center', background: '#fdfaf5' }}>
                <div style={{ ...serif, fontSize: 36, color: '#111', marginBottom: 10 }}>✓</div>
                <p style={{ ...sans, fontWeight: 600, color: '#111', marginBottom: 6 }}>Message sent</p>
                <p style={{ ...mono, fontSize: 11, color: '#aaa' }}>I'll reply within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[{ key: 'name', label: 'Name', type: 'text', placeholder: 'Your name' }, { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' }].map(f => (
                  <div key={f.key}>
                    <label style={{ ...mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#aaa', display: 'block', marginBottom: 8 }}>{f.label}</label>
                    <input type={f.type} required placeholder={f.placeholder} value={form[f.key as 'name' | 'email']} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} onFocus={e => (e.target.style.borderColor = '#111')} onBlur={e => (e.target.style.borderColor = '#ddd6c8')} />
                  </div>
                ))}
                <div>
                  <label style={{ ...mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#aaa', display: 'block', marginBottom: 8 }}>Message</label>
                  <textarea required rows={5} placeholder="Tell me about your project..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ ...inputStyle, resize: 'none' }} onFocus={e => (e.target.style.borderColor = '#111')} onBlur={e => (e.target.style.borderColor = '#ddd6c8')} />
                </div>
                <button type="submit" style={{ ...mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', padding: '16px', background: '#111', color: '#f5f0e8', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'background 0.15s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#333' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#111' }}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #ddd6c8', padding: '32px 0' }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ flexWrap: 'wrap' }}>
        <span style={{ fontFamily: '"Jim Nightshade", cursive', color: '#111', fontSize: 28 }}>G</span>
        <span style={{ ...mono, fontSize: 10, color: '#888', textAlign: 'center', fontWeight: 700 }}>© 2025 Giyan Radhietya Akmal.</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'GitHub', url: 'https://github.com/GiyanRa' },
            { label: 'LinkedIn', url: 'https://www.linkedin.com/in/giyan-radhietya-32a394220/' },
            { label: 'Instagram', url: 'https://www.instagram.com/giyanradh/' },
          ].map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" style={{ ...mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#555', textDecoration: 'none', fontWeight: 700 }} onMouseEnter={e => (e.currentTarget.style.color = '#111')} onMouseLeave={e => (e.currentTarget.style.color = '#555')}>{s.label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh' }}>
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
