from neomodel import (
    StructuredNode,
    StringProperty,
    RelationshipTo,
    EmailProperty,
    DateTimeProperty,
    UniqueIdProperty,
)
from datetime import datetime
import os
from pathlib import Path
import shutil


class User(StructuredNode):
    uid = UniqueIdProperty()
    username = StringProperty(unique_index=True, required=True)
    email = StringProperty(unique_index=True, required=True)
    hashed_password = StringProperty(required=True)
    created_at = DateTimeProperty(default=datetime.utcnow)
    avatar_path = StringProperty(default="")

    # Define relationships
    characters = RelationshipTo(".character.Character", "OWNS_CHARACTER")

    def update_profile(self, avatar_file=None):
        if avatar_file:
            # Remove old avatar if exists
            if self.avatar_path and os.path.exists(self.avatar_path):
                os.remove(self.avatar_path)

            # Save new avatar
            media_dir = Path("media/users")
            media_dir.mkdir(parents=True, exist_ok=True)

            file_extension = avatar_file.filename.split(".")[-1]
            avatar_path = f"media/users/{self.uid}_avatar.{file_extension}"

            with open(avatar_path, "wb") as buffer:
                shutil.copyfileobj(avatar_file.file, buffer)

            self.avatar_path = avatar_path
            self.save()

        return self
