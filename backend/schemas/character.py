from pydantic import BaseModel
from typing import List, Optional
from models.enums import Race, CharacterClass, Alignment, Size, EquipmentSlot


class CharacterSchema(BaseModel):
    uid: str
    name: str
    race: Race
    level: int = 1
    alignment: Alignment
    size: Size
    equipment_slots: List[EquipmentSlot] = []
    character_class: Optional[CharacterClass] = None

    class Config:
        orm_mode = True
        use_enum_values = True  # This will serialize enums to their values


class CharacterCreate(BaseModel):
    name: str
    race: Race
    alignment: Alignment
    size: Size
    character_class: Optional[CharacterClass] = None

    class Config:
        use_enum_values = True


class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    race: Optional[Race] = None
    level: Optional[int] = None
    alignment: Optional[Alignment] = None
    size: Optional[Size] = None
    character_class: Optional[CharacterClass] = None

    class Config:
        use_enum_values = True
