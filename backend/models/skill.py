from neomodel import StructuredNode, StringProperty, BooleanProperty, RelationshipTo
from .enums import Skill as SkillEnum


class Skill(StructuredNode):
    uid = StringProperty(unique_index=True, required=True)
    name = StringProperty(max_length=50)
    proficiency = BooleanProperty(default=False)
    character = RelationshipTo("Character", "HAS_SKILL")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.name.choices = [skill.value for skill in SkillEnum]

    # ... existing methods ...
