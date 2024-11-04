from neomodel import (
    StructuredNode,
    StringProperty,
    IntegerProperty,
    JSONProperty,
    RelationshipFrom,
    RelationshipTo,
)
from .enums import Alignment, Size, Race, CharacterClass
from .spell import Spell
from .feature import Feature


class Character(StructuredNode):
    uid = StringProperty(unique_index=True)
    name = StringProperty(required=True)
    race = StringProperty(required=True)
    character_class = StringProperty(required=True)
    level = IntegerProperty(default=1)
    alignment = StringProperty()
    size = StringProperty()
    description = StringProperty()
    background = StringProperty()
    subclass = StringProperty()

    # Base stats
    strength = IntegerProperty(default=10)
    dexterity = IntegerProperty(default=10)
    constitution = IntegerProperty(default=10)
    intelligence = IntegerProperty(default=10)
    wisdom = IntegerProperty(default=10)
    charisma = IntegerProperty(default=10)

    # Derived stats
    armor_class = IntegerProperty(default=10)
    initiative = IntegerProperty(default=0)
    speed = IntegerProperty(default=30)
    hit_points = IntegerProperty(default=0)
    temp_hit_points = IntegerProperty(default=0)
    hit_dice = StringProperty(default="1d8")

    # Image paths
    image_path = StringProperty(default="")
    icon_path = StringProperty(default="")

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
    owner = RelationshipFrom("User", "OWNS_CHARACTER")
    spells = RelationshipTo("Spell", "KNOWS_SPELL")
    features = RelationshipTo("Feature", "HAS_FEATURE")

    def pre_save(self):
        """Validate enum values before saving"""
        if self.race and self.race not in [r.value for r in Race]:
            raise ValueError(f"Invalid race: {self.race}")

        if self.character_class and self.character_class not in [
            c.value for c in CharacterClass
        ]:
            raise ValueError(f"Invalid character class: {self.character_class}")

        if self.alignment and self.alignment not in [a.value for a in Alignment]:
            raise ValueError(f"Invalid alignment: {self.alignment}")

        if self.size and self.size not in [s.value for s in Size]:
            raise ValueError(f"Invalid size: {self.size}")

    def calculate_modifiers(self):
        """Calculate ability modifiers based on ability scores"""
        modifiers = {}
        for ability in [
            "strength",
            "dexterity",
            "constitution",
            "intelligence",
            "wisdom",
            "charisma",
        ]:
            score = getattr(self, ability)
            modifiers[ability] = (score - 10) // 2
        return modifiers

    def to_dict(self):
        """Convert the character node to a dictionary for API responses"""
        return {
            "uid": self.uid,
            "name": self.name,
            "race": self.race,
            "character_class": self.character_class,
            "level": self.level,
            "alignment": self.alignment,
            "size": self.size,
            "description": self.description,
            "background": self.background,
            "subclass": self.subclass,
            "strength": self.strength,
            "dexterity": self.dexterity,
            "constitution": self.constitution,
            "intelligence": self.intelligence,
            "wisdom": self.wisdom,
            "charisma": self.charisma,
            "armor_class": self.armor_class,
            "initiative": self.initiative,
            "speed": self.speed,
            "hit_points": self.hit_points,
            "temp_hit_points": self.temp_hit_points,
            "hit_dice": self.hit_dice,
            "image_path": self.image_path,
            "icon_path": self.icon_path,
            "saving_throws": self.saving_throws,
            "skills": self.skills,
        }
