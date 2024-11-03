from neomodel import StructuredNode, StringProperty, BooleanProperty, JSONProperty
from .enums import Ability


class Spellcasting(StructuredNode):
    spellcasting_ability = StringProperty()
    is_prepared_caster = BooleanProperty(default=True)
    spell_slots_per_level = JSONProperty()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.spellcasting_ability.choices = [ability.value for ability in Ability]

    # ... existing methods ...
