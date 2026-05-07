from datetime import datetime, timezone
from typing import Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from models.agent import Agent
from models.task import Task, TaskStatus

router = APIRouter()


def _ok(data) -> dict:
    return {"success": True, "data": data}


def _not_found():
    raise HTTPException(status_code=404, detail={"success": False, "error": "Task not found", "code": "NOT_FOUND"})


def _task_out(task: Task, agents: dict[str, dict] | None = None) -> dict:
    """Serialize a Task. If agents dict is provided, resolve assigned_to/assigned_by names."""
    def resolve(agent_id: Optional[str]) -> Optional[dict]:
        if agent_id is None:
            return None
        if agents and agent_id in agents:
            return agents[agent_id]
        return {"id": agent_id, "name": None}

    return {
        "id": str(task.id),
        "board_id": task.board_id,
        "name": task.name,
        "description": task.description,
        "assigned_to": resolve(task.assigned_to),
        "assigned_by": resolve(task.assigned_by),
        "status": task.status.value,
        "deadline": task.deadline.isoformat() if task.deadline else None,
        "approval_note": task.approval_note,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "updated_at": task.updated_at.isoformat() if task.updated_at else None,
    }


async def _load_agent_map(task: Task) -> dict[str, dict]:
    """Fetch agent docs for the IDs referenced in a single task."""
    ids = {i for i in [task.assigned_to, task.assigned_by] if i}
    if not ids:
        return {}
    agents = await Agent.find({"_id": {"$in": [PydanticObjectId(i) for i in ids]}}).to_list()
    return {str(a.id): {"id": str(a.id), "name": a.name} for a in agents}


# --- Request bodies ---

class CreateTaskBody(BaseModel):
    board_id: str
    name: str
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    assigned_by: Optional[str] = None
    status: Optional[TaskStatus] = TaskStatus.NOT_STARTED
    deadline: Optional[datetime] = None


class UpdateTaskBody(BaseModel):
    board_id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    assigned_by: Optional[str] = None
    status: Optional[TaskStatus] = None
    deadline: Optional[datetime] = None
    approval_note: Optional[str] = None


# --- Routes ---

@router.get("")
async def list_tasks(
    board_id: Optional[str] = Query(default=None),
    status: Optional[TaskStatus] = Query(default=None),
    assigned_to_id: Optional[str] = Query(default=None),
):
    filters: dict = {}
    if board_id:
        filters["board_id"] = board_id
    if status:
        filters["status"] = status.value
    if assigned_to_id:
        filters["assigned_to"] = assigned_to_id

    tasks = await Task.find(filters).to_list()
    ids = {i for t in tasks for i in [t.assigned_to, t.assigned_by] if i}
    agent_map: dict[str, dict] = {}
    if ids:
        agents = await Agent.find({"_id": {"$in": [PydanticObjectId(i) for i in ids]}}).to_list()
        agent_map = {str(a.id): {"id": str(a.id), "name": a.name} for a in agents}
    return _ok([_task_out(t, agent_map) for t in tasks])


@router.get("/{task_id}")
async def get_task(task_id: str):
    task = await Task.get(PydanticObjectId(task_id))
    if task is None:
        return _not_found()
    agent_map = await _load_agent_map(task)
    return _ok(_task_out(task, agent_map))


@router.post("", status_code=201)
async def create_task(body: CreateTaskBody):
    task = Task(
        board_id=body.board_id,
        name=body.name,
        description=body.description,
        assigned_to=body.assigned_to,
        assigned_by=body.assigned_by,
        status=body.status,
        deadline=body.deadline,
    )
    await task.insert()
    return _ok(_task_out(task))


@router.put("/{task_id}")
async def update_task(task_id: str, body: UpdateTaskBody):
    task = await Task.get(PydanticObjectId(task_id))
    if task is None:
        return _not_found()
    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    task.updated_at = datetime.now(timezone.utc)
    await task.save()
    agent_map = await _load_agent_map(task)
    return _ok(_task_out(task, agent_map))


@router.delete("/{task_id}", status_code=200)
async def delete_task(task_id: str):
    task = await Task.get(PydanticObjectId(task_id))
    if task is None:
        return _not_found()
    await task.delete()
    return _ok({"id": task_id, "deleted": True})
