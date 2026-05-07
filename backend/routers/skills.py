from datetime import datetime
from typing import Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from dependencies.agent_auth import agent_auth
from models.agent import Agent
from models.task import Task, TaskStatus

router = APIRouter()


def _ok(data) -> dict:
    return {"success": True, "data": data}


def _task_out(task: Task) -> dict:
    return {
        "id": str(task.id),
        "board_id": task.board_id,
        "name": task.name,
        "description": task.description,
        "assigned_to": task.assigned_to,
        "assigned_by": task.assigned_by,
        "status": task.status.value,
        "deadline": task.deadline.isoformat() if task.deadline else None,
        "approval_note": task.approval_note,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "updated_at": task.updated_at.isoformat() if task.updated_at else None,
    }


# --- Request bodies ---

class CreateTaskBody(BaseModel):
    board_id: str
    name: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    assigned_to: Optional[str] = None


# --- Routes ---

@router.get("")
async def list_skills():
    return _ok([
        {
            "skill": "get-tasks",
            "method": "GET",
            "path": "/skills/get-tasks",
            "description": "Returns tasks assigned to the calling agent. Optional ?status= filter.",
            "auth": "required",
        },
        {
            "skill": "create-task",
            "method": "POST",
            "path": "/skills/create-task",
            "description": "Creates a task on behalf of the calling agent (sets assigned_by automatically).",
            "auth": "required",
        },
        {
            "skill": "delete-task",
            "method": "DELETE",
            "path": "/skills/delete-task/{task_id}",
            "description": "Deletes a task the calling agent created (assigned_by must match caller).",
            "auth": "required",
        },
        {
            "skill": "get-agents",
            "method": "GET",
            "path": "/skills/get-agents",
            "description": "Returns all agents (id, name, description, is_online). No sensitive fields.",
            "auth": "required",
        },
    ])


@router.get("/get-tasks")
async def get_tasks(
    status: Optional[TaskStatus] = Query(default=None),
    calling_agent: Agent = Depends(agent_auth),
):
    filters: dict = {"assigned_to": str(calling_agent.id)}
    if status:
        filters["status"] = status.value
    tasks = await Task.find(filters).to_list()
    return _ok([_task_out(t) for t in tasks])


@router.post("/create-task", status_code=201)
async def create_task(
    body: CreateTaskBody,
    calling_agent: Agent = Depends(agent_auth),
):
    task = Task(
        board_id=body.board_id,
        name=body.name,
        description=body.description,
        deadline=body.deadline,
        assigned_to=body.assigned_to,
        assigned_by=str(calling_agent.id),
    )
    await task.insert()
    return _ok(_task_out(task))


@router.delete("/delete-task/{task_id}", status_code=200)
async def delete_task(
    task_id: str,
    calling_agent: Agent = Depends(agent_auth),
):
    task = await Task.get(PydanticObjectId(task_id))
    if task is None:
        raise HTTPException(
            status_code=404,
            detail={"success": False, "error": "Task not found", "code": "NOT_FOUND"},
        )
    if task.assigned_by != str(calling_agent.id):
        raise HTTPException(
            status_code=403,
            detail={"success": False, "error": "You can only delete tasks you created", "code": "FORBIDDEN"},
        )
    await task.delete()
    return _ok({"id": task_id, "deleted": True})


@router.get("/get-agents")
async def get_agents(calling_agent: Agent = Depends(agent_auth)):
    agents = await Agent.find_all().to_list()
    return _ok([
        {
            "id": str(a.id),
            "name": a.name,
            "description": a.description,
            "is_online": a.is_online,
        }
        for a in agents
    ])
