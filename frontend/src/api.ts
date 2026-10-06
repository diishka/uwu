import { useEffect, useState, useSyncExternalStore } from 'react'
const K = 'uwu.v1'
export type Prog = { session?: string; number?: number; in?: boolean; seen: string[]; mirror: number; solved: number[]; frag: Record<number, string>; piece: Record<number, string> }
const base: Prog = { seen: [], mirror: 0, solved: [], frag: {}, piece: {} }
let state: Prog = (() => { try { return { ...base, ...JSON.parse(localStorage.getItem(K) || '{}') } } catch { return base } })()
const subs = new Set<() => void>()
export const patch = (p: Partial<Prog>) => { state = { ...state, ...p }; try { localStorage.setItem(K, JSON.stringify(state)) } catch {} subs.forEach(f => f()) }
export const useProg = () => useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => state)
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch('/api' + path, { ...init, headers: { 'Content-Type': 'application/json', 'X-Session': state.session ?? '' } })
  if (!r.ok) throw new Error(String(r.status)); return r.json()
}
export const ensureSession = async () => {
  const r = await api<{ session_id: string; visitor_number: number }>('/visitors/session', { method: 'POST', body: JSON.stringify({ session_id: state.session ?? null }) })
  patch({ session: r.session_id, number: r.visitor_number })
}
export const solve = async (id: number, answer: string) => {
  const r = await api<{ correct: boolean; message?: string; reward?: string; fragment?: string }>(`/secrets/${id}/solve`, { method: 'POST', body: JSON.stringify({ answer }) })
  if (r.correct && !state.solved.includes(id)) patch({ solved: [...state.solved, id], frag: { ...state.frag, [id]: r.fragment! }, piece: { ...state.piece, [id]: r.reward! } })
  return r
}
const t0 = Number(sessionStorage.getItem('uwu.t0') || Date.now()); sessionStorage.setItem('uwu.t0', String(t0))
/** dread 0..1: grows with minutes on site (≈12 min to ~.6) and with secrets found */
export function useDread() {
  const p = useProg(); const [, tick] = useState(0)
  useEffect(() => { const i = setInterval(() => tick(x => x + 1), 15000); return () => clearInterval(i) }, [])
  const d = Math.min(1, ((Date.now() - t0) / 60000 / 12) * .6 + (p.solved.length / 17) * .5)
  useEffect(() => { document.documentElement.style.setProperty('--d', d.toFixed(2)); document.documentElement.dataset.dread = String(d < .25 ? 0 : d < .5 ? 1 : d < .75 ? 2 : 3) }, [d])
  return d
}
export const corrupt = (s: string, d: number) => d < .45 ? s : [...s].map((c, i) => c !== ' ' && (i * 7919 + s.length * 31) % 100 < (d - .4) * 14 ? '▒░#?'[i % 4] : c).join('')
