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

            # Set current_hit_points equal to hit_points if not provided
            if (
                "hit_points" in character_data
                and "current_hit_points" not in character_data
            ):
                character_data["current_hit_points"] = character_data["hit_points"]

            # Create character instance
            character = Character(**character_data)
            character.save()

            # Create the OWNED_BY relationship from character to user
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

        # Initialize experience if not present
        if not hasattr(character, "experience"):
            character.experience = 0
            character.save()

        # Get experience value (defaulting to 0 if somehow still None)
        experience = getattr(character, "experience", 0) or 0

        # Calculate level based on experience
        level = CharacterService.calculate_level(experience)

        # Calculate experience needed for next level
        next_level_exp = CharacterService.get_experience_for_level(level + 1)
        experience_to_next_level = next_level_exp - experience if level < 20 else 0

        # Set current_hit_points to hit_points if it's None
        if character.current_hit_points is None:
            character.current_hit_points = character.hit_points
            character.save()

        proficiency_bonus = character.calculate_proficiency_bonus()
        ability_modifiers = character.calculate_all_modifiers()

        # Calculate saving throw modifiers
        saving_throws = {}
        for ability, is_proficient in character.saving_throws.items():
            base_modifier = ability_modifiers[ability]
            saving_throws[ability] = {
                "is_proficient": is_proficient,
                "modifier": base_modifier,
                "total_bonus": base_modifier
                + (proficiency_bonus if is_proficient else 0),
            }

        # Calculate skill modifiers using the class-level mapping
        skills = {}
        for skill, is_proficient in character.skills.items():
            ability = CharacterService.skill_to_ability[
                skill
            ]  # Use class-level mapping
            base_modifier = ability_modifiers[ability]
            skills[skill] = {
                "is_proficient": is_proficient,
                "modifier": base_modifier,
                "total_bonus": base_modifier
                + (proficiency_bonus if is_proficient else 0),
            }

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
            "initiative": character.initiative,
            "speed": character.speed,
            "hit_points": character.hit_points,
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
