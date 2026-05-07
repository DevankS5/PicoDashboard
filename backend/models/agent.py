from datetime import datetime, timezone
from typing import Optional

from beanie import Document, Indexed
from pymongo import IndexModel, ASCENDING


class Agent(Document):
    name: Indexed(str, unique=True)
    agent_id: Optional[str] = None
    description: Optional[str] = None
    health_endpoint: str
    is_online: bool = False
    last_checked_at: Optional[datetime] = None
    created_at: datetime = None
    api_key_hash: str
    bot_webhook_url: Optional[str] = None

    def model_post_init(self, __context):
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)

    class Settings:
        name = "agents"
        indexes = [
            IndexModel(
                [("agent_id", ASCENDING)],
                unique=True,
                sparse=True,  # nulls don't participate in uniqueness check
                name="agent_id_sparse_unique",
            )
        ]
