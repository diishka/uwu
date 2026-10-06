import { useDread } from '../api'
/** Original anime-style girl "Mimi" (pure SVG). She changes subtly as dread grows: colder eyes, fading blush, flatter smile, a tear. */
export default function Girl({ say }: { say?: string }) {
  const d = useDread()
  const eye = (x: number) => <g key={x}>
    <ellipse cx={x} cy="118" rx="13" ry={17 + d * 3} fill="#fff" />
    <ellipse cx={x} cy="121" rx={9 + d * 2} ry={13 + d * 3} style={{ fill: `color-mix(in srgb,#7ad0ff ${100 - d * 100}%,#b01030)` }} />
    <ellipse cx={x} cy="122" rx={4 + d * 3} ry={7 + d * 4} fill="#1a0a2a" />
    <circle cx={x - 4} cy="114" r="4" fill="#fff" opacity={1 - d * .7} /><circle cx={x + 4} cy="127" r="2" fill="#fff" opacity={1 - d} /></g>
  return <div className="text-center"><svg viewBox="0 0 200 265" width="230" className="bob mx-auto" role="img" aria-label="Mimi" style={{ filter: 'drop-shadow(0 0 14px var(--ac))' }}>
    <ellipse cx="24" cy="190" rx="16" ry="44" fill="var(--ac)" opacity=".85" transform="rotate(8 24 190)" /><ellipse cx="176" cy="190" rx="16" ry="44" fill="var(--ac)" opacity=".85" transform="rotate(-8 176 190)" />
    <path d="M38 130 Q28 36 100 26 Q172 36 162 130 L162 215 Q150 238 136 215 L136 150 H64 V215 Q50 238 38 215Z" fill="var(--ac)" />
    <path d="M50 262 Q58 188 100 178 Q142 188 150 262Z" fill="#fff0f7" /><path d="M78 184 L100 214 L122 184 Q100 196 78 184Z" fill="var(--ac2)" /><path d="M92 214 L100 240 L108 214Z" fill="var(--ac)" />
    <ellipse cx="100" cy="125" rx="47" ry="53" fill="#ffe9ee" />
    <path d="M52 112 Q58 58 100 54 Q142 58 148 112 Q126 82 100 98 Q74 82 52 112Z" fill="var(--ac)" /><path d="M100 54 Q112 30 128 36 Q116 44 112 58Z" fill="var(--ac)" />
    <path d="M84 40 L100 52 L116 40 L116 60 L100 52 L84 60Z" fill="var(--ac2)" /><circle cx="100" cy="52" r="5" fill="#fff" />
    {[72, 128].map(eye)}
    {d > .55 && <path d="M72 140 Q70 152 73 160" stroke="#7ad0ff" strokeWidth="3" fill="none" opacity={d} />}
    <ellipse cx="64" cy="146" rx="9" ry="5" fill="#ff7aa8" opacity={.55 * (1 - d)} /><ellipse cx="136" cy="146" rx="9" ry="5" fill="#ff7aa8" opacity={.55 * (1 - d)} />
    <path d={`M91 154 Q100 ${164 - d * 14} 109 154`} stroke="#b0405e" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
    <p className="glow mt-3 min-h-[3rem] max-w-md mx-auto" aria-live="polite">{say}</p></div>
}
