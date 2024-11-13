from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime


class SkillsModel(BaseModel):
    acrobatics: bool = False
    animal_handling: bool = Field(default=False, alias="animal-handling")
    arcana: bool = False
    athletics: bool = False
    deception: bool = False
    history: bool = False
    insight: bool = False
    intimidation: bool = False
    investigation: bool = False
    medicine: bool = False
    nature: bool = False
    perception: bool = False
    performance: bool = False
    persuasion: bool = False
    religion: bool = False
    sleight_of_hand: bool = Field(default=False, alias="sleight-of-hand")
    stealth: bool = False
    survival: bool = False

    class Config:
        allow_population_by_field_name = True
        populate_by_name = True


class SavingThrowsModel(BaseModel):
    strength: bool = False
    dexterity: bool = False
    constitution: bool = False
    intelligence: bool = False
    wisdom: bool = False
    charisma: bool = False


class CharacterBase(BaseModel):
    name: str
    race: str
    alignment: str
    size: str
    description: str
    background: str
    character_class: str
    subclass: Optional[str] = ""

    # Stats
    strength: int = Field(ge=1, le=30)
    dexterity: int = Field(ge=1, le=30)
    constitution: int = Field(ge=1, le=30)
    intelligence: int = Field(ge=1, le=30)
    wisdom: int = Field(ge=1, le=30)
    charisma: int = Field(ge=1, le=30)

    # Combat stats
    armor_class: int = Field(ge=1)
    initiative: int
    speed: int = Field(ge=0)
    hit_points: int = Field(ge=1)
    temp_hit_points: int = Field(ge=0)
    hit_dice: str

    # Proficiencies
    saving_throws: SavingThrowsModel
    skills: SkillsModel

    # Optional image
    image_path: Optional[str] = None

    current_hit_points: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None


class CharacterCreate(CharacterBase):
    pass


class CharacterResponse(CharacterBase):
    uid: str


class CharacterUpdate(CharacterBase):
    pass


class SkillModifier(BaseModel):
    is_proficient: bool
    modifier: int
    total_bonus: int  # Including proficiency if proficient


class SavingThrowModifier(BaseModel):
    is_proficient: bool
    modifier: int
    total_bonus: int  # Including proficiency if proficient


class CharacterStatsResponse(BaseModel):
    # Basic Info
    uid: str
    name: str
    race: str
    alignment: str
    size: str
    description: str
    background: str
    character_class: str
    subclass: Optional[str] = ""
    image_path: Optional[str] = None

    # Timestamps
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    # Ability Scores and Modifiers
    ability_scores: Dict[str, int]
    ability_modifiers: Dict[str, int]

    # Skills and Saves
    saving_throws: Dict[str, SavingThrowModifier]
    skills: Dict[str, SkillModifier]
    proficiency_bonus: int

    # Combat Stats
    armor_class: int
    initiative: int
    speed: int
    hit_points: int
    current_hit_points: Optional[int] = None
    temp_hit_points: int
    hit_dice: str
