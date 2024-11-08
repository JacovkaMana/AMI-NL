from fastapi import APIRouter, HTTPException, status, UploadFile, File, Depends
from services.user_service import UserService
from schemas.user import UserSchema, UserCreate, UserUpdate
from models.user import User
from api.auth import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/",
    response_model=UserSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user",
    description="Creates a new user account with the provided information",
)
def create_user(user_data: UserCreate):
    """
    Create a new user with the following information:

    - **username**: unique username for the account
    - **email**: unique email address
    - **password**: secure password for the account
    """
    return UserService.create_user(user_data)


@router.get(
    "/me/characters",
    response_model=list[UserSchema],
    summary="Get current user's characters",
    description="Retrieves all characters owned by the current user",
)
async def get_my_characters(current_user: User = Depends(get_current_user)):
    """
    Retrieves all characters associated with the currently authenticated user
    """
    return current_user.characters.all()


@router.patch(
    "/me/avatar",
    summary="Update user avatar",
    description="Upload or update the current user's profile avatar",
)
async def update_user_avatar(
    avatar: UploadFile = File(...), current_user: User = Depends(get_current_user)
):
    """
    Update the current user's profile avatar

    - **avatar**: Image file to use as profile avatar
    """
    return current_user.update_profile(avatar_file=avatar)


@router.get(
    "/{uid}",
    response_model=UserSchema,
    summary="Get user by ID",
    description="Retrieve a specific user's information by their unique ID",
)
def get_user(uid: str):
    """
    Retrieve user information by UID:

    - **uid**: Unique identifier of the user
    """
    user = UserService.get_user(uid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put(
    "/{uid}",
    response_model=UserSchema,
    summary="Update user",
    description="Update a specific user's information",
)
def update_user(uid: str, user_data: UserUpdate):
    """
    Update user information:

    - **uid**: Unique identifier of the user
    - **user_data**: Updated user information
    """
    user = UserService.update_user(uid, user_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete(
    "/{uid}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user",
    description="Delete a specific user account",
)
def delete_user(uid: str):
    """
    Delete a user account:

    - **uid**: Unique identifier of the user to delete
    """
    if not UserService.delete_user(uid):
        raise HTTPException(status_code=404, detail="User not found")
