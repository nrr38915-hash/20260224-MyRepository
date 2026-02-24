"""Statistics service for tracking user performance."""

from typing import Dict, List
from datetime import datetime, timedelta
from models.statistics import Statistics
from repositories.session_repository import SessionRepository
from repositories.user_repository import UserRepository


class StatisticsService:
    """統計データサービス"""
    
    def __init__(self):
        self.session_repo = SessionRepository()
        self.user_repo = UserRepository()
    
    def get_user_statistics(self, user_id: int) -> Dict:
        """ユーザーの全体統計を取得"""
        stats = Statistics(user_id=user_id)
        
        # 全セッション
        all_sessions = self.session_repo.get_by_user(user_id)
        
        # 週間セッション
        weekly_sessions = self.session_repo.get_weekly_sessions(user_id)
        
        # 月間セッション
        monthly_sessions = self.session_repo.get_monthly_sessions(user_id)
        
        # 全体統計を更新
        stats.update_from_sessions(all_sessions)
        
        # 週間統計
        stats.weekly_sessions = len(weekly_sessions)
        stats.weekly_completed = sum(1 for s in weekly_sessions if s.completed)
        stats.weekly_focus_minutes = sum(s.duration_minutes for s in weekly_sessions if s.completed)
        
        # 月間統計
        stats.monthly_sessions = len(monthly_sessions)
        stats.monthly_completed = sum(1 for s in monthly_sessions if s.completed)
        stats.monthly_focus_minutes = sum(s.duration_minutes for s in monthly_sessions if s.completed)
        
        return stats.to_dict()
    
    def get_daily_activity(self, user_id: int, days: int = 30) -> List[Dict]:
        """日別のアクティビティデータを取得（グラフ表示用）"""
        sessions = self.session_repo.get_by_user(user_id)
        
        # 日付別にグループ化
        daily_data = {}
        for session in sessions:
            if session.completed and session.completed_at:
                date = session.completed_at[:10]  # YYYY-MM-DD
                if date not in daily_data:
                    daily_data[date] = {
                        'date': date,
                        'completed': 0,
                        'focus_minutes': 0
                    }
                daily_data[date]['completed'] += 1
                daily_data[date]['focus_minutes'] += session.duration_minutes
        
        # 過去N日分のデータを生成（データがない日は0）
        result = []
        for i in range(days):
            date = (datetime.now() - timedelta(days=days-i-1)).strftime('%Y-%m-%d')
            if date in daily_data:
                result.append(daily_data[date])
            else:
                result.append({
                    'date': date,
                    'completed': 0,
                    'focus_minutes': 0
                })
        
        return result
    
    def get_weekly_comparison(self, user_id: int) -> Dict:
        """今週と先週の比較データを取得"""
        now = datetime.now()
        
        # 今週のデータ
        this_week_sessions = self.session_repo.get_weekly_sessions(user_id)
        this_week_completed = sum(1 for s in this_week_sessions if s.completed)
        this_week_minutes = sum(s.duration_minutes for s in this_week_sessions if s.completed)
        
        # TODO: 先週のデータ取得ロジックを実装
        # 現在は今週のデータのみ返す（先週データは0）
        # 将来実装: ISO 8601形式の週（月曜開始）に基づいた正確な週の境界計算
        
        return {
            'this_week': {
                'completed': this_week_completed,
                'focus_minutes': this_week_minutes
            },
            'last_week': {
                'completed': 0,  # TODO: 先週の完了数を計算
                'focus_minutes': 0  # TODO: 先週の集中時間を計算
            },
            'note': '先週のデータは現在未実装です'
        }
