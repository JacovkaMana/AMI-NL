from neomodel import (
    StructuredNode,
    StringProperty,
    IntegerProperty,
    RelationshipTo,
    RelationshipFrom,
    JSONProperty,
)
from pathlib import Path
import os
import shutil
from .enums import Alignment, Size, Race, Ability


class Character(StructuredNode):
    uid = StringProperty(unique_index=True)
    name = StringProperty(required=True)
    race = StringProperty()
    level = IntegerProperty(default=1)
    alignment = StringProperty()
    size = StringProperty()
    image_path = StringProperty(default="")
    icon_path = StringProperty(default="")
    description = StringProperty()
    background = StringProperty()

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
    owner = RelationshipFrom(".user.User", "OWNS_CHARACTER")
    character_class = RelationshipTo(".character_class.CharacterClass", "HAS_CLASS")
    subclass = RelationshipTo(".subclass.Subclass", "HAS_SUBCLASS")
    spells = RelationshipTo(".spell.Spell", "KNOWS_SPELL")
    items = RelationshipTo(".item.Item", "OWNS_ITEM")
    features = RelationshipTo(".feature.Feature", "HAS_FEATURE")

    @classmethod
    def create(cls, **kwargs):
        # Validate enum values before creation
        if "alignment" in kwargs:
            if kwargs["alignment"] not in [a.value for a in Alignment]:
                raise ValueError(f"Invalid alignment: {kwargs['alignment']}")

        if "size" in kwargs:
            if kwargs["size"] not in [s.value for s in Size]:
                raise ValueError(f"Invalid size: {kwargs['size']}")

        if "race" in kwargs:
            if kwargs["race"] not in [r.value for r in Race]:
                raise ValueError(f"Invalid race: {kwargs['race']}")

        return super().create(**kwargs)

    def update_images(self, image_file=None, icon_file=None):
        media_dir = Path("media/characters")
        media_dir.mkdir(parents=True, exist_ok=True)

        if image_file:
            # Remove old image if exists
            if self.image_path and os.path.exists(self.image_path):
                os.remove(self.image_path)

            # Save new image
            file_extension = image_file.filename.split(".")[-1]
            image_path = f"media/characters/{self.uid}_full.{file_extension}"

            with open(image_path, "wb") as buffer:
                shutil.copyfileobj(image_file.file, buffer)

            self.image_path = image_path

        if icon_file:
            # Remove old icon if exists
            if self.icon_path and os.path.exists(self.icon_path):
                os.remove(self.icon_path)

            # Save new icon
            file_extension = icon_file.filename.split(".")[-1]
            icon_path = f"media/characters/{self.uid}_icon.{file_extension}"

            with open(icon_path, "wb") as buffer:
                shutil.copyfileobj(icon_file.file, buffer)

            self.icon_path = icon_path

        self.save()
        return self

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

    def calculate_armor_class(self):
        """Calculate AC based on equipment and dexterity"""
        base_ac = 10
        dex_modifier = (self.dexterity - 10) // 2
        # TODO: Add armor calculation when equipment system is implemented
        self.armor_class = base_ac + dex_modifier
        self.save()
        return self.armor_class

    def calculate_hit_points(self):
        """Calculate max HP based on level, class, and constitution"""
        constitution_modifier = (self.constitution - 10) // 2
        if not self.character_class.single():
            return 0

        char_class = self.character_class.single()
        hit_die = char_class.hit_die

        # First level: maximum hit die + CON modifier
        max_hp = hit_die + constitution_modifier

        # Additional levels: average hit die + CON modifier
        if self.level > 1:
            average_hp_per_level = (hit_die + 1) // 2 + constitution_modifier
            max_hp += average_hp_per_level * (self.level - 1)

        self.hit_points = max_hp
        self.save()
        return max_hp

    # ... existing methods ...
