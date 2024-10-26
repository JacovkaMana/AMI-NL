from fastapi import FastAPI
from backend.app.services.character_service import CharacterService
from backend.app.services.user_service import UserService
from backend.app.schemas.character import CharacterSchema
from backend.app.schemas.user import UserSchema

app = FastAPI()


@app.post("/characters/", response_model=CharacterSchema)
def create_character(character_data: CharacterSchema):
    return CharacterService.create_character(character_data)


@app.get("/characters/{uid}", response_model=CharacterSchema)
def get_character(uid: str):
    return CharacterService.get_character(uid)


@app.post("/users/", response_model=UserSchema)
def create_user(user_data: UserSchema):
    return UserService.create_user(user_data)


@app.get("/users/{uid}", response_model=UserSchema)
def get_user(uid: str):
    return UserService.get_user(uid)


# ... additional routes can be added here ...
