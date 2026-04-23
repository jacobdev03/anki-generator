import os
import tempfile
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from app.services.exporter import AnkiExporter
from app.api.endpoints.auth import get_current_active_user
from app.models.user import User

router = APIRouter()

class FlashcardInput(BaseModel):
    front: str
    back: str

class ExportRequest(BaseModel):
    deck_name: str
    flashcards: List[FlashcardInput]

def remove_temp_file(path: str):
    if os.path.exists(path):
        try:
            os.remove(path)
        except Exception as e:
            print(f"Warning: Failed to delete temp file {path} - {e}")

@router.post("/export")
async def export_deck(
    request: ExportRequest, 
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user)
):
    if not request.flashcards:
        raise HTTPException(status_code=400, detail="Flashcards list cannot be empty.")
    
    fd, tmp_path = tempfile.mkstemp(suffix=".apkg")
    os.close(fd)

    try:
        cards_dict = [card.model_dump() for card in request.flashcards]
        AnkiExporter.generate_deck(request.deck_name, cards_dict, tmp_path)
        

        background_tasks.add_task(remove_temp_file, tmp_path)
        
        return FileResponse(
            path=tmp_path, 
            media_type="application/octet-stream", 
            filename=f"{request.deck_name}.apkg"
        )
    except Exception as e:
        remove_temp_file(tmp_path)
        raise HTTPException(status_code=500, detail=f"Failed to export deck: {str(e)}")
