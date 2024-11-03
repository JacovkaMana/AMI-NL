from neomodel import StructuredNode, RelationshipTo, IntegerProperty, StringProperty
from .enums import EquipmentSlot


class InventoryItem(StructuredNode):
    character = RelationshipTo("Character", "OWNS")
    item = RelationshipTo("Item", "CONTAINS")
    quantity = IntegerProperty(default=1)
    equipped_slot = StringProperty()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.equipped_slot.choices = [slot.value for slot in EquipmentSlot]

    # ... existing methods ...
