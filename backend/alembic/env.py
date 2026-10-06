import asyncio
import sys
from pathlib import Path

# Alembic executes this file from the migration directory.  Make the backend
# root importable so `app` can be resolved both locally and in the container.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings
from app.db.base import Base
import app.models  # noqa

def run(conn):
    context.configure(connection=conn, target_metadata=Base.metadata)
    with context.begin_transaction():
        context.run_migrations()

async def main():
    e = create_async_engine(settings.database_url)
    async with e.begin() as c:
        await c.run_sync(run)
    await e.dispose()

asyncio.run(main())
