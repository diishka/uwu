import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, corrupt, patch, solve, useDread, useProg } from '../api'
import Girl from '../components/Girl'
import Counter from '../components/Counter'
const POEM = ['здесь можно просто посидеть и ничего не делать ♡', 'каждый, кто заходит сюда, немного важен.', 'чай остыл, но я оставила тебе место.', 'ты пришёл — значит, день уже не зря.', 'я нарисовала звёзды на потолке. посмотри вверх.', 'никуда не торопись. я подожду.']
const PET = Array.from({ length: 10 }, (_, i) => ({ x: (i * 37) % 100, d: 12 + (i % 5) * 3, w: -i * 2 }))
export function Home() {
  const p = useProg(); const d = useDread(); const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % POEM.length), 5500); return () => clearInterval(t) }, [])
  return <div className="pt-6 text-center space-y-5">
    {PET.map((q, k) => <span key={k} className="petal" aria-hidden style={{ left: q.x + '%', animationDuration: q.d + 's', animationDelay: q.w + 's' }}>✿</span>)}
    <h1 className="glow text-5xl m-0">uwu.uz</h1><p className="dim m-0">маленький уютный уголок интернета ♡</p>
    <Girl say={corrupt(POEM[i], d)} />
    <div className="flex gap-3 justify-center flex-wrap"><Link to="/welcome" className="btn">「 привет 」</Link><Link to="/about" className="btn">「 об авторах 」</Link></div>
    {p.number && <p className="m-0">{corrupt(`ты наш гость №${p.number}`, d)}</p>}<Counter />
    <p className="text-xs dim"><span title="m i m i" style={{ opacity: .4 }}>♡</span> сделано с любовью</p></div>
}
export function Welcome() {
  const p = useProg(); const d = useDread()
  return <div className="pt-6 space-y-4"><h1 className="glow">привет, гость{p.number ? ` №${p.number}` : ''} ♡</h1>
    <div className="glass space-y-3"><p>добро пожаловать на uwu.uz. надеюсь, тебе здесь будет уютно и ты хорошо проведёшь время.</p>
      <p>здесь нет ничего важного: только мягкий свет, пара странных комнат и немного тишины.</p>
      <p>а ещё тут спрятано несколько пасхалок. сможешь ли ты найти их? :-)</p>
      <p className="dim">совет: читай внимательнее, наводи курсор туда, где обычно ничего нет, и заглядывай на страницы, которые кажутся скучными.</p>
      <p>когда что-нибудь найдёшь, запиши это в <Link to="/notebook">мою тетрадку</Link>. я проверю ♡</p></div>
    <p className="text-center dim">{corrupt('я так рада, что ты зашёл(ла).', d)}</p>
    <div className="flex gap-3 justify-center flex-wrap"><Link to="/letters" className="btn">「 письма 」</Link><Link to="/thoughts" className="btn">「 мысли 」</Link></div></div>
}
export function About() {
  return <div className="pt-6 space-y-4"><h1 className="glow">об этом месте</h1>
    <div className="glass space-y-3"><p>uwu.uz — небольшой сайт, сделанный просто потому, что хотелось сделать что-то красивое и немного странное.</p>
      <p><b>авторы</b><br />· человек за клавиатурой: идеи, код, чай<br />· Mimi: живёт здесь и следит за порядком<br />· ты: без тебя тут было бы тихо</p>
      <p><b>спасибо</b><br />всем, кто читает мелкий текст; тем, кто наводит курсор на пустое место; и пустоте (<Link to="/void">/void</Link>) за то, что она всегда рядом.</p></div>
    <p className="text-center dim text-sm">© 2019 – ∞ uwu.uz · сделано с ♡</p>
    <p className="text-center"><Link to="/room" className="btn">「 заглянуть в комнату 」</Link></p></div>
}
const LET = ['милый гость,\nспасибо, что нашёл(ла) это место. я оставила свет включённым — на случай, если ты придёшь поздно.', 'если сегодня был тяжёлый день, можно просто посидеть здесь. тут никто ничего не спрашивает.',
  'я собираю маленькие вещи: закаты, пустые вагоны, имена звёзд, чьи-то сообщения «доехал». ты можешь оставить здесь что-нибудь своё ♡', 'знаешь, самое тёплое слово — «останься». но я говорю его тихо, чтобы не пугать.',
  'p.s. если долго сидеть тихо, я слышу, как ты дышишь.']
export function Letters() {
  const d = useDread()
  return <div className="pt-6 space-y-4"><h1 className="glow">письма</h1>{LET.map((l, i) => <p key={i} className="glass whitespace-pre-line m-0">{corrupt(l, d)}</p>)}</div>
}
export function Secrets() {
  const p = useProg(); const [rows, setRows] = useState<any[]>([]); const [msg, setMsg] = useState(''); const [hint, setHint] = useState<Record<number, string>>({}); const [fin, setFin] = useState('')
  const load = () => api<any[]>('/secrets').then(setRows).catch(() => setMsg('the server is asleep.'))
  useEffect(() => { load() }, [p.solved.length])
  const submit = async (id: number, v: string) => { try { setMsg((await solve(id, v)).message ?? '♡') } catch (e: any) { setMsg(String(e.message) === '403' ? 'not yet.' : String(e.message) === '429' ? 'slow down.' : 'no.') } }
  const final = async () => { try { const r = await api<any>('/final/solve', { method: 'POST', body: JSON.stringify({ answer: fin }) }); if (r.unlocked) location.href = r.destination; else setMsg(r.message) } catch { setMsg('no.') } }
  return <div className="pt-4 space-y-3"><h1 className="glow">тетрадка</h1><p className="text-sm dim">{msg || 'запиши, что нашёл(ла). по одному ответу за раз ♡'}</p>
    {rows.map(r => <div key={r.id} className="glass !p-3"><div className="flex justify-between"><span>{String(r.id).padStart(2, '0')} {r.solved ? 'FOUND' : r.locked ? 'LOCKED' : 'UNKNOWN'}</span><span>{r.title}</span></div>
      {!r.solved && !r.locked && <form className="flex flex-wrap gap-2 mt-2" onSubmit={e => { e.preventDefault(); const i = e.currentTarget.elements.namedItem('a') as HTMLInputElement; submit(r.id, i.value); i.value = '' }}>
        <input name="a" aria-label={`answer ${r.id}`} autoComplete="off" maxLength={64} /><button className="btn">ok</button>
        {[1, 2].map(n => <button key={n} type="button" className="dim underline" onClick={() => api<any>(`/secrets/${r.id}/hint/${n}`).then(h => setHint({ ...hint, [r.id]: h.hint }))}>hint {n}</button>)}</form>}
      {hint[r.id] && !r.solved && <p className="text-sm dim mt-1">{hint[r.id]}</p>}</div>)}
    <h2 className="glow">fragments</h2>{Object.keys(p.frag).sort((a, b) => +a - +b).map(k => <p key={k} className="my-1">{p.frag[+k]}</p>)}
    <h2 className="glow">code</h2><p className="tracking-[.3em] break-all">{Array.from({ length: 17 }, (_, i) => p.piece[i + 1] ?? '_').join('')}</p>
    {p.solved.length >= 17 && <form className="flex gap-2" onSubmit={e => { e.preventDefault(); final() }}><input value={fin} onChange={e => setFin(e.target.value)} aria-label="final code" /><button className="btn">open</button></form>}</div>
}
export function Door() {
  const [s, setS] = useState(0)
  useEffect(() => { const t = [2500, 5500, 8500, 11500, 14500].map((ms, i) => setTimeout(() => setS(i + 1), ms)); return () => t.forEach(clearTimeout) }, [])
  const L = ['YOU FOUND EVERYTHING.', '...', 'are you sure?', '17 / 17', '18 / 18', 'you missed one.']
  return <div className="min-h-[70vh] grid place-items-center text-center"><div>{L.slice(0, s + 1).map((l, i) => <p key={i} className="glow text-2xl">{l}</p>)}</div></div>
}
export function NotFound() { return <div className="min-h-[70vh] grid place-items-center text-center"><div><h1 className="glow text-6xl">404</h1><p>this page was never made.</p><p className="dim">...or it was, and was removed.</p><Link to="/" className="btn inline-block mt-3">「 go back 」</Link></div></div> }
export function Hidden() {
  const { n } = useParams(); const p = useProg(); const id = Number(n); const done = p.solved.includes(id)
  if (!(id >= 1 && id <= 17)) return <NotFound />
  return <div className="min-h-[70vh] grid place-items-center text-center"><div className="glass space-y-2"><pre className="m-0 glow">{'  ( o . o )\n   > ^ <'.replace('> ^ <', done ? '\\_♡_/' : '\\_?_/')}</pre>
    <p>door {String(id).padStart(2, '0')}</p><p className={done ? 'glow' : 'dim'}>{done ? p.frag[id] : "you haven't earned this door yet. you are close, though."}</p></div></div>
}
