from pydantic import BaseModel
from typing import Optional, Dict


class CharacterBase(BaseModel):
    name: str
    race: str
    character_class: str
    level: int = 1
    alignment: Optional[str] = None
    size: Optional[str] = None
    description: Optional[str] = None
    background: Optional[str] = None
    subclass: Optional[str] = None

    # Base stats
    strength: int = 10
    dexterity: int = 10
    constitution: int = 10
    intelligence: int = 10
    wisdom: int = 10
    charisma: int = 10

    # Derived stats
    armor_class: int = 10
    initiative: int = 0
    speed: int = 30
    hit_points: int = 0
    temp_hit_points: int = 0
    hit_dice: str = "1d8"

    # Optional JSON fields
    saving_throws: Optional[Dict[str, bool]] = None
    skills: Optional[Dict[str, bool]] = None


class CharacterCreate(CharacterBase):
    pass


class CharacterUpdate(CharacterBase):
    pass


class CharacterSchema(CharacterBase):
    uid: str
    image_path: Optional[str] = None
    icon_path: Optional[str] = None

    class Config:
        from_attributes = True


class CharacterStatsResponse(BaseModel):
    ability_scores: Dict[str, int]
    modifiers: Dict[str, int]
    armor_class: int
    initiative: int
    speed: int
    hit_points: int
    temp_hit_points: int
    saving_throws: Dict[str, bool]
    skills: Dict[str, bool]

    class Config:
        from_attributes = True
