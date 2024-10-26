from neomodel import StructuredNode, StringProperty, BooleanProperty, JSONProperty


class Spellcasting(StructuredNode):
    spellcasting_ability = StringProperty(required=True)
    is_prepared_caster = BooleanProperty(default=True)
    spell_slots_per_level = JSONProperty()

    # ... existing methods ...
