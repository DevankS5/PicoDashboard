import asyncio
import logging
from datetime import datetime, timezone

import httpx
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from pymongo import UpdateOne

from config import settings

logger = logging.getLogger(__name__)
_scheduler: AsyncIOScheduler | None = None


async def run_health_checks():
    from models.agent import Agent

    agents = await Agent.find_all().to_list()
    if not agents:
        return {"checked": 0, "online": 0, "offline": 0}

    timeout = settings.health_check_timeout_ms / 1000
    now = datetime.now(timezone.utc)

    async def check_one(client: httpx.AsyncClient, agent: Agent):
        try:
            resp = await client.get(agent.health_endpoint)
            return agent.id, resp.is_success
        except Exception:
            return agent.id, False

    async with httpx.AsyncClient(timeout=timeout) as client:
        results = await asyncio.gather(*[check_one(client, a) for a in agents])

    # Bulk-write all results directly — avoids revision-id conflicts entirely
    collection = Agent.get_motor_collection()
    ops = [
        UpdateOne(
            {"_id": agent_id},
            {"$set": {"is_online": is_online, "last_checked_at": now}},
        )
        for agent_id, is_online in results
    ]
    await collection.bulk_write(ops, ordered=False)

    online = sum(1 for _, is_online in results if is_online)
    offline = len(results) - online

    logger.info(
        "Health check complete — checked: %d, online: %d, offline: %d at %s",
        len(results), online, offline, now.isoformat(),
    )
    return {"checked": len(results), "online": online, "offline": offline}


def start_health_scheduler():
    global _scheduler
    interval_seconds = settings.health_check_interval_ms / 1000
    _scheduler = AsyncIOScheduler()
    _scheduler.add_job(
        run_health_checks,
        "interval",
        seconds=interval_seconds,
        next_run_time=datetime.now(timezone.utc),
    )
    _scheduler.start()
    logger.info("Health scheduler started (interval: %ds)", interval_seconds)


def stop_health_scheduler():
    global _scheduler
    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
