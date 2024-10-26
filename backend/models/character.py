from neomodel import StructuredNode, StringProperty, IntegerProperty, RelationshipTo
from .class_feature import ClassFeature
from .subclass import Subclass
from .enums import Alignment, Size


class Character(StructuredNode):
    name = StringProperty(required=True)
    race = StringProperty(required=True)
    character_class = RelationshipTo("CharacterClass", "BELONGS_TO")
    level = IntegerProperty(default=1)
    alignment = StringProperty(choices=[alignment.value for alignment in Alignment])
    size = StringProperty(choices=[size.value for size in Size])

    # ... existing methods ...
