from typing import Optional, Dict, Any
from fastapi import HTTPException
from models.monster import Monster
from models.user import User


class MonsterService:
    @staticmethod
    def create_monster(monster_data: Dict[str, Any]) -> Monster:
        try:
            monster = Monster(**monster_data).save()
            return monster
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_monster(uid: str) -> Optional[Monster]:
        return Monster.nodes.first_or_none(uid=uid)

    @staticmethod
    def update_monster(uid: str, monster_data: Dict[str, Any]) -> Optional[Monster]:
        monster = MonsterService.get_monster(uid)
        if not monster:
            return None

        for key, value in monster_data.dict(exclude_unset=True).items():
            if hasattr(monster, key):
                setattr(monster, key, value)

        monster.save()
        return monster

    @staticmethod
    def delete_monster(uid: str) -> bool:
        monster = MonsterService.get_monster(uid)
        if not monster:
            return False
        monster.delete()
        return True
