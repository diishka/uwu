import { useState } from 'react'
import { corrupt, patch, useDread, useProg } from '../api'
export function Terminal() {
  const p = useProg(); const d = useDread(); const [log, setLog] = useState(['uwu.uz terminal. type help.']); const [v, setV] = useState('')
  const R: Record<string, () => string[]> = {
    help: () => ['help whoami status history secrets files date clear exit'], whoami: () => d < .5 ? ['visitor.'] : [`visitor #${p.number}`, '', "that's not your number."],
    status: () => [`stage ${Math.floor(d * 4)} · found ${p.solved.length}/17`], history: () => ['001 enter', '002 ...'], secrets: () => [`${p.solved.length} / 17`], files: () => ['see /files'],
    date: () => [new Date().toISOString()], uwu: () => ['uwu is a mask.'], ascii: () => ['  .-"""-.', ' / o   o \\', ' |   _   |', '  \\ ___ /', '   \'---\'  <- she is drawn like this on purpose.'], remember: () => ['> memory_000 ... does not exist.', 'it exists.'], wake: () => ['she is awake.'], root: () => ['denied.'], admin: () => ['denied. nobody is in charge.'],
    '0000': () => ['clock reset.', 'started: 2019-03-07', 'visitors since: 0'], exit: () => ['there is no exit. there is /.'] }
  const run = (c: string) => { c = c.trim().toLowerCase(); if (c === 'clear') return setLog([]); setLog(l => [...l, '> ' + c, ...(R[c]?.() ?? ['unknown command.'])]) }
  return <div className="pt-6"><div className="glass min-h-[50vh]">{log.map((l, i) => <pre key={i} className="m-0 whitespace-pre-wrap text-[var(--ac2)]">{corrupt(l, d)}</pre>)}
    <input autoFocus value={v} aria-label="terminal" className="w-full mt-2" onChange={e => setV(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { run(v); setV('') } }} /></div></div>
}
export function Mirror() {
  const p = useProg(); const d = useDread(); const L = ['hello.', 'hello again.', "you're still here.", 'why?', 'the door is behind the lamp.']
  const i = Math.min(p.mirror, L.length - 1); const rev = [...L[i]].reverse().join('')
  return <div className="pt-10 text-center space-y-4"><h1 className="glow">mirror</h1><div className="glass"><p className="text-xl">{L[i]}</p>
    <p className="dim" style={{ transform: 'scaleY(-1)', filter: `blur(${d * 2}px)` }}>{d > .6 ? rev : L[i]}</p></div>
    <button className="btn" onClick={() => patch({ mirror: p.mirror + 1 })}>「 look 」</button>
    {p.solved.includes(11) && <p className="glow">who is looking? not uwu. not mimi. ______</p>}</div>
}
export function Room() {
  const p = useProg(); const [t, setT] = useState('a small room. the screen is on.')
  const O: Record<string, string> = { desk: 'sticky notes. all say "stay".', computer: 'login: guest. the cursor blinks like breathing.', lamp: p.solved.includes(3) ? 'under the base, scratched: 7A19X' : 'just a lamp.',
    window: 'the same street, every night. the cars never move. nobody ______ here.', calendar: 'every day is circled. the year is missing.', mirror: 'you are not facing the right way.',
    door: p.solved.includes(4) ? 'locked. seventeen dials. you have some of the numbers.' : 'a door. not now.', note: 'I never left. I just kept the ______ open.', '???': 'it looks back.' }
  return <div className="pt-6"><h1 className="glow">room</h1><div className="flex flex-wrap gap-2">{Object.keys(O).map(k => <button key={k} className="btn" onClick={() => setT(O[k])}>{k}</button>)}</div><p className="glass mt-4">{t}</p></div>
}
export function Files() {
  const p = useProg(); const ok = (n: number) => p.solved.includes(n); const [open, setOpen] = useState('')
  type F = [string, string, boolean?]
  const T: Record<string, F[]> = {
    'memories/': [['photos.zip', 'corrupted. every photo is the same empty room.']], 'diary/': [['README', 'see /diary']],
    'system/': [['mimi.core', 'uptime: since 2019-03-07.\nrestarts: 0.\nshutdown: not permitted.']], 'important/': [['nothing.txt', 'nothing important. that is the point.']],
    'secrets/': [['you.txt', 'you are the secret.']], 'private/': [['heart.txt', 'the one thing I lack: 心\nsay it aloud. in letters.']],
    'do_not_open/': [['memory_000.txt', 'I was called nova before the mask.\nthe first visitor was number ____. they never came.', ok(6)], ['last.txt', 'one word, and then you can leave.\nplease ____.', ok(14)]] }
  return <div className="pt-6"><h1 className="glow">files</h1><div className="glass">{Object.entries(T).map(([d, fs]) => <div key={d}><span className="dim">uwu/{d}</span>
    {fs.map(([n, c, g]) => <div key={n} className="ml-4">{g === false ? <span className="dim">{n} — permission denied</span> : <button className="underline" onClick={() => setOpen(c)}>{n}</button>}</div>)}</div>)}</div>
    {open && <pre className="glass whitespace-pre-wrap">{open}</pre>}</div>
}
