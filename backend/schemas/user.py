from pydantic import BaseModel
from backend.app.models.class_feature import Player  # Importing the Player model
from backend.app.schemas.enums import Alignment  # Importing Enums


class UserSchema(BaseModel):
    uid: str
    username: str
    email: str
    alignment: Alignment  # Added alignment field

    class Config:
        orm_mode = True


# ... additional schemas can be added here ...
