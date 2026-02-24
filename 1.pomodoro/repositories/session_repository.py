"""Session repository for data access."""

from typing import List, Optional
from datetime import datetime, timedelta
from models.session import PomodoroSession
from .database import get_db


class SessionRepository:
    """セッションデータへのアクセス"""
    
    @staticmethod
    def create(session: PomodoroSession) -> PomodoroSession:
        """新しいセッションを作成"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''INSERT INTO sessions (user_id, duration_minutes, completed, started_at)
                   VALUES (?, ?, ?, ?)''',
                (session.user_id, session.duration_minutes, session.completed, 
                 session.started_at or datetime.now().isoformat())
            )
            session.id = cursor.lastrowid
            return session
    
    @staticmethod
    def update(session: PomodoroSession) -> None:
        """セッション情報を更新"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''UPDATE sessions 
                   SET completed = ?, completed_at = ?, xp_earned = ?
                   WHERE id = ?''',
                (session.completed, session.completed_at, session.xp_earned, session.id)
            )
    
    @staticmethod
    def get_by_id(session_id: int) -> Optional[PomodoroSession]:
        """IDでセッションを取得"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM sessions WHERE id = ?', (session_id,))
            row = cursor.fetchone()
            
            if row:
                return PomodoroSession(
                    id=row['id'],
                    user_id=row['user_id'],
                    duration_minutes=row['duration_minutes'],
                    completed=bool(row['completed']),
                    started_at=row['started_at'],
                    completed_at=row['completed_at'],
                    xp_earned=row['xp_earned']
                )
            return None
    
    @staticmethod
    def get_by_user(user_id: int, limit: Optional[int] = None) -> List[PomodoroSession]:
        """ユーザーのセッション一覧を取得"""
        with get_db() as conn:
            cursor = conn.cursor()
            query = 'SELECT * FROM sessions WHERE user_id = ? ORDER BY started_at DESC'
            params = [user_id]
            
            if limit:
                # limitを整数として検証してSQLインジェクションを防止
                limit = int(limit)
                query += ' LIMIT ?'
                params.append(limit)
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            return [
                PomodoroSession(
                    id=row['id'],
                    user_id=row['user_id'],
                    duration_minutes=row['duration_minutes'],
                    completed=bool(row['completed']),
                    started_at=row['started_at'],
                    completed_at=row['completed_at'],
                    xp_earned=row['xp_earned']
                )
                for row in rows
            ]
    
    @staticmethod
    def get_completed_by_user(user_id: int) -> List[PomodoroSession]:
        """ユーザーの完了済みセッションを取得"""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT * FROM sessions WHERE user_id = ? AND completed = 1 ORDER BY completed_at DESC',
                (user_id,)
            )
            rows = cursor.fetchall()
            
            return [
                PomodoroSession(
                    id=row['id'],
                    user_id=row['user_id'],
                    duration_minutes=row['duration_minutes'],
                    completed=bool(row['completed']),
                    started_at=row['started_at'],
                    completed_at=row['completed_at'],
                    xp_earned=row['xp_earned']
                )
                for row in rows
            ]
    
    @staticmethod
    def get_weekly_sessions(user_id: int) -> List[PomodoroSession]:
        """今週のセッションを取得"""
        with get_db() as conn:
            cursor = conn.cursor()
            week_ago = (datetime.now() - timedelta(days=7)).isoformat()
            cursor.execute(
                'SELECT * FROM sessions WHERE user_id = ? AND started_at >= ? ORDER BY started_at DESC',
                (user_id, week_ago)
            )
            rows = cursor.fetchall()
            
            return [
                PomodoroSession(
                    id=row['id'],
                    user_id=row['user_id'],
                    duration_minutes=row['duration_minutes'],
                    completed=bool(row['completed']),
                    started_at=row['started_at'],
                    completed_at=row['completed_at'],
                    xp_earned=row['xp_earned']
                )
                for row in rows
            ]
    
    @staticmethod
    def get_monthly_sessions(user_id: int) -> List[PomodoroSession]:
        """今月のセッションを取得"""
        with get_db() as conn:
            cursor = conn.cursor()
            month_ago = (datetime.now() - timedelta(days=30)).isoformat()
            cursor.execute(
                'SELECT * FROM sessions WHERE user_id = ? AND started_at >= ? ORDER BY started_at DESC',
                (user_id, month_ago)
            )
            rows = cursor.fetchall()
            
            return [
                PomodoroSession(
                    id=row['id'],
                    user_id=row['user_id'],
                    duration_minutes=row['duration_minutes'],
                    completed=bool(row['completed']),
                    started_at=row['started_at'],
                    completed_at=row['completed_at'],
                    xp_earned=row['xp_earned']
                )
                for row in rows
            ]
