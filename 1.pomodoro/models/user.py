"""User model with gamification features."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class User:
    """ユーザープロフィール（XP、レベル、ストリーク管理）"""
    
    id: Optional[int] = None
    username: str = "default_user"
    xp: int = 0
    level: int = 1
    current_streak: int = 0
    longest_streak: int = 0
    last_session_date: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
    @property
    def xp_for_next_level(self) -> int:
        """次のレベルまでに必要なXP"""
        return self.level * 100
    
    @property
    def xp_progress_percentage(self) -> float:
        """現在のレベル内でのXP進捗率（0-100）"""
        level_xp = (self.level - 1) * 100
        xp_in_current_level = self.xp - level_xp
        return (xp_in_current_level / self.xp_for_next_level) * 100
    
    def add_xp(self, amount: int) -> bool:
        """XPを追加してレベルアップをチェック"""
        self.xp += amount
        old_level = self.level
        
        # レベル計算: XP ÷ 100（切り捨て）+ 1
        new_level = (self.xp // 100) + 1
        
        if new_level > old_level:
            self.level = new_level
            return True  # レベルアップした
        return False  # レベルアップしなかった
    
    def update_streak(self, session_date: str) -> None:
        """ストリークを更新"""
        if self.last_session_date is None:
            self.current_streak = 1
            self.longest_streak = max(self.longest_streak, 1)
        elif self.last_session_date != session_date:
            # 日付が異なる場合、ストリークを更新
            # TODO: 連続性チェック（日付の差が1日かどうか）
            self.current_streak += 1
            if self.current_streak > self.longest_streak:
                self.longest_streak = self.current_streak
        
        self.last_session_date = session_date
    
    def to_dict(self) -> dict:
        """辞書形式に変換"""
        return {
            'id': self.id,
            'username': self.username,
            'xp': self.xp,
            'level': self.level,
            'current_streak': self.current_streak,
            'longest_streak': self.longest_streak,
            'last_session_date': self.last_session_date,
            'xp_for_next_level': self.xp_for_next_level,
            'xp_progress_percentage': self.xp_progress_percentage,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
