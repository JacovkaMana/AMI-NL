from pydantic import BaseModel
from typing import Optional, List
from models.enums import Rarity, WeaponType, ArmorType


class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    cost: Optional[str] = None
    weight: Optional[float] = None
    rarity: Rarity
    item_type: Optional[str] = None

    class Config:
        use_enum_values = True


class WeaponSchema(ItemBase):
    weapon_type: WeaponType
    damage: str
    damage_type: str


class ArmorSchema(ItemBase):
    armor_type: ArmorType
    armor_class: int
    strength_requirement: Optional[int] = None
    stealth_disadvantage: bool = False


class ItemCreate(ItemBase):
    pass


class ItemSchema(ItemBase):
    uid: str

    class Config:
        orm_mode = True
