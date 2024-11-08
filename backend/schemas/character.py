from pydantic import BaseModel
from typing import Dict, Optional, List
from schemas.base_character import BaseCharacterBase, BaseCharacterResponse


class CharacterCreate(BaseCharacterBase):
    race: str
    character_class: str
    background: Optional[str] = None
    subclass: Optional[str] = None


class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[int] = None
    experience: Optional[int] = None
    race: Optional[str] = None
    character_class: Optional[str] = None
    alignment: Optional[str] = None
    size: Optional[str] = None
    description: Optional[str] = None
    background: Optional[str] = None
    subclass: Optional[str] = None

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


class CharacterResponse(BaseCharacterResponse):
    race: str
    character_class: str
    background: Optional[str] = None
    subclass: Optional[str] = None
    saving_throws: Dict[str, bool]
    skills: Dict[str, bool]


class CharacterStatsResponse(BaseModel):
    ability_scores: Dict[str, int]
    ability_modifiers: Dict[str, int]
    saving_throws: Dict[str, bool]
    skills: Dict[str, bool]
    proficiency_bonus: int
    armor_class: int
    initiative: int
    speed: int
    hit_points: int
    temp_hit_points: int
    hit_dice: str
