import os
import tempfile
from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.api.endpoints.auth import get_current_active_user
from app.models.user import User
from app.models.deck import Deck
from app.models.flashcard import Flashcard
from app.services.exporter import AnkiExporter

router = APIRouter()

# --- Schemas ---
class FlashcardInput(BaseModel):
    front: str
    back: str

class FlashcardResponse(BaseModel):
    id: int
    deck_id: int
    front: str
    back: str
    created_at: datetime

    class Config:
        from_attributes = True

class DeckCreate(BaseModel):
    title: str
    flashcards: List[FlashcardInput]

class DeckResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    flashcard_count: int

    class Config:
        from_attributes = True

class DeckDetailResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    flashcards: List[FlashcardResponse]

    class Config:
        from_attributes = True

# --- Endpoints ---

@router.post("/decks", response_model=DeckDetailResponse)
def create_deck(
    deck_in: DeckCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    new_deck = Deck(user_id=current_user.id, title=deck_in.title)
    db.add(new_deck)
    db.commit()
    db.refresh(new_deck)

    flashcards_to_create = []
    for card_in in deck_in.flashcards:
        flashcards_to_create.append(Flashcard(deck_id=new_deck.id, front=card_in.front, back=card_in.back))
    
    db.add_all(flashcards_to_create)
    db.commit()

    db.refresh(new_deck)
    return new_deck

@router.get("/decks", response_model=List[DeckResponse])
def get_decks(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    decks = db.query(Deck).filter(Deck.user_id == current_user.id).order_by(Deck.created_at.desc()).all()
    # add flashcard_count
    for deck in decks:
        deck.flashcard_count = len(deck.flashcards)
    return decks

@router.get("/decks/{deck_id}", response_model=DeckDetailResponse)
def get_deck(
    deck_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.user_id == current_user.id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    return deck

@router.delete("/decks/{deck_id}")
def delete_deck(
    deck_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.user_id == current_user.id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    
    db.delete(deck)
    db.commit()
    return {"message": "Deck deleted successfully"}

@router.put("/flashcards/{card_id}", response_model=FlashcardResponse)
def update_flashcard(
    card_id: int,
    card_in: FlashcardInput,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    card = db.query(Flashcard).join(Deck).filter(Flashcard.id == card_id, Deck.user_id == current_user.id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    
    card.front = card_in.front
    card.back = card_in.back
    db.commit()
    db.refresh(card)
    return card

@router.delete("/flashcards/{card_id}")
def delete_flashcard(
    card_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    card = db.query(Flashcard).join(Deck).filter(Flashcard.id == card_id, Deck.user_id == current_user.id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    
    db.delete(card)
    db.commit()
    return {"message": "Flashcard deleted successfully"}

def remove_temp_file(path: str):
    if os.path.exists(path):
        try:
            os.remove(path)
        except Exception as e:
            print(f"Warning: Failed to delete temp file {path} - {e}")

@router.get("/decks/{deck_id}/export")
def export_saved_deck(
    deck_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.user_id == current_user.id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    
    if not deck.flashcards:
        raise HTTPException(status_code=400, detail="Cannot export an empty deck.")
    
    fd, tmp_path = tempfile.mkstemp(suffix=".apkg")
    print(tmp_path)
    os.close(fd)

    try:
        cards_dict = [{"front": c.front, "back": c.back} for c in deck.flashcards]
        AnkiExporter.generate_deck(deck.title, cards_dict, tmp_path)
        
        background_tasks.add_task(remove_temp_file, tmp_path)
        
        return FileResponse(
            path=tmp_path, 
            media_type="application/octet-stream", 
            filename=f"{deck.title}.apkg"
        )
    except Exception as e:
        remove_temp_file(tmp_path)
        raise HTTPException(status_code=500, detail=f"Failed to export deck: {str(e)}")
