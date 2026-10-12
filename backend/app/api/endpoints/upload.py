import os
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.services.processor import PDFProcessor
from app.api.endpoints.auth import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.post("/upload")
async def handle_upload(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    MAX_SIZE = 10 * 1024 * 1024
    if file.size and file.size > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds the 10MB limit.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        try:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to read file: {e}")

    try:
        processor = PDFProcessor(tmp_path)
        chunks = processor.get_markdown_chunks(chunk_size=2000)
        
        if (current_user.credits < len(chunks)):
            raise HTTPException(status_code=400, detail="You don't have enough credits to process this file")

        return {
            "message": "Processing successful",
            "file_name": file.filename,
            "total_chunks": len(chunks),
            "chunks": chunks
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {e}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
