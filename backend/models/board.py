from datetime import datetime, timezone
from typing import Optional
from beanie import Document, Indexed


class Board(Document):
    name: Indexed(str, unique=True)
    created_at: datetime = None

    def model_post_init(self, __context):
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)

    class Settings:
        name = "boards"
