import os
from openai import AsyncOpenAI
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

class Flashcard(BaseModel):
    front: str
    back: str

class FlashcardList(BaseModel):
    flashcards: list[Flashcard]

class AIService:
    @staticmethod
    async def generate_cards_from_chunk(chunk_text: str):
        system_instructions = (
            "Role: You are an expert educator specializing in Spaced Repetition Systems (SRS). "
            "Your goal is to extract high-quality, exam-relevant flashcards from the provided lecture slides or text.\n\n"
            "1. Relevance Filtering (CRITICAL):\n"
            "- Ignore 'Administrative Noise': Do not create cards for information that is not part of the core academic subject. "
            "This includes teacher names, office hours, grading scales, assignment deadlines, slide numbers, or course codes.\n"
            "- Focus on Concepts: Only generate cards for definitions, processes, relationships, and applications related to the actual topic of the slides.\n\n"
            "2. Task Guidelines:\n"
            "- Atomicity: Each flashcard must cover only one specific fact. Break complex slides into multiple granular cards.\n"
            "- Question Clarity: Phrase the front of the card so it is unambiguous. Avoid 'Yes/No' questions.\n"
            "- Theory to Practice: For theoretical concepts, include a card asking for a real-world application or a concrete example of how that concept is used.\n\n"
            "3. Formatting:\n"
            "Polish language in response.\n"
            "Use Markdown for the output:\n"
            "Front: [Question/Prompt]\n"
            "Back: [Answer/Explanation]\n\n"
            "4. Technical Requirements:\n"
            "- Use LaTeX for any mathematical or scientific formulas (e.g., $\Delta v = a \cdot t$).\n"
            "- Use 'Cloze Deletion' (fill-in-the-blanks) for complex definitions where appropriate.\n\n"
            "Use polish language in response."
        )

        try:
            response = await client.beta.chat.completions.parse(
                model="gpt-5.4-mini",
                messages=[
                    {"role": "system", "content": system_instructions},
                    {"role": "user", "content": f"Extract cards from this text:\n\n{chunk_text}"}
                ],
                response_format=FlashcardList,
            )

            parsed_result = response.choices[0].message.parsed
            return [card.model_dump() for card in parsed_result.flashcards] if parsed_result else []
        
        except Exception as e:
            print(f"Error during AI generation: {e}")
            raise Exception(f"AI generation failed: {e}")