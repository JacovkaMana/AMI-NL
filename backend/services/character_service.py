from models.character import Character
from models.user import User
import uuid


class CharacterService:
    @staticmethod
    def create_character(character_data: dict, current_user: User) -> Character:
        # Generate a unique ID for the character
        character_data["uid"] = str(uuid.uuid4())

        # Convert skills from kebab-case to snake_case if needed
        if "skills" in character_data:
            skills = character_data["skills"]
            character_data["skills"] = {
                key.replace("-", "_"): value for key, value in skills.items()
            }

        # Create the character node
        try:
            character = Character(**character_data).save()

            # Create relationship between user and character
            current_user.characters.connect(character)

            return character
        except Exception as e:
            print(f"Error creating character: {str(e)}")
            raise e

    @staticmethod
    def get_character(uid: str) -> Character:
        return Character.nodes.first_or_none(uid=uid)

    @staticmethod
    def update_character(uid: str, character_data: dict) -> Character:
        character = Character.nodes.first_or_none(uid=uid)
        if character:
            for key, value in character_data.items():
                if key == "skills" and isinstance(value, dict):
                    value = {k.replace("-", "_"): v for k, v in value.items()}
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
    def get_character_stats(uid: str) -> dict:
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
