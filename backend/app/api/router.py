from fastapi import APIRouter, Depends, Header, HTTPException, Request, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
from sqlalchemy import select
from app import services as S
from app.core.security import rate_limit
from app.db.session import get_db
from app.diary import ENTRIES
from app.models import Event, Secret, SecretAttempt, VisitorSession

api = APIRouter()
class SessionIn(BaseModel): session_id: str | None = Field(None, max_length=64)
class SolveIn(BaseModel): answer: str = Field(max_length=64)

@api.get("/health")
async def health(): return {"ok": True}

@api.post("/visitors/session")
async def session(b: SessionIn, db=Depends(get_db)):
    v = await S.create_session(db, b.session_id)
    return {"visitor_number": v.visitor_number, "session_id": v.id}

@api.get("/visitors/stats")
async def vstats(db=Depends(get_db)): return await S.stats(db)

@api.websocket("/ws/visitors")
async def ws(w: WebSocket):
    await S.hub.add(w)
    try:
        while True: await w.receive_text()
    except WebSocketDisconnect: await S.hub.drop(w)

@api.get("/world")
async def world(db=Depends(get_db)): return await S.world(db)

@api.get("/events")
async def events(db=Depends(get_db)):
    rows = await db.scalars(select(Event).where(Event.is_unlocked).order_by(Event.id))
    return [{"name": e.name, "description": e.description} for e in rows]

@api.get("/secrets")
async def secrets(x_session: str = Header(""), db=Depends(get_db)):
    done = await S.solved_ids(db, x_session)
    return [{"id": s.id, "type": s.type, "difficulty": s.difficulty, "solved": s.id in done,
             "locked": bool(s.required_secret_id and s.required_secret_id not in done),
             "title": s.title if s.id in done else "???"} for s in await db.scalars(select(Secret).order_by(Secret.id))]

@api.get("/secrets/{sid}/hint/{n}")
async def hint(sid: int, n: int, db=Depends(get_db)):
    s = await db.get(Secret, sid)
    if not s or n not in (1, 2): raise HTTPException(404)
    return {"hint": s.hint1 if n == 1 else s.hint2}

async def _session(db, x):
    if not await db.get(VisitorSession, x): raise HTTPException(401, "who are you?")

@api.post("/secrets/{sid}/solve")
async def solve(sid: int, b: SolveIn, req: Request, x_session: str = Header(""), db=Depends(get_db)):
    rate_limit(f"{x_session}:{req.client.host if req.client else ''}")
    await _session(db, x_session)
    s = await db.get(Secret, sid)
    if not s or not s.is_active: raise HTTPException(404)
    if s.required_secret_id and s.required_secret_id not in await S.solved_ids(db, x_session):
        raise HTTPException(403, "not yet.")
    ok = S.same(S.digest(b.answer), s.answer_hash)
    db.add(SecretAttempt(session_id=x_session, secret_id=sid, success=ok)); await db.commit()
    if not ok: return {"correct": False, "message": "not quite."}
    return {"correct": True, "secret_id": sid, "reward": s.reward, "fragment": s.story_fragment}

@api.post("/final/solve")
async def final(b: SolveIn, req: Request, x_session: str = Header(""), db=Depends(get_db)):
    rate_limit(f"f{x_session}:{req.client.host if req.client else ''}", 6)
    await _session(db, x_session)
    total = len(list(await db.scalars(select(Secret.id).where(Secret.is_active))))
    if len(await S.solved_ids(db, x_session)) < total: return {"unlocked": False, "message": "not yet."}
    if S.norm(b.answer) == S.norm(await S.final_code(db)): return {"unlocked": True, "destination": "/door"}
    return {"unlocked": False, "message": "not quite."}

async def _visible(db, x):
    n = len(await S.solved_ids(db, x))
    return [{"id": i, "text": t} for i, t, m in ENTRIES if m <= n]

@api.get("/diary")
async def diary(x_session: str = Header(""), db=Depends(get_db)): return await _visible(db, x_session)

@api.get("/diary/{eid}")
async def diary_one(eid: str, x_session: str = Header(""), db=Depends(get_db)):
    for e in await _visible(db, x_session):
        if e["id"] == eid: return e
    raise HTTPException(404)
