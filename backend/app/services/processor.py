import pymupdf
import pymupdf4llm
import pytesseract
from PIL import Image
import io


_MIN_TEXT_LENGTH = 500

class PDFProcessor:
    def __init__(self, file_path: str):
        self.file_path = file_path

    @staticmethod
    def _ocr_page(page: pymupdf.Page, dpi: int = 300) -> str:
        """Render a single PDF page to an image and run OCR on it."""
        mat = pymupdf.Matrix(dpi / 72, dpi / 72)
        pix = page.get_pixmap(matrix=mat)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        return pytesseract.image_to_string(img)

    @staticmethod
    def _is_text_empty(text: str) -> bool:
        """Check whether extracted text is too short to be useful."""
        stripped = text.strip()
        meaningful = stripped.replace("#", "").replace("-", "").replace("*", "").strip()
        return len(meaningful) < _MIN_TEXT_LENGTH


    def extract_text(self) -> str:
        """Extract text from each page, falling back to OCR for scanned pages."""
        parts: list[str] = []

        with pymupdf.open(self.file_path) as doc:
            for page in doc:
                page_text = page.get_text()
                if self._is_text_empty(page_text):
                    page_text = self._ocr_page(page)
                parts.append(page_text)

        return "\n".join(parts).strip()

    def get_markdown_chunks(self, chunk_size=1500):
        """Return chunked markdown, using OCR as a fallback for scanned PDFs."""

        md_text = pymupdf4llm.to_markdown(self.file_path)

        if self._is_text_empty(md_text):
            md_text = self._ocr_full_document()

        return self._split_into_chunks(md_text, chunk_size)

    def _ocr_full_document(self) -> str:
        """OCR every page of the PDF and return combined text."""
        pages: list[str] = []
        with pymupdf.open(self.file_path) as doc:
            for page in doc:
                pages.append(self._ocr_page(page))
        return "\n\n".join(pages)

    @staticmethod
    def _split_into_chunks(text: str, chunk_size: int) -> list[str]:
        paragraphs = text.split("\n\n")
        chunks: list[str] = []
        current_chunk = ""

        for para in paragraphs:
            if len(current_chunk) + len(para) < chunk_size:
                current_chunk += para + "\n\n"
            else:
                if current_chunk.strip():
                    chunks.append(current_chunk.strip())
                current_chunk = para + "\n\n"

        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        return chunks