from fastapi import APIRouter, HTTPException, status
from services.character_service import CharacterService
from services.user_service import UserService
from schemas.character import CharacterSchema, CharacterCreate, CharacterUpdate
from schemas.user import UserSchema, UserCreate, UserUpdate
from .auth import router as auth_router

router = APIRouter()

# Include the auth router
router.include_router(auth_router, prefix="/auth", tags=["Authentication"])


# Character endpoints
@router.post(
    "/characters/", response_model=CharacterSchema, status_code=status.HTTP_201_CREATED
)
def create_character(character_data: CharacterCreate):
    return CharacterService.create_character(character_data)


@router.get("/characters/{uid}", response_model=CharacterSchema)
def get_character(uid: str):
    character = CharacterService.get_character(uid)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character


@router.put("/characters/{uid}", response_model=CharacterSchema)
def update_character(uid: str, character_data: CharacterUpdate):
    character = CharacterService.update_character(uid, character_data)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character


@router.delete("/characters/{uid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_character(uid: str):
    if not CharacterService.delete_character(uid):
        raise HTTPException(status_code=404, detail="Character not found")


@router.get("/characters/", response_model=list[CharacterSchema])
def list_characters():
    return CharacterService.list_characters()


# User endpoints
@router.post("/users/", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreate):
    return UserService.create_user(user_data)


@router.get("/users/{uid}", response_model=UserSchema)
def get_user(uid: str):
    user = UserService.get_user(uid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/users/{uid}", response_model=UserSchema)
def update_user(uid: str, user_data: UserUpdate):
    user = UserService.update_user(uid, user_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/users/{uid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(uid: str):
    if not UserService.delete_user(uid):
        raise HTTPException(status_code=404, detail="User not found")


@router.get("/users/", response_model=list[UserSchema])
def list_users():
    return UserService.list_users()
