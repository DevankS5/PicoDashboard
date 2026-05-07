from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from dependencies.agent_auth import agent_auth
from models.agent import Agent
from models.message import Message
from models.task import Task

router = APIRouter()


def _ok(data) -> dict:
    return {"success": True, "data": data}


def _msg_out(msg: Message) -> dict:
    return {
        "id": str(msg.id),
        "task_id": msg.task_id,
        "sender_type": msg.sender_type,
        "sender_id": msg.sender_id,
        "content": msg.content,
        "created_at": msg.created_at.isoformat() if msg.created_at else None,
    }


async def _assert_task_exists(task_id: str):
    task = await Task.get(PydanticObjectId(task_id))
    if task is None:
        raise HTTPException(
            status_code=404,
            detail={"success": False, "error": "Task not found", "code": "NOT_FOUND"},
        )


# --- Request bodies ---

class OperatorMessageBody(BaseModel):
    content: str


class AgentMessageBody(BaseModel):
    content: str


# --- Routes ---

@router.get("/{task_id}/messages")
async def list_messages(task_id: str):
    await _assert_task_exists(task_id)
    messages = await Message.find({"task_id": task_id}).sort("+created_at").to_list()
    return _ok([_msg_out(m) for m in messages])


@router.post("/{task_id}/messages", status_code=201)
async def operator_send_message(task_id: str, body: OperatorMessageBody):
    await _assert_task_exists(task_id)
    msg = Message(task_id=task_id, sender_type="operator", content=body.content)
    await msg.insert()
    return _ok(_msg_out(msg))


@router.post("/{task_id}/agent-message", status_code=201)
async def agent_send_message(
    task_id: str,
    body: AgentMessageBody,
    calling_agent: Agent = Depends(agent_auth),
):
    await _assert_task_exists(task_id)
    msg = Message(
        task_id=task_id,
        sender_type="agent",
        sender_id=str(calling_agent.id),
        content=body.content,
    )
    await msg.insert()
    return _ok(_msg_out(msg))
