"""Gamification service for XP, badges, and streaks."""

from typing import List, Dict
from models.user import User
from models.badge import Badge, UserBadge, PREDEFINED_BADGES
from repositories.user_repository import UserRepository
from repositories.session_repository import SessionRepository
from repositories.badge_repository import BadgeRepository


class GamificationService:
    """ゲーミフィケーション機能サービス"""
    
    def __init__(self):
        self.user_repo = UserRepository()
        self.session_repo = SessionRepository()
        self.badge_repo = BadgeRepository()
    
    def get_user_profile(self, user_id: int) -> Dict:
        """ユーザープロフィールを取得（XP、レベル、ストリーク含む）"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return {}
        
        return user.to_dict()
    
    def check_and_award_badges(self, user_id: int) -> List[Badge]:
        """バッジの条件をチェックして新規バッジを授与"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return []
        
        # 完了済みセッションを取得
        completed_sessions = self.session_repo.get_completed_by_user(user_id)
        total_completed = len(completed_sessions)
        
        # 週間セッションを取得
        weekly_sessions = self.session_repo.get_weekly_sessions(user_id)
        weekly_completed = sum(1 for s in weekly_sessions if s.completed)
        
        newly_awarded = []
        
        # 各バッジの条件をチェック
        for badge in PREDEFINED_BADGES:
            # 既に取得済みならスキップ
            if self.badge_repo.has_badge(user_id, badge.id):
                continue
            
            should_award = False
            
            if badge.criteria_type == 'streak':
                should_award = user.current_streak >= badge.criteria_value
            elif badge.criteria_type == 'weekly_count':
                should_award = weekly_completed >= badge.criteria_value
            elif badge.criteria_type == 'total_count':
                should_award = total_completed >= badge.criteria_value
            
            if should_award:
                self.badge_repo.award_badge(user_id, badge.id)
                newly_awarded.append(badge)
        
        return newly_awarded
    
    def get_user_badges(self, user_id: int) -> Dict:
        """ユーザーのバッジ情報を取得"""
        user_badges = self.badge_repo.get_user_badges(user_id)
        all_badges = self.badge_repo.get_all_badges()
        
        # バッジIDをセットに変換
        earned_badge_ids = {ub.badge_id for ub in user_badges}
        
        # 取得済みと未取得のバッジを分類
        earned = [b for b in all_badges if b.id in earned_badge_ids]
        not_earned = [b for b in all_badges if b.id not in earned_badge_ids]
        
        return {
            'earned': [b.to_dict() for b in earned],
            'not_earned': [b.to_dict() for b in not_earned],
            'total_earned': len(earned),
            'total_available': len(all_badges)
        }
    
    def get_leaderboard(self, limit: int = 10) -> List[Dict]:
        """リーダーボードを取得（今後の拡張用）"""
        # TODO: 複数ユーザー対応時に実装
        return []
