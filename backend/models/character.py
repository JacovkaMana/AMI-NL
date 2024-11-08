from models.base_character import BaseCharacter
from neomodel import (
    StringProperty,
    JSONProperty,
    RelationshipFrom,
    RelationshipTo,
)
from models.enums import CharacterClass


class Character(BaseCharacter):
    character_class = StringProperty(required=True)
    background = StringProperty()
    subclass = StringProperty()

    # JSON Properties
    saving_throws = JSONProperty(
        default={
            "strength": False,
            "dexterity": False,
            "constitution": False,
            "intelligence": False,
            "wisdom": False,
            "charisma": False,
        }
    )

    skills = JSONProperty(
        default={
            "acrobatics": False,
            "animal_handling": False,
            "arcana": False,
            "athletics": False,
            "deception": False,
            "history": False,
            "insight": False,
            "intimidation": False,
            "investigation": False,
            "medicine": False,
            "nature": False,
            "perception": False,
            "performance": False,
            "persuasion": False,
            "religion": False,
            "sleight_of_hand": False,
            "stealth": False,
            "survival": False,
        }
    )

    # Relationships
    owner = RelationshipFrom("models.user.User", "OWNS_CHARACTER")
    spells = RelationshipTo("Spell", "KNOWS_SPELL")
    features = RelationshipTo("Feature", "HAS_FEATURE")

    def pre_save(self):
        """Validate enum values before saving"""
        super().pre_save()  # Call parent's validation first

        if self.character_class and self.character_class not in [
            c.value for c in CharacterClass
        ]:
            raise ValueError(f"Invalid character class: {self.character_class}")

    def on_level_up(self):
        """Handle character-specific level up logic"""
        # Add class features, spells, etc. based on new level
        pass

    def to_dict(self):
        """Convert the character node to a dictionary for API responses"""
        base_dict = super().to_dict()
        character_dict = {
            "character_class": self.character_class,
            "background": self.background,
            "subclass": self.subclass,
            "saving_throws": self.saving_throws,
            "skills": self.skills,
        }
        return {**base_dict, **character_dict}
