from neomodel import StructuredNode, StringProperty, IntegerProperty


class ClassFeature(StructuredNode):
    name = StringProperty(required=True)
    description = StringProperty(required=True)
    level_gained = IntegerProperty(required=True)

    # ... existing methods ...
