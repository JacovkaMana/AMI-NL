from neomodel import (
    StructuredNode,
    StringProperty,
    IntegerProperty,
    JSONProperty,
    UniqueIdProperty,
)
from models.enums import Alignment, Size, Race


class BaseCharacter(StructuredNode):
    uid = UniqueIdProperty()
    name = StringProperty(required=True)
    race = StringProperty(required=True)
    level = IntegerProperty(default=1)
    experience = IntegerProperty(default=0)
    alignment = StringProperty()
    size = StringProperty()
    description = StringProperty()

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

    def calculate_ability_modifier(self, ability_score):
        """Calculate ability modifier from ability score"""
        return (ability_score - 10) // 2

    def calculate_all_modifiers(self):
        """Calculate all ability modifiers"""
        abilities = [
            "strength",
            "dexterity",
            "constitution",
            "intelligence",
            "wisdom",
            "charisma",
        ]
        return {
            ability: self.calculate_ability_modifier(getattr(self, ability))
            for ability in abilities
        }

    def add_experience(self, xp_amount):
        """Add experience points and check for level up"""
        self.experience += xp_amount
        new_level = self.calculate_level_from_xp()

        if new_level > self.level:
            self.level = new_level
            self.on_level_up()

        self.save()
        return new_level > self.level

    def calculate_level_from_xp(self):
        """Calculate level based on XP thresholds"""
        xp_thresholds = [
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

        for level, threshold in enumerate(xp_thresholds, start=1):
            if self.experience < threshold:
                return level - 1
        return 20

    def on_level_up(self):
        """Hook method for level up actions"""
        pass

    def calculate_proficiency_bonus(self):
        """Calculate proficiency bonus based on level"""
        return (self.level - 1) // 4 + 2

    def pre_save(self):
        """Validate enum values before saving"""
        if self.race and self.race not in [r.value for r in Race]:
            raise ValueError(f"Invalid race: {self.race}")

        if self.alignment and self.alignment not in [a.value for a in Alignment]:
            raise ValueError(f"Invalid alignment: {self.alignment}")

        if self.size and self.size not in [s.value for s in Size]:
            raise ValueError(f"Invalid size: {self.size}")

    def to_dict(self):
        """Convert the character node to a dictionary"""
        return {
            "uid": self.uid,
            "name": self.name,
            "race": self.race,
            "level": self.level,
            "experience": self.experience,
            "alignment": self.alignment,
            "size": self.size,
            "description": self.description,
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
            "ability_modifiers": self.calculate_all_modifiers(),
            "proficiency_bonus": self.calculate_proficiency_bonus(),
        }
