from neomodel import StructuredNode, StringProperty, BooleanProperty, RelationshipTo


class Skill(StructuredNode):
    uid = StringProperty(unique_index=True, required=True)
    name = StringProperty(max_length=50, required=True)
    proficiency = BooleanProperty(default=False)
    character = RelationshipTo("Character", "HAS_SKILL")

    # ... existing methods ...
