from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext

from models.agent import Agent

_bearer = HTTPBearer()
_pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def agent_auth(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> Agent:
    raw_key = credentials.credentials
    agents = await Agent.find_all().to_list()
    for agent in agents:
        if _pwd.verify(raw_key, agent.api_key_hash):
            return agent
    raise HTTPException(
        status_code=401,
        detail={"success": False, "error": "Invalid or missing API key", "code": "UNAUTHORIZED"},
    )
