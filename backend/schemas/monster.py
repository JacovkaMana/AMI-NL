from pydantic import BaseModel
from typing import Optional
from schemas.base_character import BaseCharacterBase, BaseCharacterResponse
from models.enums import Type


class MonsterCreate(BaseCharacterBase):
    monster_type: str
    challenge_rating: float
    experience_points: int


class MonsterUpdate(BaseModel):
    name: Optional[str] = None
    race: Optional[str] = None
    monster_type: Optional[str] = None
    challenge_rating: Optional[float] = None
    experience_points: Optional[int] = None
    # Include other base character fields...


class MonsterResponse(BaseCharacterResponse):
    monster_type: str
    challenge_rating: float
    experience_points: int
