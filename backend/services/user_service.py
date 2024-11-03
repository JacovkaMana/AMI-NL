from typing import Optional
from models.user import User
from schemas.user import UserCreate, UserUpdate, UserSchema
from core.security import get_password_hash


class UserService:
    @staticmethod
    def create_user(user_data: UserCreate) -> User:
        # Hash the password before storing
        user_dict = user_data.dict()
        user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))

        user = User(**user_dict)
        user.save()
        return user

    @staticmethod
    def get_user(uid: str) -> Optional[User]:
        return User.nodes.first_or_none(uid=uid)

    @staticmethod
    def get_user_by_email(email: str) -> Optional[User]:
        return User.nodes.first_or_none(email=email)

    @staticmethod
    def update_user(uid: str, user_data: UserUpdate) -> Optional[User]:
        user = User.nodes.first_or_none(uid=uid)
        if not user:
            return None

        update_data = user_data.dict(exclude_unset=True)

        # Hash password if it's being updated
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(
                update_data.pop("password")
            )

        for key, value in update_data.items():
            setattr(user, key, value)

        user.save()
        return user

    @staticmethod
    def delete_user(uid: str) -> bool:
        user = User.nodes.first_or_none(uid=uid)
        if user:
            user.delete()
            return True
        return False

    @staticmethod
    def list_users() -> list[User]:
        return User.nodes.all()
