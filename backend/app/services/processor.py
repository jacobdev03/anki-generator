import pymupdf
import pymupdf4llm


class PDFProcessor:
    def __init__(self, file_path: str):
        self.file_path = file_path


    def extract_text(self) -> str:
        text = ""
        with pymupdf.open(self.file_path) as doc:
            for page in doc:
                text += page.get_text() + "\n"
        return text.strip()


    def get_markdown_chunks(self, chunk_size=1500):
        md_text = pymupdf4llm.to_markdown(self.file_path)
        
        paragraphs = md_text.split("\n\n")
        chunks = []
        current_chunk = ""

        for para in paragraphs:
            if len(current_chunk) + len(para) < chunk_size:
                current_chunk += para + "\n\n"
            else:
                chunks.append(current_chunk.strip())
                current_chunk = para + "\n\n"
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks