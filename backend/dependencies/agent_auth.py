import bcrypt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from models.agent import Agent

_bearer = HTTPBearer()


async def agent_auth(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> Agent:
    raw_key = credentials.credentials.encode()
    agents = await Agent.find_all().to_list()
    for agent in agents:
        if bcrypt.checkpw(raw_key, agent.api_key_hash.encode()):
            return agent
    raise HTTPException(
        status_code=401,
        detail={"success": False, "error": "Invalid or missing API key", "code": "UNAUTHORIZED"},
    )
