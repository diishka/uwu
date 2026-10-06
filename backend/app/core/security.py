import time
from collections import defaultdict
from fastapi import HTTPException
_hits: dict[str, list[float]] = defaultdict(list)

def rate_limit(key: str, limit: int = 12, window: int = 60) -> None:
    now = time.time(); h = [t for t in _hits[key] if now - t < window]
    if len(h) >= limit:
        raise HTTPException(429, "slow down.")
    h.append(now); _hits[key] = h
