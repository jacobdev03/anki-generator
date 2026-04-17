import os
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.processor import PDFProcessor

router = APIRouter()

@router.post("/upload")
async def handle_upload(file: UploadFile = File(...)):
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
        chunks = processor.get_markdown_chunks(chunk_size=1000)
        
        return {
            "message": "Processing successful",
            "file_name": file.filename,
            "total_chunks": len(chunks),
            "chunks": chunks
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {e}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
