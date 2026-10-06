import { corrupt, useDread } from '../api'
const lines = ['hi ♡', 'oh... you\'re back.', 'you really like this place.', 'do you remember me?', 'I remember you.']
export default function Mimi({ say }: { say?: string }) {
  const d = useDread(); const extra = d > .55 ? [[40, 44], [100, 44]] : []; const more = d > .8 ? [[70, 30], [70, 58]] : []
  return <div className="text-center"><svg viewBox="0 0 140 120" width="150" className="bob" role="img" aria-label="mimi" style={{ filter: `drop-shadow(0 0 12px var(--ac)) hue-rotate(${d * -20}deg)` }}>
    <path d="M25 100 Q10 40 70 20 Q130 40 115 100 Q70 118 25 100Z" fill="var(--ac)" opacity=".92" />
    {[[48, 62], [92, 62], ...extra, ...more].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={i < 2 ? 6 : 3.5} ry={i < 2 ? 9 : 5} fill="#0b0720" />)}
    <text x="70" y="92" textAnchor="middle" fontSize="14" fill="#0b0720">{d > .6 ? '﹏' : '♡'}</text></svg>
    <p className="glow mt-2 min-h-[1.5rem]" aria-live="polite">{corrupt(say ?? lines[Math.min(4, Math.floor(d * 5))], d)}</p></div>
}
