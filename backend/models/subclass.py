from neomodel import StructuredNode, StringProperty, RelationshipTo


class Subclass(StructuredNode):
    name = StringProperty(required=True)
    description = StringProperty(required=True)
    parent_class = RelationshipTo("CharacterClass", "BELONGS_TO")
    features = RelationshipTo("ClassFeature", "HAS_FEATURE")

    # ... existing methods ...
