"""User repository for data access."""

from typing import Optional
from datetime import datetime
from models.user import User
from .database import get_db


class UserRepository:
    """ユーザーデータへのアクセス"""
    
    @staticmethod
    def get_by_id(user_id: int) -> Optional[User]:
        """IDでユーザーを取得"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
            row = cursor.fetchone()
            
            if row:
                return User(
                    id=row['id'],
                    username=row['username'],
                    xp=row['xp'],
                    level=row['level'],
                    current_streak=row['current_streak'],
                    longest_streak=row['longest_streak'],
                    last_session_date=row['last_session_date'],
                    created_at=row['created_at'],
                    updated_at=row['updated_at']
                )
            return None
    
    @staticmethod
    def get_by_username(username: str) -> Optional[User]:
        """ユーザー名でユーザーを取得"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
            row = cursor.fetchone()
            
            if row:
                return User(
                    id=row['id'],
                    username=row['username'],
                    xp=row['xp'],
                    level=row['level'],
                    current_streak=row['current_streak'],
                    longest_streak=row['longest_streak'],
                    last_session_date=row['last_session_date'],
                    created_at=row['created_at'],
                    updated_at=row['updated_at']
                )
            return None
    
    @staticmethod
    def create(user: User) -> User:
        """新しいユーザーを作成"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''INSERT INTO users (username, xp, level, current_streak, longest_streak)
                   VALUES (?, ?, ?, ?, ?)''',
                (user.username, user.xp, user.level, user.current_streak, user.longest_streak)
            )
            user.id = cursor.lastrowid
            return user
    
    @staticmethod
    def update(user: User) -> None:
        """ユーザー情報を更新"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''UPDATE users 
                   SET xp = ?, level = ?, current_streak = ?, longest_streak = ?,
                       last_session_date = ?, updated_at = ?
                   WHERE id = ?''',
                (user.xp, user.level, user.current_streak, user.longest_streak,
                 user.last_session_date, datetime.now().isoformat(), user.id)
            )
