from neomodel import StructuredNode, StringProperty, IntegerProperty
from .enums import SpellSchool


class Spell(StructuredNode):
    name = StringProperty(unique_index=True, required=True)
    level = IntegerProperty(required=True)
    school = StringProperty()
    casting_time = StringProperty()
    range = StringProperty()
    duration = StringProperty()
    description = StringProperty()
    higher_levels = StringProperty()

    def pre_save(self):
        """Validate enum values before saving"""
        if self.school and self.school not in [s.value for s in SpellSchool]:
            raise ValueError(f"Invalid spell school: {self.school}")
