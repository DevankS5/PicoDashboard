import asyncio
import logging
from datetime import datetime, timezone

import httpx
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from config import settings

logger = logging.getLogger(__name__)
_scheduler: AsyncIOScheduler | None = None


async def run_health_checks():
    from models.agent import Agent

    agents = await Agent.find_all().to_list()
    checked = online = offline = 0
    timeout = settings.health_check_timeout_ms / 1000

    async with httpx.AsyncClient(timeout=timeout) as client:
        for agent in agents:
            checked += 1
            try:
                resp = await client.get(agent.health_endpoint)
                agent.is_online = resp.is_success
            except Exception:
                agent.is_online = False

            agent.last_checked_at = datetime.now(timezone.utc)
            await agent.save()

            if agent.is_online:
                online += 1
            else:
                offline += 1

    logger.info(
        "Health check complete — checked: %d, online: %d, offline: %d at %s",
        checked,
        online,
        offline,
        datetime.now(timezone.utc).isoformat(),
    )
    return {"checked": checked, "online": online, "offline": offline}


def start_health_scheduler():
    global _scheduler
    interval_seconds = settings.health_check_interval_ms / 1000
    _scheduler = AsyncIOScheduler()
    _scheduler.add_job(run_health_checks, "interval", seconds=interval_seconds, next_run_time=datetime.now(timezone.utc))
    _scheduler.start()
    logger.info("Health scheduler started (interval: %ds)", interval_seconds)


def stop_health_scheduler():
    global _scheduler
    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
