from neomodel import StructuredNode, StringProperty, IntegerProperty


class Feature(StructuredNode):
    name = StringProperty(required=True)
    description = StringProperty(required=True)
    level_required = IntegerProperty(default=1)
    source = StringProperty()  # Class, Race, Background, etc.
