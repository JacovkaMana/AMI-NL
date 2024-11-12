from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.responses import JSONResponse
import os
import uuid
from datetime import datetime
from models.user import User
from ..auth import get_current_user
from typing import Optional
from pydantic import BaseModel

router = APIRouter(
    prefix="/upload-image",
    tags=["Image Upload"],
    responses={404: {"description": "Not found"}},
)


class ImageUploadResponse(BaseModel):
    message: str
    image_path: str


@router.post("/", response_model=ImageUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    character_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
):
    """
    Upload an image and return its path

    Args:
        file: The image file to upload
        character_id: Optional character ID if the image is for a character
        current_user: The authenticated user

    Returns:
        dict: Contains success message and the relative path to the saved image
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="File must be an image"
            )

        # Create unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = os.path.splitext(file.filename)[1]
        filename = f"uploaded_{timestamp}_{uuid.uuid4().hex[:8]}{file_extension}"

        # Determine save path based on whether it's for a character
        if character_id:
            save_dir = "media/characters"
            relative_path = f"characters/{filename}"
        else:
            save_dir = "media/uploads"
            relative_path = f"uploads/{filename}"

        # Ensure directory exists
        os.makedirs(save_dir, exist_ok=True)

        # Save the image
        file_path = os.path.join(save_dir, filename)
        with open(file_path, "wb") as f:
            contents = await file.read()
            f.write(contents)

        return ImageUploadResponse(
            message="Image uploaded successfully", image_path=relative_path
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
