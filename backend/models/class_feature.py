from neomodel import StructuredNode, StringProperty, IntegerProperty
from .enums import CharacterClass


class ClassFeature(StructuredNode):
    name = StringProperty(required=True)
    description = StringProperty(required=True)
    level_gained = IntegerProperty(required=True)
    class_name = StringProperty()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.class_name.choices = [char_class.value for char_class in CharacterClass]

    # ... existing methods ...
