from pydantic import BaseModel
from typing import Dict, Optional
from models.enums import Race, Alignment, Size


class BaseCharacterBase(BaseModel):
    name: str
    race: str
    level: Optional[int] = 1
    experience: Optional[int] = 0
    alignment: Optional[str] = None
    size: Optional[str] = None
    description: Optional[str] = None

    # Base stats
    strength: Optional[int] = 10
    dexterity: Optional[int] = 10
    constitution: Optional[int] = 10
    intelligence: Optional[int] = 10
    wisdom: Optional[int] = 10
    charisma: Optional[int] = 10

    # Derived stats
    armor_class: Optional[int] = 10
    initiative: Optional[int] = 0
    speed: Optional[int] = 30
    hit_points: Optional[int] = 0
    temp_hit_points: Optional[int] = 0
    hit_dice: Optional[str] = "1d8"

    # Image paths
    image_path: Optional[str] = ""
    icon_path: Optional[str] = ""

    class Config:
        use_enum_values = True


class BaseCharacterResponse(BaseCharacterBase):
    uid: str
    ability_modifiers: Dict[str, int]
    proficiency_bonus: int

    class Config:
        from_attributes = True
