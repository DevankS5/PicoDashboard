from typing import Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from models.board import Board

router = APIRouter()


def _board_out(board: Board) -> dict:
    return {
        "id": str(board.id),
        "name": board.name,
        "created_at": board.created_at.isoformat() if board.created_at else None,
    }


def _ok(data) -> dict:
    return {"success": True, "data": data}


def _not_found():
    raise HTTPException(status_code=404, detail={"success": False, "error": "Board not found", "code": "NOT_FOUND"})


class CreateBoardBody(BaseModel):
    name: str


class UpdateBoardBody(BaseModel):
    name: Optional[str] = None


@router.get("")
async def list_boards():
    boards = await Board.find_all().to_list()
    return _ok([_board_out(b) for b in boards])


@router.get("/{board_id}")
async def get_board(board_id: str):
    board = await Board.get(PydanticObjectId(board_id))
    if board is None:
        return _not_found()
    return _ok(_board_out(board))


@router.post("", status_code=201)
async def create_board(body: CreateBoardBody):
    board = Board(name=body.name)
    await board.insert()
    return _ok(_board_out(board))


@router.put("/{board_id}")
async def update_board(board_id: str, body: UpdateBoardBody):
    board = await Board.get(PydanticObjectId(board_id))
    if board is None:
        return _not_found()
    if body.name is not None:
        board.name = body.name
    await board.save()
    return _ok(_board_out(board))


@router.delete("/{board_id}", status_code=200)
async def delete_board(board_id: str):
    board = await Board.get(PydanticObjectId(board_id))
    if board is None:
        return _not_found()
    await board.delete()
    return _ok({"id": board_id, "deleted": True})
