"""Check the actual downloaded Anki package using only the standard library."""

import json
from contextlib import closing
from pathlib import Path
import sqlite3
import sys
import tempfile
import zipfile


def main():
    package, expected_front, expected_back, count = sys.argv[1:]
    with tempfile.TemporaryDirectory() as directory:
        collection = Path(directory) / "collection.anki2"
        with zipfile.ZipFile(package) as archive:
            collection.write_bytes(archive.read("collection.anki2"))
            json.loads(archive.read("media"))
        with closing(sqlite3.connect(collection)) as db:
            notes = [fields.split("\x1f") for (fields,) in db.execute("SELECT flds FROM notes")]
            cards = db.execute("SELECT count(*) FROM cards").fetchone()[0]
        assert len(notes) == int(count), f"Unexpected note count: {len(notes)}"
        assert cards == int(count), f"Unexpected card count: {cards}"
        assert [expected_front, expected_back] in notes, "Edited card missing from export"
    print("Downloaded APKG contains the expected cards and persisted edits.")


if __name__ == "__main__":
    main()
