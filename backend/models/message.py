from datetime import datetime, timezone
from typing import Literal, Optional
from beanie import Document


class Message(Document):
    task_id: str
    sender_type: Literal["operator", "agent"]
    sender_id: Optional[str] = None  # Agent ObjectId as string; null for operator
    content: str
    created_at: datetime = None

    def model_post_init(self, __context):
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)

    class Settings:
        name = "messages"
        indexes = ["task_id"]
