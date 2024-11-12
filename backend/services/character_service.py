from typing import Optional, Dict, Any
from fastapi import HTTPException
from models.character import Character
from models.user import User


class CharacterService:
    @staticmethod
    def create_character(character_data: Dict[str, Any], user: User) -> Character:
        try:
            # Create character instance but don't save yet
            character = Character(**character_data)

            # Try to save and catch any database-specific errors
            try:
                character.save()
            except Exception as db_error:
                raise ValueError(f"Database error: {str(db_error)}")

            # Try to connect owner
            try:
                character.owner.connect(user)
            except Exception as rel_error:
                # Clean up if owner connection fails
                character.delete()
                raise ValueError(f"Error connecting owner: {str(rel_error)}")

            return character

        except Exception as e:
            # Re-raise with the actual error message
            raise ValueError(f"Failed to create character: {str(e)}")

    @staticmethod
    def get_character(uid: str) -> Optional[Character]:
        return Character.nodes.first_or_none(uid=uid)

    @staticmethod
    def update_character(
        uid: str, character_data: Dict[str, Any]
    ) -> Optional[Character]:
        character = CharacterService.get_character(uid)
        if not character:
            return None

        # Update only provided fields
        for key, value in character_data.dict(exclude_unset=True).items():
            if hasattr(character, key):
                setattr(character, key, value)

        character.save()
        return character

    @staticmethod
    def delete_character(uid: str) -> bool:
        character = CharacterService.get_character(uid)
        if not character:
            return False
        character.delete()
        return True

    @staticmethod
    def is_owner(character: Character, user: User) -> bool:
        return any(rel.end_node.uid == user.uid for rel in character.owner)

    @staticmethod
    def get_character_stats(uid: str) -> Dict[str, Any]:
        character = CharacterService.get_character(uid)
        if not character:
            raise HTTPException(status_code=404, detail="Character not found")

        return {
            "ability_scores": {
                "strength": character.strength,
                "dexterity": character.dexterity,
                "constitution": character.constitution,
                "intelligence": character.intelligence,
                "wisdom": character.wisdom,
                "charisma": character.charisma,
            },
            "ability_modifiers": character.calculate_all_modifiers(),
            "saving_throws": character.saving_throws,
            "skills": character.skills,
            "proficiency_bonus": character.calculate_proficiency_bonus(),
            "armor_class": character.armor_class,
            "initiative": character.initiative,
            "speed": character.speed,
            "hit_points": character.hit_points,
            "temp_hit_points": character.temp_hit_points,
            "hit_dice": character.hit_dice,
        }

    @staticmethod
    def update_character_stats(uid: str, stats_data: Dict[str, Any]) -> Character:
        character = CharacterService.get_character(uid)
        if not character:
            raise HTTPException(status_code=404, detail="Character not found")

        # Update ability scores and other stats
        for key, value in stats_data.items():
            if hasattr(character, key):
                setattr(character, key, value)

        character.save()
        return character
