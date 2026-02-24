"""Pomodoro session management service."""

from datetime import datetime
from typing import Optional
from models.session import PomodoroSession
from models.user import User
from repositories.user_repository import UserRepository
from repositories.session_repository import SessionRepository


class PomodoroService:
    """ポモドーロセッション管理サービス"""
    
    def __init__(self):
        self.user_repo = UserRepository()
        self.session_repo = SessionRepository()
    
    def start_session(self, user_id: int, duration_minutes: int = 25) -> PomodoroSession:
        """新しいポモドーロセッションを開始"""
        session = PomodoroSession(
            user_id=user_id,
            duration_minutes=duration_minutes,
            started_at=datetime.now().isoformat()
        )
        return self.session_repo.create(session)
    
    def complete_session(self, session_id: int) -> Optional[dict]:
        """セッションを完了してXPとストリークを更新"""
        session = self.session_repo.get_by_id(session_id)
        if not session:
            return None
        
        # XPを計算（基本: 25分 = 50XP）
        xp = int(session.duration_minutes * 2)
        
        # セッションを完了
        session.complete(xp)
        self.session_repo.update(session)
        
        # ユーザー情報を更新
        user = self.user_repo.get_by_id(session.user_id)
        if user:
            # XPを追加してレベルアップをチェック
            leveled_up = user.add_xp(xp)
            
            # ストリークを更新
            today = datetime.now().strftime('%Y-%m-%d')
            user.update_streak(today)
            
            # ユーザー情報を保存
            self.user_repo.update(user)
            
            return {
                'session': session.to_dict(),
                'user': user.to_dict(),
                'leveled_up': leveled_up,
                'xp_earned': xp
            }
        
        return None
    
    def get_user_sessions(self, user_id: int, limit: Optional[int] = 10) -> list:
        """ユーザーのセッション履歴を取得"""
        sessions = self.session_repo.get_by_user(user_id, limit)
        return [s.to_dict() for s in sessions]
