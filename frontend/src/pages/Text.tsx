import { useEffect, useState } from 'react'
import { api, corrupt, useDread, useProg } from '../api'
const T = ['Whatever you are waiting for, it is already here.\n\nYou spend a lot of your life waiting for the next part to begin. School to end. The weekend to come. Someone to text you back. And one day you realize: you were already living it.',
 'All the people you miss are also missing someone.', 'Keeping a place alive is a kind of love. Nobody asks who keeps the lights on in an empty room.',
 'Everything you remember is rebuilt each time you remember it. Some of it is rebuilt wrong.', 'She wakes at 03:33. Everybody has an hour like that.',
 'One day you will visit this website for the last time. You won\'t know it\'s the last time.']
export function Thoughts() { const d = useDread(); return <div className="pt-6 space-y-5"><h1 className="glow">thoughts</h1>{T.map((t, i) => <p key={i} className="glass whitespace-pre-line">{corrupt(t, d)}</p>)}</div> }
export function Diary() {
  const d = useDread(); const p = useProg(); const [es, setEs] = useState<{ id: string; text: string }[]>([])
  useEffect(() => { api<typeof es>('/diary').then(setEs).catch(() => setEs([{ id: '001', text: 'today was nice. nothing happened. I like that.' }])) }, [p.solved.length, p.session])
  return <div className="pt-6 space-y-4"><h1 className="glow">diary</h1>
    {es.map(e => <div key={e.id} className="glass"><b>Entry {e.id}</b><p className={'whitespace-pre-line m-0 ' + (e.id === '???' ? 'dim' : '')}>{corrupt(e.text, d)}</p></div>)}
    {es.length < 12 && <p className="dim text-sm">the rest is not written yet.</p>}</div>
}
export function Void() {
  const [s, setS] = useState(0)
  useEffect(() => { const t = [4000, 8000, 12000].map((ms, i) => setTimeout(() => setS(i + 1), ms)); return () => t.forEach(clearTimeout) }, [])
  return <div className="min-h-[75vh] grid place-items-center text-center relative"><div><p>{s >= 1 && 'there is nothing here.'}</p><p>{s >= 2 && 'seriously.'}</p><p className="glow">{s >= 3 && <>okay.<br />maybe there is.</>}</p></div>
    {s >= 3 && <span title="0000" className="absolute bottom-6 right-6 opacity-10 hover:opacity-80 transition-opacity">•</span>}</div>
}
