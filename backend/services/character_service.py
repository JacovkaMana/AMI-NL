import uuid
from typing import Optional, Dict, Any
from models.character import Character
from models.user import User


class CharacterService:
    @staticmethod
    def create_character(
        character_data: Dict[str, Any], current_user: User
    ) -> Character:
        """
        Create a new character for a user

        Args:
            character_data: Dictionary containing character attributes
            current_user: User who will own the character

        Returns:
            Character: Created character instance

        Raises:
            Exception: If character creation fails
        """
        # Generate a unique ID for the character
        character_data["uid"] = str(uuid.uuid4())

        # Convert skills from kebab-case to snake_case if needed
        if "skills" in character_data:
            skills = character_data["skills"]
            character_data["skills"] = {
                key.replace("-", "_"): value for key, value in skills.items()
            }

        try:
            # Create the character node
            character = Character(**character_data).save()

            # Create relationship between user and character
            current_user.characters.connect(character)

            return character
        except Exception as e:
            print(f"Error creating character: {str(e)}")
            raise

    @staticmethod
    def get_character(uid: str) -> Optional[Character]:
        """
        Retrieve a character by its unique identifier

        Args:
            uid: Character's unique identifier

        Returns:
            Optional[Character]: Character if found, None otherwise
        """
        try:
            return Character.nodes.get_or_none(uid=uid)
        except Exception as e:
            print(f"Error retrieving character: {str(e)}")
            return None

    @staticmethod
    def update_character(
        uid: str, character_data: Dict[str, Any]
    ) -> Optional[Character]:
        """
        Update an existing character

        Args:
            uid: Character's unique identifier
            character_data: Dictionary containing updated character attributes

        Returns:
            Optional[Character]: Updated character if found, None otherwise
        """
        character = Character.nodes.first_or_none(uid=uid)
        if character:
            try:
                for key, value in character_data.items():
                    if key == "skills" and isinstance(value, dict):
                        value = {k.replace("-", "_"): v for k, v in value.items()}
                    setattr(character, key, value)
                character.save()
                return character
            except Exception as e:
                print(f"Error updating character: {str(e)}")
                return None
        return None

    @staticmethod
    def delete_character(uid: str) -> bool:
        """
        Delete a character

        Args:
            uid: Character's unique identifier

        Returns:
            bool: True if deleted successfully, False otherwise
        """
        try:
            character = Character.nodes.first_or_none(uid=uid)
            if character:
                character.delete()
                return True
            return False
        except Exception as e:
            print(f"Error deleting character: {str(e)}")
            return False

    @staticmethod
    def get_character_stats(uid: str) -> Optional[Dict[str, Any]]:
        """
        Get character statistics

        Args:
            uid: Character's unique identifier

        Returns:
            Optional[Dict[str, Any]]: Character statistics if found, None otherwise
        """
        try:
            character = Character.nodes.first_or_none(uid=uid)
            if not character:
                return None

            modifiers = character.calculate_modifiers()
            return {
                "ability_scores": {
                    "strength": character.strength,
                    "dexterity": character.dexterity,
                    "constitution": character.constitution,
                    "intelligence": character.intelligence,
                    "wisdom": character.wisdom,
                    "charisma": character.charisma,
                },
                "modifiers": modifiers,
                "armor_class": character.armor_class,
                "initiative": character.initiative,
                "speed": character.speed,
                "hit_points": character.hit_points,
                "temp_hit_points": character.temp_hit_points,
                "saving_throws": character.saving_throws,
                "skills": character.skills,
            }
        except Exception as e:
            print(f"Error getting character stats: {str(e)}")
            return None

    @staticmethod
    def is_owner(character, user):
        return character.owner.is_connected(user)
