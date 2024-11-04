from neomodel import StructuredNode, StringProperty, IntegerProperty, RelationshipTo
from .enums import CharacterClass as CharacterClassEnum


class CharacterClass(StructuredNode):
    name = StringProperty(unique_index=True, required=True)
    description = StringProperty()
    hit_die = IntegerProperty()
    primary_ability = StringProperty()
    saving_throw_proficiencies = StringProperty()

    # Relationships
    features = RelationshipTo("Feature", "CLASS_FEATURE")
    subclasses = RelationshipTo("Subclass", "HAS_SUBCLASS")
    spells = RelationshipTo("Spell", "CLASS_SPELL")

    @classmethod
    def create(cls, **kwargs):
        if "name" in kwargs:
            # Validate that the name is a valid CharacterClass
            if kwargs["name"] not in [c.value for c in CharacterClassEnum]:
                raise ValueError(f"Invalid character class: {kwargs['name']}")
        return super().create(**kwargs)
