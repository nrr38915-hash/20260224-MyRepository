"""Pomodoro session model."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class PomodoroSession:
    """ポモドーロセッションの記録"""
    
    id: Optional[int] = None
    user_id: int = 1
    duration_minutes: int = 25
    completed: bool = False
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    xp_earned: int = 0
    
    def complete(self, xp: int) -> None:
        """セッションを完了としてマーク"""
        self.completed = True
        self.completed_at = datetime.now().isoformat()
        self.xp_earned = xp
    
    def to_dict(self) -> dict:
        """辞書形式に変換"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'duration_minutes': self.duration_minutes,
            'completed': self.completed,
            'started_at': self.started_at,
            'completed_at': self.completed_at,
            'xp_earned': self.xp_earned
        }
