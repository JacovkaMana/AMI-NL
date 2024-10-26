from pydantic import BaseModel
from backend.app.models.character import Character  # Importing the Character model
from backend.app.schemas.enums import EquipmentSlot  # Importing Enums


class CharacterSchema(BaseModel):
    uid: str
    name: str
    level: int
    equipment_slots: list[EquipmentSlot]  # Added equipment slots

    class Config:
        orm_mode = True


# ... additional schemas can be added here ...
