from neomodel import (
    StructuredNode,
    StringProperty,
    IntegerProperty,
    RelationshipTo,
    ArrayProperty,
    JSONProperty,
)


class CharacterDetails(StructuredNode):
    # Basic Info
    name = StringProperty(required=True)
    character_class = StringProperty(required=True)
    race = StringProperty(required=True)
    background = StringProperty(required=True)
    level = IntegerProperty(default=1)
    experience = IntegerProperty(default=0)
    alignment = StringProperty()
    image_url = StringProperty()

    # Attributes
    strength = IntegerProperty(default=10)
    dexterity = IntegerProperty(default=10)
    constitution = IntegerProperty(default=10)
    intelligence = IntegerProperty(default=10)
    wisdom = IntegerProperty(default=10)
    charisma = IntegerProperty(default=10)

    # Combat Stats
    armor_class = IntegerProperty(default=10)
    initiative = IntegerProperty(default=0)
    hit_points = IntegerProperty(default=0)
    max_hit_points = IntegerProperty(default=0)
    speed = IntegerProperty(default=30)

    # Skills and Abilities
    proficiencies = ArrayProperty(StringProperty(), default=[])
    abilities = ArrayProperty(StringProperty(), default=[])
    saving_throws = ArrayProperty(StringProperty(), default=[])
    skills = JSONProperty(default={})

    # Equipment and Inventory
    equipment = ArrayProperty(StringProperty(), default=[])
    weapons = ArrayProperty(StringProperty(), default=[])
    armor = ArrayProperty(StringProperty(), default=[])

    # Spellcasting
    spellcasting_ability = StringProperty()
    spells_known = ArrayProperty(StringProperty(), default=[])
    spell_slots = JSONProperty(default={})
