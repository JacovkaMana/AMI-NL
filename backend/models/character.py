from neomodel import (
    StructuredNode,
    StringProperty,
    IntegerProperty,
    JSONProperty,
    RelationshipTo,
    UniqueIdProperty,
    RelationshipFrom,
)
from models.user import User


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

    def calculate_proficiency_bonus(self):
        # Implement proficiency bonus calculation based on level
        return 2  # Default for level 1

    def calculate_all_modifiers(self):
        return {
            "strength": (self.strength - 10) // 2,
            "dexterity": (self.dexterity - 10) // 2,
            "constitution": (self.constitution - 10) // 2,
            "intelligence": (self.intelligence - 10) // 2,
            "wisdom": (self.wisdom - 10) // 2,
            "charisma": (self.charisma - 10) // 2,
        }

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
        }
