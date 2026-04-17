import genanki
import random
import os

class AnkiExporter:
    @staticmethod
    def generate_deck(deck_name: str, flashcards: list[dict], output_path: str):
        # We need a unique ID for the model and deck.
        deck_id = random.randrange(1 << 30, 1 << 31)
        model_id = random.randrange(1 << 30, 1 << 31)

        # Standard Basic Anki Model
        my_model = genanki.Model(
            model_id,
            'Simple Model',
            fields=[
                {'name': 'Front'},
                {'name': 'Back'},
            ],
            templates=[
                {
                    'name': 'Card 1',
                    'qfmt': '{{Front}}',
                    'afmt': '{{FrontSide}}<hr id="answer">{{Back}}',
                },
            ])

        my_deck = genanki.Deck(deck_id, deck_name)

        for card in flashcards:
            front = card.get("front", "")
            back = card.get("back", "")
            
            # Simple conversion of newlines to HTML breaks so formatting stays intact in Anki
            front = front.replace('\n', '<br>')
            back = back.replace('\n', '<br>')

            note = genanki.Note(
                model=my_model,
                fields=[front, back]
            )
            my_deck.add_note(note)

        # Write to .apkg
        genanki.Package(my_deck).write_to_file(output_path)
        return output_path
