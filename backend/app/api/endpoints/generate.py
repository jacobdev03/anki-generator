from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.ai import AIService
from app.api.endpoints.auth import get_current_active_user
from app.models.user import User
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()

class ChunkRequest(BaseModel):
    text: str

@router.post("/generate")
async def generate_cards(
    request: ChunkRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not request.text or request.text.strip() == "":
        raise HTTPException(status_code=400, detail="Text chunk cannot be empty.")

    if current_user.credits < 1:
        raise HTTPException(status_code=402, detail="Insufficient credits. Please purchase more credits.")
    try:
        flashcards = await AIService.generate_cards_from_chunk(request.text)
        current_user.credits -= 1
        db.commit()
        db.refresh(current_user)
        return {"flashcards": flashcards}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
