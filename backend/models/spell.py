from neomodel import StructuredNode, StringProperty, IntegerProperty, ArrayProperty
from .enums import SpellSchool


class Spell(StructuredNode):
    name = StringProperty(unique_index=True, required=True)
    level = IntegerProperty(required=True)
    school = StringProperty()
    casting_time = StringProperty()
    range = StringProperty()
    components = ArrayProperty()
    duration = StringProperty()
    description = StringProperty()
    higher_levels = StringProperty()

    @classmethod
    def create(cls, **kwargs):
        if "school" in kwargs:
            if kwargs["school"] not in [s.value for s in SpellSchool]:
                raise ValueError(f"Invalid spell school: {kwargs['school']}")
        return super().create(**kwargs)
