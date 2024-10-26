from backend.app.models.class_feature import Player  # Importing the Player model
from backend.app.schemas.user import UserSchema


class UserService:
    @staticmethod
    def create_user(user_data: UserSchema) -> Player:
        user = Player(**user_data.dict())
        user.save()
        return user

    @staticmethod
    def get_user(uid: str) -> Player:  # Added method to get user by UID
        return Player.get(uid)

    # ... additional service methods can be added here ...
