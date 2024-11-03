from pydantic import BaseModel
from typing import Dict, Optional
from models.enums import Ability, SpellSchool


class SpellcastingBase(BaseModel):
    spellcasting_ability: Ability
    is_prepared_caster: bool = True
    spell_slots_per_level: Dict[int, int]

    class Config:
        use_enum_values = True


class SpellcastingCreate(SpellcastingBase):
    pass


class SpellcastingSchema(SpellcastingBase):
    class Config:
        orm_mode = True
