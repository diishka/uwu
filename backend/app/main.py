from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.router import api
from app.core.config import settings

prod = settings.app_env == "production"
app = FastAPI(title="uwu.uz", docs_url=None if prod else "/docs", redoc_url=None, openapi_url=None if prod else "/openapi.json")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins.split(","), allow_methods=["GET", "POST"], allow_headers=["*"])

@app.middleware("http")
async def limit_body(req: Request, call_next):
    if int(req.headers.get("content-length") or 0) > 2048:
        return JSONResponse({"detail": "too big"}, 413)
    return await call_next(req)

app.include_router(api, prefix="/api")
