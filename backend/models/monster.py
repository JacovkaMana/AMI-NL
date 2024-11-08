from models.base_character import BaseCharacter
from neomodel import FloatProperty, IntegerProperty, StringProperty
from models.enums import Type


class Monster(BaseCharacter):
    challenge_rating = FloatProperty()
    experience_points = IntegerProperty()
    monster_type = StringProperty()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.monster_type.choices = [type.value for type in Type]

    def pre_save(self):
        """Validate enum values before saving"""
        super().pre_save()  # Call parent's validation first

        if self.monster_type and self.monster_type not in [t.value for t in Type]:
            raise ValueError(f"Invalid monster type: {self.monster_type}")

    def to_dict(self):
        """Convert the monster node to a dictionary"""
        base_dict = super().to_dict()
        monster_dict = {
            "challenge_rating": self.challenge_rating,
            "experience_points": self.experience_points,
            "monster_type": self.monster_type,
        }
        return {**base_dict, **monster_dict}
