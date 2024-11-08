from fastapi import APIRouter, HTTPException, status, Depends
from services.monster_service import MonsterService
from schemas.monster import MonsterCreate, MonsterUpdate, MonsterResponse
from models.user import User
from api.auth import get_current_user

router = APIRouter(
    prefix="/monsters",
    tags=["Monsters"],
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/",
    response_model=MonsterResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_monster(
    monster_data: MonsterCreate, current_user: User = Depends(get_current_user)
):
    try:
        monster_dict = monster_data.dict(exclude_unset=True)
        monster = MonsterService.create_monster(monster_dict)
        return monster.to_dict()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating monster: {str(e)}",
        )


@router.get(
    "/{uid}",
    response_model=MonsterResponse,
)
async def get_monster(uid: str, current_user: User = Depends(get_current_user)):
    monster = MonsterService.get_monster(uid)
    if not monster:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Monster not found"
        )
    return monster.to_dict()


@router.put(
    "/{uid}",
    response_model=MonsterResponse,
)
async def update_monster(
    uid: str,
    monster_data: MonsterUpdate,
    current_user: User = Depends(get_current_user),
):
    updated_monster = MonsterService.update_monster(uid, monster_data)
    if not updated_monster:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Monster not found"
        )
    return updated_monster.to_dict()


@router.delete(
    "/{uid}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_monster(uid: str, current_user: User = Depends(get_current_user)):
    if not MonsterService.delete_monster(uid):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Monster not found"
        )
