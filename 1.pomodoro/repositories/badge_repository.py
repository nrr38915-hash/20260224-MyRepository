"""Badge repository for data access."""

from typing import List
from datetime import datetime
from models.badge import Badge, UserBadge, PREDEFINED_BADGES
from .database import get_db


class BadgeRepository:
    """バッジデータへのアクセス"""
    
    @staticmethod
    def get_all_badges() -> List[Badge]:
        """すべてのバッジ定義を取得"""
        return PREDEFINED_BADGES
    
    @staticmethod
    def get_user_badges(user_id: int) -> List[UserBadge]:
        """ユーザーが取得したバッジを取得"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT * FROM user_badges WHERE user_id = ? ORDER BY earned_at DESC',
                (user_id,)
            )
            rows = cursor.fetchall()
            
            return [
                UserBadge(
                    id=row['id'],
                    user_id=row['user_id'],
                    badge_id=row['badge_id'],
                    earned_at=row['earned_at']
                )
                for row in rows
            ]
    
    @staticmethod
    def award_badge(user_id: int, badge_id: str) -> UserBadge:
        """ユーザーにバッジを授与"""
        with get_db() as conn:
            cursor = conn.cursor()
            
            # 既に取得済みかチェック
            cursor.execute(
                'SELECT * FROM user_badges WHERE user_id = ? AND badge_id = ?',
                (user_id, badge_id)
            )
            existing = cursor.fetchone()
            
            if existing:
                return UserBadge(
                    id=existing['id'],
                    user_id=existing['user_id'],
                    badge_id=existing['badge_id'],
                    earned_at=existing['earned_at']
                )
            
            # 新規バッジを授与
            cursor.execute(
                'INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)',
                (user_id, badge_id)
            )
            
            return UserBadge(
                id=cursor.lastrowid,
                user_id=user_id,
                badge_id=badge_id,
                earned_at=datetime.now().isoformat()
            )
    
    @staticmethod
    def has_badge(user_id: int, badge_id: str) -> bool:
        """ユーザーが特定のバッジを持っているかチェック"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT COUNT(*) FROM user_badges WHERE user_id = ? AND badge_id = ?',
                (user_id, badge_id)
            )
            count = cursor.fetchone()[0]
            return count > 0
