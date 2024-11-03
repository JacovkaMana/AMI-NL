from neomodel import StructuredNode, FloatProperty, IntegerProperty, StringProperty
from .character import Character
from .enums import Type, Size


class Monster(Character):
    challenge_rating = FloatProperty()
    experience_points = IntegerProperty()
    monster_type = StringProperty()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.monster_type.choices = [type.value for type in Type]

    # ... existing methods ...
