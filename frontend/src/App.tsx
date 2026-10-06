import { Suspense, lazy, useEffect, useState } from 'react'
import { Link, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { ensureSession, patch, useDread, useProg } from './api'
const L = (f: () => Promise<any>, n: string) => lazy(() => f().then(m => ({ default: m[n] })))
const Home = L(() => import('./pages/Core'), 'Home'), Secrets = L(() => import('./pages/Core'), 'Secrets'), Door = L(() => import('./pages/Core'), 'Door'), NotFound = L(() => import('./pages/Core'), 'NotFound'), Hidden = L(() => import('./pages/Core'), 'Hidden'), Welcome = L(() => import('./pages/Core'), 'Welcome'), About = L(() => import('./pages/Core'), 'About'), Letters = L(() => import('./pages/Core'), 'Letters')
const Thoughts = L(() => import('./pages/Text'), 'Thoughts'), Diary = L(() => import('./pages/Text'), 'Diary'), Void = L(() => import('./pages/Text'), 'Void')
const Terminal = L(() => import('./pages/Interactive'), 'Terminal'), Mirror = L(() => import('./pages/Interactive'), 'Mirror'), Room = L(() => import('./pages/Interactive'), 'Room'), Files = L(() => import('./pages/Interactive'), 'Files')
const NAV: [string, string, string[]][] = [['', 'главная', []], ['welcome', 'привет', []], ['about', 'авторы', []], ['letters', 'письма', ['welcome']], ['thoughts', 'мысли', ['welcome']], ['notebook', 'тетрадка', ['welcome']],
  ['room', 'комната', ['about']], ['diary', 'дневник', ['thoughts']], ['terminal', 'терминал', ['room']], ['mirror', 'зеркало', ['diary']], ['files', 'файлы', ['terminal']]]
function Layout() {
  const { pathname } = useLocation()
  const p = useProg(); const d = useDread()
  const [kon, setKon] = useState(false)
  useEffect(() => { const K = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a'.split(','); let i = 0
    const h = (e: KeyboardEvent) => { i = e.key === K[i] ? i + 1 : e.key === K[0] ? 1 : 0; if (i === K.length) { i = 0; setKon(true); setTimeout(() => setKon(false), 6000) } }
    addEventListener('keydown', h); return () => removeEventListener('keydown', h) }, [])
  useEffect(() => { const k = pathname.replace(/^\//, '').split('/')[0]; if (!p.seen.includes(k)) patch({ seen: [...p.seen, k] }) }, [pathname])
  useEffect(() => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; let l = 0
    const m = (e: PointerEvent) => { const n = performance.now(); if (n - l < 70) return; l = n; const s = document.createElement('span'); s.textContent = '✦♡✧'[Math.floor(Math.random() * 3)]
      s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;color:var(--ac);pointer-events:none;z-index:90;transition:all .8s;font-size:12px`
      document.body.appendChild(s); requestAnimationFrame(() => { s.style.transform = 'translateY(22px)'; s.style.opacity = '0' }); setTimeout(() => s.remove(), 850) }
    addEventListener('pointermove', m); return () => removeEventListener('pointermove', m) }, [])
  useEffect(() => { ensureSession().catch(() => {}) }, [])
  useEffect(() => { const f = document.getElementById('fav') as HTMLLinkElement; f.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${d > .7 ? '◉' : d > .4 ? '♡' : '♡'}</text></svg>`; document.title = d > .75 ? 'uwu.uz ... ' : 'uwu.uz ♡' }, [d])
  return <><div className="scan" /><div className="vig" />
    <nav className="flex flex-wrap gap-4 justify-center p-4 text-sm relative z-10">{NAV.filter(([, , n]) => n.every(k => p.seen.includes(k))).map(([k, t]) => <Link key={k} to={'/' + k}>{k === 'notebook' && p.solved.length ? `${t} ${p.solved.length}/17` : t}</Link>)}</nav>
    {kon && <p className="fixed top-16 inset-x-0 text-center glow z-[60]">...that trick doesn't work here anymore. but I remember it.</p>}
    <main className="relative z-10 max-w-2xl mx-auto px-4 pb-16"><Suspense fallback={<p className="dim text-center mt-20">...</p>}><Outlet /></Suspense></main></>
}
export default function App() {
  return <Routes><Route element={<Layout />}><Route path="/" element={<Home />} /><Route path="/thoughts" element={<Thoughts />} /><Route path="/diary" element={<Diary />} />
    <Route path="/terminal" element={<Terminal />} /><Route path="/mirror" element={<Mirror />} /><Route path="/void" element={<Void />} /><Route path="/room" element={<Room />} />
    <Route path="/files" element={<Files />} /><Route path="/secrets" element={<Secrets />} /><Route path="/notebook" element={<Secrets />} /><Route path="/welcome" element={<Welcome />} /><Route path="/about" element={<About />} /><Route path="/letters" element={<Letters />} /><Route path="/door" element={<Door />} /><Route path="/secret/:n" element={<Hidden />} /><Route path="*" element={<NotFound />} /></Route></Routes>
}
