from pydantic import BaseModel, EmailStr
from typing import Optional
from models.enums import Alignment


class UserBase(BaseModel):
    username: str
    email: EmailStr
    alignment: Optional[Alignment] = None

    class Config:
        use_enum_values = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    alignment: Optional[Alignment] = None
    password: Optional[str] = None

    class Config:
        use_enum_values = True


class UserSchema(UserBase):
    uid: str

    class Config:
        orm_mode = True


# ... additional schemas can be added here ...
