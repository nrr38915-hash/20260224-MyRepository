"""Statistics model for tracking user performance."""

from dataclasses import dataclass
from typing import Optional, List


@dataclass
class Statistics:
    """ユーザーの統計情報"""
    
    user_id: int = 1
    total_sessions: int = 0
    completed_sessions: int = 0
    total_focus_minutes: int = 0
    average_focus_minutes: float = 0.0
    completion_rate: float = 0.0
    
    # 週間統計
    weekly_sessions: int = 0
    weekly_completed: int = 0
    weekly_focus_minutes: int = 0
    
    # 月間統計
    monthly_sessions: int = 0
    monthly_completed: int = 0
    monthly_focus_minutes: int = 0
    
    def update_from_sessions(self, sessions: List['PomodoroSession']) -> None:
        """セッションリストから統計を更新"""
        self.total_sessions = len(sessions)
        self.completed_sessions = sum(1 for s in sessions if s.completed)
        self.total_focus_minutes = sum(s.duration_minutes for s in sessions if s.completed)
        
        if self.completed_sessions > 0:
            self.average_focus_minutes = self.total_focus_minutes / self.completed_sessions
        
        if self.total_sessions > 0:
            self.completion_rate = (self.completed_sessions / self.total_sessions) * 100
    
    def to_dict(self) -> dict:
        """辞書形式に変換"""
        return {
            'user_id': self.user_id,
            'total_sessions': self.total_sessions,
            'completed_sessions': self.completed_sessions,
            'total_focus_minutes': self.total_focus_minutes,
            'average_focus_minutes': round(self.average_focus_minutes, 2),
            'completion_rate': round(self.completion_rate, 2),
            'weekly_sessions': self.weekly_sessions,
            'weekly_completed': self.weekly_completed,
            'weekly_focus_minutes': self.weekly_focus_minutes,
            'monthly_sessions': self.monthly_sessions,
            'monthly_completed': self.monthly_completed,
            'monthly_focus_minutes': self.monthly_focus_minutes
        }
