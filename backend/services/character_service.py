from typing import Optional
from models.character import Character
from schemas.character import CharacterCreate, CharacterUpdate, CharacterSchema


class CharacterService:
    @staticmethod
    def create_character(character_data: CharacterCreate) -> Character:
        # Convert enum values to strings for neo4j storage
        character_dict = character_data.dict()
        character = Character(**character_dict)
        character.save()
        return character

    @staticmethod
    def get_character(uid: str) -> Optional[Character]:
        return Character.nodes.first_or_none(uid=uid)

    @staticmethod
    def update_character(
        uid: str, character_data: CharacterUpdate
    ) -> Optional[Character]:
        character = Character.nodes.first_or_none(uid=uid)
        if not character:
            return None

        # Update only provided fields
        update_data = character_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(character, key, value)

        character.save()
        return character

    @staticmethod
    def delete_character(uid: str) -> bool:
        character = Character.nodes.first_or_none(uid=uid)
        if character:
            character.delete()
            return True
        return False

    @staticmethod
    def list_characters() -> list[Character]:
        return Character.nodes.all()
