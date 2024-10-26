from neomodel import StructuredNode, RelationshipTo, IntegerProperty


class InventoryItem(StructuredNode):
    character = RelationshipTo("Character", "OWNS")
    item = RelationshipTo("Item", "CONTAINS")
    quantity = IntegerProperty(default=1)

    # ... existing methods ...
