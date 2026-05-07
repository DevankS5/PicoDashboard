from datetime import datetime, timezone
from typing import Optional
from beanie import Document, Indexed


class Agent(Document):
    name: Indexed(str, unique=True)
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
