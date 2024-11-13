from typing import Optional, Dict, Any
from fastapi import HTTPException
from models.character import Character
from models.user import User
from neomodel import db
from datetime import datetime


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
    def get_character_stats(uid: str) -> Dict[str, Any]:
        character = CharacterService.get_character(uid)
        if not character:
            raise HTTPException(status_code=404, detail="Character not found")

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
    def get_user_characters(user):
        """
        Get all characters owned by a user using the OWNED_BY relationship
        """
        query = """
        MATCH (c:Character)-[:OWNED_BY]->(u:User)
        WHERE u.uid = $uid
        RETURN c
        """
        results, _ = db.cypher_query(query, {"uid": user.uid})
        return [Character.inflate(row[0]) for row in results]
