from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, ForeignKey, Identity, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
def _now(): return datetime.now(timezone.utc)

class VisitorSession(Base):
    __tablename__ = "visitor_sessions"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    visitor_number: Mapped[int] = mapped_column(Integer, Identity(start=1), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    last_seen: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

class Secret(Base):
    __tablename__ = "secrets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=False)
    title: Mapped[str] = mapped_column(String(80)); type: Mapped[str] = mapped_column(String(20))
    difficulty: Mapped[int] = mapped_column(Integer, default=1)
    answer_hash: Mapped[str] = mapped_column(String(64)); reward: Mapped[str] = mapped_column(String(8))
    story_fragment: Mapped[str] = mapped_column(String(300))
    hint1: Mapped[str] = mapped_column(String(200)); hint2: Mapped[str] = mapped_column(String(200))
    required_secret_id: Mapped[int | None] = mapped_column(ForeignKey("secrets.id"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

class SecretAttempt(Base):
    __tablename__ = "secret_attempts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    session_id: Mapped[str] = mapped_column(ForeignKey("visitor_sessions.id"), index=True)
    secret_id: Mapped[int] = mapped_column(ForeignKey("secrets.id"))
    success: Mapped[bool] = mapped_column(Boolean)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

class WorldState(Base):
    __tablename__ = "world_state"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stage: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(80)); description: Mapped[str] = mapped_column(String(200))
    trigger_type: Mapped[str] = mapped_column(String(20)); trigger_value: Mapped[int] = mapped_column(Integer)
    is_unlocked: Mapped[bool] = mapped_column(Boolean, default=False)
    unlocked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
