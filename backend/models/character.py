from neomodel import (
    StructuredNode,
    StringProperty,
    IntegerProperty,
    JSONProperty,
    RelationshipTo,
    UniqueIdProperty,
    RelationshipFrom,
    DateTimeProperty,
)
from models.user import User
from datetime import datetime


class Character(StructuredNode):
    uid = UniqueIdProperty()
    name = StringProperty(required=True)
    race = StringProperty(required=True)
    alignment = StringProperty(required=True)
    size = StringProperty(required=True)
    description = StringProperty(required=True)
    background = StringProperty(required=True)
    character_class = StringProperty(required=True)
    subclass = StringProperty(default="")

    # Stats
    strength = IntegerProperty(required=True)
    dexterity = IntegerProperty(required=True)
    constitution = IntegerProperty(required=True)
    intelligence = IntegerProperty(required=True)
    wisdom = IntegerProperty(required=True)
    charisma = IntegerProperty(required=True)

    # Combat stats
    armor_class = IntegerProperty(required=True)
    initiative = IntegerProperty(required=True)
    speed = IntegerProperty(required=True)
    hit_points = IntegerProperty(required=True)
    temp_hit_points = IntegerProperty(default=0)
    hit_dice = StringProperty(required=True)

    # Proficiencies stored as JSON
    saving_throws = JSONProperty(required=True)
    skills = JSONProperty(required=True)

    # Image
    image_path = StringProperty()

    # Relationships
    owner = RelationshipFrom(User, "OWNED_BY")

    # Additional fields
    current_hit_points = IntegerProperty()
    created_at = DateTimeProperty(default=datetime.utcnow)
    updated_at = DateTimeProperty(default=datetime.utcnow)
    deleted_at = DateTimeProperty(default=None)

    def calculate_proficiency_bonus(self) -> int:
        """Calculate proficiency bonus based on character level"""
        level = getattr(self, "level", 1)
        return 2 + ((level - 1) // 4)

    def calculate_ability_modifier(self, ability_score: int) -> int:
        """Calculate ability modifier from ability score"""
        return (ability_score - 10) // 2

    def calculate_all_modifiers(self) -> dict:
        """Calculate all ability score modifiers"""
        return {
            "strength": self.calculate_ability_modifier(self.strength),
            "dexterity": self.calculate_ability_modifier(self.dexterity),
            "constitution": self.calculate_ability_modifier(self.constitution),
            "intelligence": self.calculate_ability_modifier(self.intelligence),
            "wisdom": self.calculate_ability_modifier(self.wisdom),
            "charisma": self.calculate_ability_modifier(self.charisma),
        }

    def calculate_saving_throw(self, ability: str) -> dict:
        """Calculate saving throw bonus for a specific ability"""
        base_modifier = int(self.calculate_ability_modifier(getattr(self, ability)))
        is_proficient = bool(self.saving_throws.get(ability, False))
        proficiency_bonus = (
            int(self.calculate_proficiency_bonus()) if is_proficient else 0
        )

        return {
            "is_proficient": is_proficient,
            "modifier": base_modifier,
            "total_bonus": base_modifier + proficiency_bonus,
        }

    def calculate_skill_modifier(self, skill: str, ability: str) -> dict:
        """Calculate skill modifier including proficiency if applicable"""
        base_modifier = int(self.calculate_ability_modifier(getattr(self, ability)))
        is_proficient = bool(self.skills.get(skill, False))
        proficiency_bonus = (
            int(self.calculate_proficiency_bonus()) if is_proficient else 0
        )

        return {
            "is_proficient": is_proficient,
            "ability": str(ability),
            "modifier": base_modifier,
            "total_bonus": base_modifier + proficiency_bonus,
        }

    def calculate_initiative(self) -> int:
        """Calculate initiative bonus"""
        return self.calculate_ability_modifier(self.dexterity)

    def get_max_hit_points(self) -> int:
        """Calculate maximum hit points"""
        constitution_modifier = self.calculate_ability_modifier(self.constitution)
        level = getattr(self, "level", 1)
        return self.hit_points + (constitution_modifier * level)

    def to_dict(self):
        return {
            "uid": self.uid,
            "name": self.name,
            "race": self.race,
            "alignment": self.alignment,
            "size": self.size,
            "description": self.description,
            "background": self.background,
            "character_class": self.character_class,
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
            "saving_throws": self.saving_throws,
            "skills": self.skills,
            "image_path": self.image_path,
            "current_hit_points": self.current_hit_points,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "deleted_at": self.deleted_at,
        }
