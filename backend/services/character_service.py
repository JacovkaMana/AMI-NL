from backend.app.models.character import Character  # Importing the Character model
from backend.app.schemas.character import CharacterSchema


class CharacterService:
    @staticmethod
    def create_character(character_data: CharacterSchema) -> Character:
        character = Character(**character_data.dict())
        character.save()
        return character

    @staticmethod
    def get_character(uid: str) -> Character:  # Added method to get character by UID
        return Character.get(uid)

    # ... additional service methods can be added here ...
