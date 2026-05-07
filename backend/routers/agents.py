import secrets
from typing import Optional

import bcrypt
from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from models.agent import Agent
from services.health_service import run_health_checks

router = APIRouter()


def _agent_out(agent: Agent, *, plaintext_key: Optional[str] = None) -> dict:
    doc = {
        "id": str(agent.id),
        "name": agent.name,
        "agent_id": agent.agent_id,
        "description": agent.description,
        "health_endpoint": agent.health_endpoint,
        "is_online": agent.is_online,
        "last_checked_at": agent.last_checked_at.isoformat() if agent.last_checked_at else None,
        "bot_webhook_url": agent.bot_webhook_url,
        "created_at": agent.created_at.isoformat() if agent.created_at else None,
    }
    if plaintext_key is not None:
        doc["api_key"] = plaintext_key
    return doc


def _ok(data) -> dict:
    return {"success": True, "data": data}


def _not_found():
    raise HTTPException(status_code=404, detail={"success": False, "error": "Agent not found", "code": "NOT_FOUND"})


# --- Request bodies ---

class CreateAgentBody(BaseModel):
    name: str
    agent_id: str
    description: Optional[str] = None
    health_endpoint: str
    bot_webhook_url: Optional[str] = None


class UpdateAgentBody(BaseModel):
    name: Optional[str] = None
    agent_id: Optional[str] = None
    description: Optional[str] = None
    health_endpoint: Optional[str] = None
    bot_webhook_url: Optional[str] = None


# --- Routes ---

@router.get("")
async def list_agents():
    agents = await Agent.find_all().to_list()
    return _ok([_agent_out(a) for a in agents])


@router.get("/{agent_id}")
async def get_agent(agent_id: str):
    agent = await Agent.get(PydanticObjectId(agent_id))
    if agent is None:
        return _not_found()
    return _ok(_agent_out(agent))


@router.post("", status_code=201)
async def create_agent(body: CreateAgentBody):
    raw_key = secrets.token_urlsafe(32)
    agent = Agent(
        name=body.name,
        agent_id=body.agent_id,
        description=body.description,
        health_endpoint=body.health_endpoint,
        bot_webhook_url=body.bot_webhook_url,
        api_key_hash=bcrypt.hashpw(raw_key.encode(), bcrypt.gensalt()).decode(),
    )
    await agent.insert()
    return _ok(_agent_out(agent, plaintext_key=raw_key))


@router.put("/{agent_id}")
async def update_agent(agent_id: str, body: UpdateAgentBody):
    agent = await Agent.get(PydanticObjectId(agent_id))
    if agent is None:
        return _not_found()
    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(agent, field, value)
    await agent.save()
    return _ok(_agent_out(agent))


@router.delete("/{agent_id}", status_code=200)
async def delete_agent(agent_id: str):
    agent = await Agent.get(PydanticObjectId(agent_id))
    if agent is None:
        return _not_found()
    await agent.delete()
    return _ok({"id": agent_id, "deleted": True})


@router.post("/{agent_id}/regenerate-key", status_code=200)
async def regenerate_key(agent_id: str):
    agent = await Agent.get(PydanticObjectId(agent_id))
    if agent is None:
        return _not_found()
    raw_key = secrets.token_urlsafe(32)
    agent.api_key_hash = bcrypt.hashpw(raw_key.encode(), bcrypt.gensalt()).decode()
    await agent.save()
    return _ok({"id": agent_id, "api_key": raw_key})


@router.post("/health-check", status_code=200)
async def manual_health_check():
    result = await run_health_checks()
    return _ok(result)
