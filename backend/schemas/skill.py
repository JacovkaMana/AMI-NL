from pydantic import BaseModel
from typing import Optional
from models.enums import Skill as SkillEnum, Ability


class SkillBase(BaseModel):
    name: SkillEnum
    proficiency: bool = False
    ability: Ability

    class Config:
        use_enum_values = True


class SkillCreate(SkillBase):
    pass


class SkillSchema(SkillBase):
    uid: str

    class Config:
        orm_mode = True
