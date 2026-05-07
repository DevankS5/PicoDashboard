import logging
from typing import Literal

import httpx
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from dependencies.agent_auth import agent_auth
from models.agent import Agent
from models.task import Task, TaskStatus

router = APIRouter()
logger = logging.getLogger(__name__)


def _ok(data) -> dict:
    return {"success": True, "data": data}


def _not_found():
    raise HTTPException(
        status_code=404,
        detail={"success": False, "error": "Task not found", "code": "NOT_FOUND"},
    )


def _task_summary(task: Task) -> dict:
    return {
        "id": str(task.id),
        "board_id": task.board_id,
        "name": task.name,
        "description": task.description,
        "status": task.status.value,
        "approval_note": task.approval_note,
        "assigned_to": task.assigned_to,
        "assigned_by": task.assigned_by,
        "deadline": task.deadline.isoformat() if task.deadline else None,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "updated_at": task.updated_at.isoformat() if task.updated_at else None,
    }


# --- Request bodies ---

class RequireApprovalBody(BaseModel):
    task_id: str
    reason: str | None = None


class ResolveApprovalBody(BaseModel):
    action: Literal["approve", "reject"]


# --- Routes ---

@router.get("/approvals")
async def list_approvals():
    tasks = await Task.find({"status": TaskStatus.REQUIRES_APPROVAL.value}).to_list()
    return _ok([_task_summary(t) for t in tasks])


@router.post("/require_approval")
async def require_approval(
    body: RequireApprovalBody,
    calling_agent: Agent = Depends(agent_auth),
):
    task = await Task.get(PydanticObjectId(body.task_id))
    if task is None:
        _not_found()

    task.status = TaskStatus.REQUIRES_APPROVAL
    task.approval_note = body.reason
    await task.save()

    # Fire-and-forget: POST to agent's bot_webhook_url if configured
    if calling_agent.bot_webhook_url:
        payload = {
            "event": "require_approval",
            "task_id": str(task.id),
            "task_name": task.name,
            "agent_id": str(calling_agent.id),
            "agent_name": calling_agent.name,
            "reason": body.reason,
        }
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                await client.post(calling_agent.bot_webhook_url, json=payload)
        except Exception as exc:
            logger.warning("Bot webhook delivery failed for agent %s: %s", calling_agent.name, exc)

    return _ok(_task_summary(task))


@router.post("/approvals/{task_id}/resolve")
async def resolve_approval(task_id: str, body: ResolveApprovalBody):
    task = await Task.get(PydanticObjectId(task_id))
    if task is None:
        _not_found()

    if body.action == "approve":
        task.status = TaskStatus.IN_PROGRESS
    else:
        task.status = TaskStatus.NOT_STARTED

    await task.save()
    return _ok(_task_summary(task))
