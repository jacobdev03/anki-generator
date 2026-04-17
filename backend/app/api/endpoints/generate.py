from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai import AIService

router = APIRouter()

class ChunkRequest(BaseModel):
    text: str

@router.post("/generate")
async def generate_cards(request: ChunkRequest):
    if not request.text or request.text.strip() == "":
        raise HTTPException(status_code=400, detail="Text chunk cannot be empty.")

    try:
        flashcards = await AIService.generate_cards_from_chunk(request.text)
        return {"flashcards": flashcards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
