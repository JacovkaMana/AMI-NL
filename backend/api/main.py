from fastapi import APIRouter
from .routes import users, characters, monsters, image_generation, image_upload
from .auth import router as auth_router

router = APIRouter()

# Include the auth router with its own tag
router.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"],
    responses={404: {"description": "Not found"}},
)

# Include the modular routers
router.include_router(users.router)
router.include_router(characters.router)
router.include_router(monsters.router)
router.include_router(image_generation.router)
router.include_router(image_upload.router)
