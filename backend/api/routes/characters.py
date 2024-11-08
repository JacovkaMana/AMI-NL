from fastapi import APIRouter, HTTPException, status, UploadFile, File, Depends
from services.character_service import CharacterService
from schemas.character import (
    CharacterCreate,
    CharacterUpdate,
    CharacterResponse,
    CharacterStatsResponse,
)
from models.user import User
from api.auth import get_current_user

router = APIRouter(
    prefix="/characters",
    tags=["Characters"],
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/",
    response_model=CharacterResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_character(
    character_data: CharacterCreate, current_user: User = Depends(get_current_user)
):
    try:
        # Convert Pydantic model to dict
        character_dict = character_data.dict(exclude_unset=True)

        # Create the character
        character = CharacterService.create_character(character_dict, current_user)
        return character.to_dict()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating character: {str(e)}",
        )


@router.get(
    "/me",
    response_model=list[CharacterResponse],
)
async def get_my_characters(current_user: User = Depends(get_current_user)):
    """Get all characters owned by the current user"""
    characters = current_user.characters.all()
    return [char.to_dict() for char in characters]


@router.get(
    "/{uid}",
    response_model=CharacterResponse,
)
async def get_character(uid: str, current_user: User = Depends(get_current_user)):
    """
    Get a specific character by ID

    Args:
        uid: Character's unique identifier
        current_user: Current authenticated user

    Returns:
        CharacterResponse: Character details

    Raises:
        HTTPException: If character not found or user not authorized
    """
    character = CharacterService.get_character(uid)
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Character not found"
        )

    # Correct ownership check
    if not CharacterService.is_owner(character, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this character",
        )

    return character.to_dict()


@router.patch(
    "/{uid}/images",
    summary="Update character images",
    description="Update a character's full image and/or icon",
)
async def update_character_images(
    uid: str,
    image: UploadFile = File(None),
    icon: UploadFile = File(None),
    current_user: User = Depends(get_current_user),
):
    """
    Update character images:

    - **uid**: Character's unique identifier
    - **image**: Full character image file (optional)
    - **icon**: Character icon file (optional)
    """
    character = CharacterService.get_character(uid)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    if not any(rel.end_node.uid == current_user.uid for rel in character.owner):
        raise HTTPException(
            status_code=403, detail="Not authorized to modify this character"
        )

    return character.update_images(image_file=image, icon_file=icon)


@router.put(
    "/{uid}",
    response_model=CharacterResponse,
    summary="Update character",
    description="Update a specific character's information",
)
async def update_character(
    uid: str,
    character_data: CharacterUpdate,
    current_user: User = Depends(get_current_user),
):
    """
    Update character information:

    - **uid**: Character's unique identifier
    - **character_data**: Updated character information
    """
    character = CharacterService.get_character(uid)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    if not any(rel.end_node.uid == current_user.uid for rel in character.owner):
        raise HTTPException(
            status_code=403, detail="Not authorized to modify this character"
        )

    updated_character = CharacterService.update_character(uid, character_data)
    if not updated_character:
        raise HTTPException(status_code=404, detail="Character not found")
    return updated_character.to_dict()


@router.delete(
    "/{uid}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete character",
    description="Delete a specific character",
)
async def delete_character(uid: str, current_user: User = Depends(get_current_user)):
    """
    Delete a character:

    - **uid**: Unique identifier of the character to delete
    """
    character = CharacterService.get_character(uid)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    if not any(rel.end_node.uid == current_user.uid for rel in character.owner):
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this character"
        )

    if not CharacterService.delete_character(uid):
        raise HTTPException(status_code=404, detail="Character not found")


@router.post(
    "/{character_id}/spells/{spell_name}",
    summary="Add spell to character",
    description="Add a spell to a character's spellbook",
)
async def add_spell_to_character(
    character_id: str, spell_name: str, current_user: User = Depends(get_current_user)
):
    """
    Add a spell to a character's spellbook

    - **character_id**: Character's unique identifier
    - **spell_name**: Name of the spell to add
    """
    character = CharacterService.get_character(character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    if not any(rel.end_node.uid == current_user.uid for rel in character.owner):
        raise HTTPException(
            status_code=403, detail="Not authorized to modify this character"
        )

    return CharacterService.add_spell(character_id, spell_name)


@router.post(
    "/{character_id}/features/{feature_name}",
    summary="Add feature to character",
    description="Add a feature to a character",
)
async def add_feature_to_character(
    character_id: str, feature_name: str, current_user: User = Depends(get_current_user)
):
    """
    Add a feature to a character

    - **character_id**: Character's unique identifier
    - **feature_name**: Name of the feature to add
    """
    character = CharacterService.get_character(character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    if not any(rel.end_node.uid == current_user.uid for rel in character.owner):
        raise HTTPException(
            status_code=403, detail="Not authorized to modify this character"
        )

    return CharacterService.add_feature(character_id, feature_name)


@router.get(
    "/{character_id}/spells",
    summary="Get character spells",
    description="Get all spells known by a character",
)
async def get_character_spells(
    character_id: str, current_user: User = Depends(get_current_user)
):
    """
    Get all spells known by a character

    - **character_id**: Character's unique identifier
    """
    character = CharacterService.get_character(character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    if not any(rel.end_node.uid == current_user.uid for rel in character.owner):
        raise HTTPException(
            status_code=403, detail="Not authorized to view this character"
        )

    return character.spells.all()


@router.get(
    "/{character_id}/features",
    summary="Get character features",
    description="Get all features of a character",
)
async def get_character_features(
    character_id: str, current_user: User = Depends(get_current_user)
):
    """
    Get all features of a character

    - **character_id**: Character's unique identifier
    """
    character = CharacterService.get_character(character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    if not any(rel.end_node.uid == current_user.uid for rel in character.owner):
        raise HTTPException(
            status_code=403, detail="Not authorized to view this character"
        )

    return character.features.all()


@router.get(
    "/{uid}/stats",
    response_model=CharacterStatsResponse,
    summary="Get character stats",
    description="Get detailed statistics for a character",
)
async def get_character_stats(uid: str, current_user: User = Depends(get_current_user)):
    """
    Get detailed character statistics including:
    - Base ability scores
    - Ability modifiers
    - Derived stats (AC, HP, etc.)
    - Saving throw proficiencies
    - Skill proficiencies
    """
    character = CharacterService.get_character(uid)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    if not any(rel.end_node.uid == current_user.uid for rel in character.owner):
        raise HTTPException(
            status_code=403, detail="Not authorized to view this character"
        )

    return CharacterService.get_character_stats(uid)


@router.patch(
    "/{uid}/stats",
    response_model=CharacterResponse,
    summary="Update character stats",
    description="Update statistics for a character",
)
async def update_character_stats(
    uid: str, stats_data: dict, current_user: User = Depends(get_current_user)
):
    """
    Update character statistics:
    - Base ability scores
    - Saving throw proficiencies
    - Skill proficiencies
    """
    character = CharacterService.get_character(uid)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    if not any(rel.end_node.uid == current_user.uid for rel in character.owner):
        raise HTTPException(
            status_code=403, detail="Not authorized to modify this character"
        )

    return CharacterService.update_character_stats(uid, stats_data)
