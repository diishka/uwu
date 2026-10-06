import { useEffect, useState } from 'react'
import { api } from '../api'
export default function Counter() {
  const [s, setS] = useState({ total: 0, today: 0, week: 0, online: 0 })
  useEffect(() => {
    let ws: WebSocket | undefined, poll: number | undefined
    const load = () => api<typeof s>('/visitors/stats').then(setS).catch(() => {})
    load()
    try { ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/api/ws/visitors`)
      ws.onmessage = e => setS(v => ({ ...v, online: JSON.parse(e.data).online })); ws.onerror = () => { poll = window.setInterval(load, 15000) } }
    catch { poll = window.setInterval(load, 15000) }
    const slow = window.setInterval(load, 60000)
    return () => { ws?.close(); clearInterval(poll); clearInterval(slow) }
  }, [])
  return <p className="dim text-sm text-center">visitors {s.total} · today {s.today} · week {s.week} · online now {s.online}</p>
}
