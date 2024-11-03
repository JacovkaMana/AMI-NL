from neomodel import StructuredNode, StringProperty, IntegerProperty, RelationshipTo
from .enums import Alignment, Size, Race, CharacterClass


class Character(StructuredNode):
    name = StringProperty(required=True)
    race = StringProperty()
    character_class = RelationshipTo("CharacterClass", "BELONGS_TO")
    level = IntegerProperty(default=1)
    alignment = StringProperty()
    size = StringProperty()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.alignment.choices = [alignment.value for alignment in Alignment]
        self.size.choices = [size.value for size in Size]
        self.race.choices = [race.value for race in Race]

    # ... existing methods ...
