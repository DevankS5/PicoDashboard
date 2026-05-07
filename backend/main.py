from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import init_db, close_db
from models.board import Board
from models.agent import Agent
from models.task import Task
from models.message import Message
from routers import agents, boards, tasks, approvals, skills, health, messages
from services.health_service import start_health_scheduler, stop_health_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db([Board, Agent, Task, Message])
    start_health_scheduler()
    yield
    stop_health_scheduler()
    await close_db()


app = FastAPI(title="Mission Control API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(agents.router, prefix="/agents")
app.include_router(boards.router, prefix="/boards")
app.include_router(tasks.router, prefix="/tasks")
app.include_router(messages.router, prefix="/tasks")
app.include_router(approvals.router)
app.include_router(skills.router, prefix="/skills")
