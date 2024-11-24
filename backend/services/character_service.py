from typing import Optional, Dict, Any
from fastapi import HTTPException
from models.character import Character
from models.user import User
from neomodel import db
from datetime import datetime
from schemas.character import CharacterStatsResponse


class CharacterService:
    # Add this mapping at the class level
    skill_to_ability = {
        "acrobatics": "dexterity",
        "animal_handling": "wisdom",
        "arcana": "intelligence",
        "athletics": "strength",
        "deception": "charisma",
        "history": "intelligence",
        "insight": "wisdom",
        "intimidation": "charisma",
        "investigation": "intelligence",
        "medicine": "wisdom",
        "nature": "intelligence",
        "perception": "wisdom",
        "performance": "charisma",
        "persuasion": "charisma",
        "religion": "intelligence",
        "sleight_of_hand": "dexterity",
        "stealth": "dexterity",
        "survival": "wisdom",
    }

    @staticmethod
    def create_character(character_data: Dict[str, Any], user: User) -> Character:
        try:
            # Add timestamps
            character_data["created_at"] = datetime.utcnow()
            character_data["updated_at"] = datetime.utcnow()

            # Set default values
            character_data["experience"] = character_data.get("experience", 0)
            character_data["level"] = character_data.get("level", 1)

            # Create character instance
            character = Character(**character_data)

            # Calculate and set initial hit points
            max_hp = character.get_max_hit_points()
            character.hit_points = max_hp
            character.current_hit_points = max_hp

            # Calculate and set initial initiative
            character.initiative = character.calculate_initiative()

            character.save()

            # Create the OWNED_BY relationship
            character.owner.connect(user)

            return character

        except Exception as e:
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

        # Update the updated_at timestamp
        character_data["updated_at"] = datetime.utcnow()

        # Set current_hit_points equal to hit_points if not provided
        if (
            "hit_points" in character_data
            and "current_hit_points" not in character_data
        ):
            character_data["current_hit_points"] = character_data["hit_points"]

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
        """
        Check if user owns the character using Cypher query to ensure correct relationship check
        """
        query = """
        MATCH (c:Character)-[:OWNED_BY]->(u:User)
        WHERE c.uid = $character_uid AND u.uid = $user_uid
        RETURN count(c) > 0 as is_owner
        """
        results, _ = db.cypher_query(
            query, {"character_uid": character.uid, "user_uid": user.uid}
        )
        return results[0][0]

    @staticmethod
    def get_experience_for_level(level: int) -> int:
        """Get the experience threshold for a given level"""
        level_thresholds = [
            0,
            300,
            900,
            2700,
            6500,
            14000,
            23000,
            34000,
            48000,
            64000,
            85000,
            100000,
            120000,
            140000,
            165000,
            195000,
            225000,
            265000,
            305000,
            355000,
        ]
        if level <= 0:
            return 0
        if level >= len(level_thresholds):
            return level_thresholds[-1]
        return level_thresholds[level - 1]

    @staticmethod
    def get_character_stats(uid: str) -> Dict[str, Any]:
        character = CharacterService.get_character(uid)
        if not character:
            raise HTTPException(status_code=404, detail="Character not found")

        # Calculate base values
        ability_modifiers = character.calculate_all_modifiers()
        proficiency_bonus = int(character.calculate_proficiency_bonus())

        # Calculate saving throws with explicit type conversion
        saving_throws = {}
        for ability in [
            "strength",
            "dexterity",
            "constitution",
            "intelligence",
            "wisdom",
            "charisma",
        ]:
            save_data = character.calculate_saving_throw(ability)
            saving_throws[ability] = {
                "is_proficient": bool(save_data["is_proficient"]),
                "modifier": int(save_data["modifier"]),
                "total_bonus": int(save_data["total_bonus"]),
            }

        # Calculate skill modifiers with explicit type conversion
        skills = {}
        for skill, ability in CharacterService.skill_to_ability.items():
            skill_data = character.calculate_skill_modifier(skill, ability)
            skills[skill] = {
                "is_proficient": bool(skill_data["is_proficient"]),
                "ability": str(ability),
                "modifier": int(skill_data["modifier"]),
                "total_bonus": int(skill_data["total_bonus"]),
            }

        # Calculate experience and level
        experience = getattr(character, "experience", 0)
        level = CharacterService.calculate_level(experience)
        next_level_exp = CharacterService.get_experience_for_level(level + 1)
        experience_to_next_level = next_level_exp - experience if level < 20 else 0

        # Ensure current hit points is set
        if character.current_hit_points is None:
            character.current_hit_points = character.get_max_hit_points()
            character.save()

        return {
            # Basic Info
            "uid": character.uid,
            "name": character.name,
            "race": character.race,
            "alignment": character.alignment,
            "size": character.size,
            "description": character.description,
            "background": character.background,
            "character_class": character.character_class,
            "subclass": character.subclass,
            "image_path": character.image_path,
            # Timestamps
            "created_at": character.created_at,
            "updated_at": character.updated_at,
            "deleted_at": character.deleted_at,
            # Ability Scores and Modifiers
            "ability_scores": {
                "strength": character.strength,
                "dexterity": character.dexterity,
                "constitution": character.constitution,
                "intelligence": character.intelligence,
                "wisdom": character.wisdom,
                "charisma": character.charisma,
            },
            "ability_modifiers": ability_modifiers,
            # Skills and Saves
            "saving_throws": saving_throws,
            "skills": skills,
            "proficiency_bonus": proficiency_bonus,
            # Combat Stats
            "armor_class": character.armor_class,
            "initiative": character.calculate_initiative(),
            "speed": character.speed,
            "hit_points": character.get_max_hit_points(),
            "current_hit_points": character.current_hit_points,
            "temp_hit_points": character.temp_hit_points,
            "hit_dice": character.hit_dice,
            # Experience and Level
            "experience": experience,
            "level": level,
            "experience_to_next_level": experience_to_next_level,
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

    @staticmethod
    def get_user_characters(user: User) -> list[Character]:
        """
        Get all characters owned by a user using the OWNED_BY relationship
        """
        query = """
        MATCH (c:Character)-[:OWNED_BY]->(u:User)
        WHERE u.uid = $uid
        RETURN c
        """
        results, _ = db.cypher_query(query, {"uid": user.uid})
        characters = [Character.inflate(row[0]) for row in results]

        # Ensure all required fields are present
        for char in characters:
            if char.current_hit_points is None:
                char.current_hit_points = char.hit_points

        return characters

    @staticmethod
    def calculate_level(experience: int) -> int:
        """Calculate character level based on experience points"""
        # D&D 5e level thresholds
        level_thresholds = [
            0,
            300,
            900,
            2700,
            6500,
            14000,
            23000,
            34000,
            48000,
            64000,
            85000,
            100000,
            120000,
            140000,
            165000,
            195000,
            225000,
            265000,
            305000,
            355000,
        ]

        for level, threshold in enumerate(level_thresholds, 1):
            if experience < threshold:
                return level - 1
        return 20  # Maximum level in D&D 5e

    @staticmethod
    def get_character_with_full_stats(uid: str) -> dict:
        """Get character with full stats, including skill mappings and icon"""
        character = CharacterService.get_character(uid)
        if not character:
            raise HTTPException(status_code=404, detail="Character not found")

        # Get base stats
        stats = CharacterService.get_character_stats(uid)

        # Add character icon if it exists
        stats["icon"] = character.icon if hasattr(character, "icon") else None

        # Add basic character info
        stats.update(
            {
                "name": character.name,
                "race": character.race,
                "class_name": character.character_class,
                "level": getattr(character, "level", 1),
                "experience": getattr(character, "experience", 0),
                "background": character.background,
                "alignment": character.alignment,
            }
        )

        # No need for additional skill mappings since they're now included in get_character_stats

        return stats

    @staticmethod
    def debug_character(uid: str) -> Dict[str, Any]:
        """Debug method to check character data"""
        character = CharacterService.get_character(uid)
        if not character:
            return {"error": "Character not found"}

        try:
            stats = CharacterService.get_character_stats(uid)
            return {
                "character_exists": True,
                "basic_info": {
                    "uid": character.uid,
                    "name": character.name,
                    "character_class": character.character_class,
                },
                "stats_computed": bool(stats),
                "stats_keys": list(stats.keys()) if stats else None,
                "raw_character": character.to_dict(),
            }
        except Exception as e:
            return {
                "error": str(e),
                "character_exists": True,
                "raw_character": character.to_dict() if character else None,
            }
