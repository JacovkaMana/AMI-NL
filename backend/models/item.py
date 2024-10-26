from neomodel import StructuredNode, StringProperty, FloatProperty, RelationshipTo


class Item(StructuredNode):
    uid = StringProperty(unique_index=True, required=True)
    name = StringProperty(max_length=50, required=True)
    description = StringProperty(max_length=200)
    cost = StringProperty()
    item_type = StringProperty()
    weight = FloatProperty()
    rarity = StringProperty()
    effects = RelationshipTo("Effect", "HAS_EFFECT")

    # ... existing methods ...
