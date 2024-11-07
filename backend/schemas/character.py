from pydantic import BaseModel, Field
from typing import Optional, Dict
from enum import Enum


class CharacterBase(BaseModel):
    name: str
    race: str
    character_class: str
    level: int = Field(default=1, ge=1, le=20)
    alignment: Optional[str] = None
    size: Optional[str] = None
    description: Optional[str] = None
    background: Optional[str] = None
    subclass: Optional[str] = None

    # Base stats
    strength: int = Field(default=10, ge=1, le=30)
    dexterity: int = Field(default=10, ge=1, le=30)
    constitution: int = Field(default=10, ge=1, le=30)
    intelligence: int = Field(default=10, ge=1, le=30)
    wisdom: int = Field(default=10, ge=1, le=30)
    charisma: int = Field(default=10, ge=1, le=30)

    # Derived stats
    armor_class: int = Field(default=10, ge=1)
    initiative: int = Field(default=0)
    speed: int = Field(default=30, ge=0)
    hit_points: int = Field(default=0, ge=0)
    temp_hit_points: int = Field(default=0, ge=0)
    hit_dice: str = "1d8"

    # Optional fields
    image_path: Optional[str] = None
    icon_path: Optional[str] = None
    saving_throws: Dict[str, bool] = {}
    skills: Dict[str, bool] = {}


class CharacterCreate(CharacterBase):
    pass


class CharacterUpdate(CharacterBase):
    name: Optional[str] = None
    race: Optional[str] = None
    character_class: Optional[str] = None


class CharacterSchema(CharacterBase):
    uid: str

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
