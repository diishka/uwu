import hashlib, hmac, re, secrets as sec
from datetime import datetime, timedelta, timezone
from fastapi import WebSocket
from sqlalchemy import func, select
from app.core.config import settings
from app.models import Event, Secret, SecretAttempt, VisitorSession, WorldState

def now(): return datetime.now(timezone.utc)
def norm(a: str) -> str: return re.sub(r"[^a-z0-9_]", "", a.lower())
def digest(a: str) -> str: return hashlib.sha256((settings.answer_salt + norm(a)).encode()).hexdigest()
def same(a: str, b: str) -> bool: return hmac.compare_digest(a, b)

class Hub:
    def __init__(self): self.conns: set[WebSocket] = set()
    async def add(self, ws: WebSocket): await ws.accept(); self.conns.add(ws); await self.push()
    async def drop(self, ws: WebSocket): self.conns.discard(ws); await self.push()
    async def push(self):
        for c in list(self.conns):
            try: await c.send_json({"online": len(self.conns)})
            except Exception: self.conns.discard(c)
hub = Hub()

async def create_session(db, sid):
    if sid and (v := await db.get(VisitorSession, sid)):
        v.last_seen = now(); await db.commit(); return v
    v = VisitorSession(id=sec.token_urlsafe(16)); db.add(v); await db.commit(); await db.refresh(v); return v

async def stats(db):
    n = now(); day = n.replace(hour=0, minute=0, second=0, microsecond=0)
    cnt = lambda *w: db.scalar(select(func.count()).select_from(VisitorSession).where(*w))
    return {"total": await cnt(), "today": await cnt(VisitorSession.created_at >= day),
            "week": await cnt(VisitorSession.created_at >= n - timedelta(days=7)), "online": len(hub.conns)}

async def solved_ids(db, sid):
    return set(await db.scalars(select(SecretAttempt.secret_id).where(SecretAttempt.session_id == sid, SecretAttempt.success).distinct()))

async def world(db):
    total = (await stats(db))["total"]
    found = await db.scalar(select(func.count()).select_from(select(SecretAttempt.session_id, SecretAttempt.secret_id).where(SecretAttempt.success).distinct().subquery()))
    for e in await db.scalars(select(Event).where(Event.is_unlocked == False)):  # noqa
        val = total if e.trigger_type == "visitors" else found
        if val >= e.trigger_value: e.is_unlocked = True; e.unlocked_at = now()
    unlocked = await db.scalar(select(func.count()).select_from(Event).where(Event.is_unlocked))
    w = await db.get(WorldState, 1) or WorldState(id=1); w.stage = unlocked; w.updated_at = now(); db.add(w)
    await db.commit()
    return {"stage": unlocked, "total_visitors": total, "secrets_discovered": found, "events_unlocked": unlocked}

async def final_code(db):
    return "".join(await db.scalars(select(Secret.reward).where(Secret.is_active).order_by(Secret.id)))
