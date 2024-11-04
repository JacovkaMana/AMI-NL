from typing import Optional
from models.character import Character
from models.character_class import CharacterClass
from models.spell import Spell
from models.feature import Feature
from schemas.character import (
    CharacterCreate,
    CharacterUpdate,
    CharacterSchema,
    CharacterStatsResponse,
)
from fastapi import HTTPException, status


class CharacterService:
    @staticmethod
    def create_character(character_data: CharacterCreate, user):
        # Validate character class
        character_class = CharacterClass.nodes.first_or_none(
            name=character_data.character_class
        )
        if not character_class:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Character class {character_data.character_class} not found",
            )

        # Create character with all stats
        character = Character(
            name=character_data.name,
            race=character_data.race,
            alignment=character_data.alignment,
            size=character_data.size,
            description=character_data.description,
            background=character_data.background,
            # Base stats
            strength=character_data.strength,
            dexterity=character_data.dexterity,
            constitution=character_data.constitution,
            intelligence=character_data.intelligence,
            wisdom=character_data.wisdom,
            charisma=character_data.charisma,
        ).save()

        # Set relationships
        character.owner.connect(user)
        character.character_class.connect(character_class)

        # Add subclass if specified
        if character_data.subclass:
            subclass = character_class.subclasses.get_or_none(
                name=character_data.subclass
            )
            if subclass:
                character.subclass.connect(subclass)

        # Add starting features
        class_features = character_class.features.filter(level_required=1)
        for feature in class_features:
            character.features.connect(feature)

        # Calculate derived stats
        character.calculate_armor_class()
        character.calculate_hit_points()

        return character

    @staticmethod
    def get_character_stats(uid: str) -> CharacterStatsResponse:
        character = Character.nodes.first_or_none(uid=uid)
        if not character:
            raise HTTPException(status_code=404, detail="Character not found")

        modifiers = character.calculate_modifiers()

        base_stats = {
            "strength": character.strength,
            "dexterity": character.dexterity,
            "constitution": character.constitution,
            "intelligence": character.intelligence,
            "wisdom": character.wisdom,
            "charisma": character.charisma,
        }

        derived_stats = {
            "armor_class": character.armor_class,
            "initiative": character.initiative,
            "speed": character.speed,
            "hit_points": character.hit_points,
            "temp_hit_points": character.temp_hit_points,
        }

        return CharacterStatsResponse(
            base_stats=base_stats,
            modifiers=modifiers,
            derived_stats=derived_stats,
            saving_throws=character.saving_throws,
            skills=character.skills,
        )

    @staticmethod
    def update_character_stats(uid: str, stats_data: dict) -> Character:
        character = Character.nodes.first_or_none(uid=uid)
        if not character:
            raise HTTPException(status_code=404, detail="Character not found")

        # Update base stats
        for stat in [
            "strength",
            "dexterity",
            "constitution",
            "intelligence",
            "wisdom",
            "charisma",
        ]:
            if stat in stats_data:
                setattr(character, stat, stats_data[stat])

        # Update proficiencies
        if "saving_throws" in stats_data:
            character.saving_throws.update(stats_data["saving_throws"])

        if "skills" in stats_data:
            character.skills.update(stats_data["skills"])

        # Recalculate derived stats
        character.calculate_armor_class()
        character.calculate_hit_points()

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

        # Update ability scores if provided
        if character_data.ability_scores:
            for ability, score in character_data.ability_scores.items():
                setattr(character, ability, score)

        # Update other fields
        update_data = character_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            if key != "ability_scores":  # Already handled above
                setattr(character, key, value)

        # Recalculate derived stats
        character.calculate_armor_class()
        character.calculate_hit_points()

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

    @staticmethod
    def add_spell(character_id: str, spell_name: str):
        character = Character.nodes.first_or_none(uid=character_id)
        if not character:
            raise HTTPException(status_code=404, detail="Character not found")

        spell = Spell.nodes.first_or_none(name=spell_name)
        if not spell:
            raise HTTPException(status_code=404, detail="Spell not found")

        character.spells.connect(spell)
        return character

    @staticmethod
    def add_feature(character_id: str, feature_name: str):
        character = Character.nodes.first_or_none(uid=character_id)
        if not character:
            raise HTTPException(status_code=404, detail="Character not found")

        feature = Feature.nodes.first_or_none(name=feature_name)
        if not feature:
            raise HTTPException(status_code=404, detail="Feature not found")

        character.features.connect(feature)
        return character
