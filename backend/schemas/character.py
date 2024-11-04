from pydantic import BaseModel
from typing import List, Optional, Dict
from models.enums import Race, CharacterClass, Alignment, Size


class CharacterBase(BaseModel):
    name: Optional[str] = None
    race: Optional[Race] = None
    alignment: Optional[Alignment] = None
    size: Optional[Size] = None
    description: Optional[str] = None
    background: Optional[str] = None

    # Base stats
    strength: Optional[int] = None
    dexterity: Optional[int] = None
    constitution: Optional[int] = None
    intelligence: Optional[int] = None
    wisdom: Optional[int] = None
    charisma: Optional[int] = None

    # Derived stats
    armor_class: Optional[int] = None
    initiative: Optional[int] = None
    speed: Optional[int] = None
    hit_points: Optional[int] = None
    temp_hit_points: Optional[int] = None
    hit_dice: Optional[str] = None

    # Proficiencies
    saving_throws: Optional[Dict[str, bool]] = None
    skills: Optional[Dict[str, bool]] = None

    class Config:
        use_enum_values = True


class CharacterCreate(CharacterBase):
    name: str
    race: Race
    character_class: CharacterClass
    subclass: Optional[str] = None
    alignment: Alignment
    size: Size

    # Required base stats
    strength: int
    dexterity: int
    constitution: int
    intelligence: int
    wisdom: int
    charisma: int


class CharacterUpdate(CharacterBase):
    character_class: Optional[CharacterClass] = None
    subclass: Optional[str] = None
    level: Optional[int] = None


class CharacterSchema(CharacterBase):
    uid: str
    name: str
    race: Race
    level: int
    alignment: Alignment
    size: Size

    # All stats are included from CharacterBase
    # Additional fields
    image_path: Optional[str]
    icon_path: Optional[str]

    # Include modifiers in response
    ability_modifiers: Dict[str, int]

    class Config:
        orm_mode = True


class CharacterStatsResponse(BaseModel):
    base_stats: Dict[str, int]
    modifiers: Dict[str, int]
    derived_stats: Dict[str, int]
    saving_throws: Dict[str, bool]
    skills: Dict[str, bool]

    class Config:
        orm_mode = True
