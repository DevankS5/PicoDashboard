from datetime import datetime, timezone
from enum import Enum
from typing import Optional, Annotated
from beanie import Document, Indexed
from bson import ObjectId
from pydantic import Field


class TaskStatus(str, Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    REQUIRES_APPROVAL = "REQUIRES_APPROVAL"
    DONE = "DONE"


class Task(Document):
    board_id: Indexed(str)
    name: str
    description: Optional[str] = None
    assigned_to: Optional[str] = None   # Agent ObjectId as string
    assigned_by: Optional[str] = None   # Agent ObjectId as string
    status: Indexed(TaskStatus) = TaskStatus.NOT_STARTED
    created_at: datetime = None
    updated_at: datetime = None
    deadline: Optional[datetime] = None
    approval_note: Optional[str] = None

    def model_post_init(self, __context):
        now = datetime.now(timezone.utc)
        if self.created_at is None:
            self.created_at = now
        if self.updated_at is None:
            self.updated_at = now

    class Settings:
        name = "tasks"
        indexes = [
            "board_id",
            "status",
            "assigned_to",
        ]
