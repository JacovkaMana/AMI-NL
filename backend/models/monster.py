from neomodel import StructuredNode, FloatProperty, IntegerProperty
from .character import Character


class Monster(Character):
    challenge_rating = FloatProperty()
    experience_points = IntegerProperty()

    # ... existing methods ...
