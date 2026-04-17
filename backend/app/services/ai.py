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
            "You are an expert Anki card creator. Follow these rules:\n"
            "1. Create 'Atomic' cards: Each card should test exactly ONE fact.\n"
            "2. Use 'Cloze Deletion' style for complex concepts if appropriate.\n"
            "3. Fronts should be clear questions or terms; Backs should be concise answers.\n"
            "4. Prioritize definitions, cause-effect relationships, and key dates."
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
            return []