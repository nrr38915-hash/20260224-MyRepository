"""Badge models for gamification."""

from dataclasses import dataclass
from typing import Optional, List


@dataclass
class Badge:
    """バッジ定義"""
    
    id: str  # 例: "streak_3", "weekly_10"
    name: str  # 例: "3日連続達成"
    description: str
    icon: str  # アイコン名またはemoji
    criteria_type: str  # "streak", "weekly_count", "monthly_count", "total_count"
    criteria_value: int  # 達成に必要な値
    
    def to_dict(self) -> dict:
        """辞書形式に変換"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'criteria_type': self.criteria_type,
            'criteria_value': self.criteria_value
        }


@dataclass
class UserBadge:
    """ユーザーが取得したバッジ"""
    
    id: Optional[int] = None
    user_id: int = 1
    badge_id: str = ""
    earned_at: Optional[str] = None
    
    def to_dict(self) -> dict:
        """辞書形式に変換"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'badge_id': self.badge_id,
            'earned_at': self.earned_at
        }


# 定義済みバッジ
PREDEFINED_BADGES: List[Badge] = [
    Badge(
        id="streak_3",
        name="3日連続達成",
        description="3日連続でポモドーロを完了しました",
        icon="🔥",
        criteria_type="streak",
        criteria_value=3
    ),
    Badge(
        id="streak_7",
        name="1週間連続達成",
        description="7日連続でポモドーロを完了しました",
        icon="⭐",
        criteria_type="streak",
        criteria_value=7
    ),
    Badge(
        id="weekly_10",
        name="今週10回完了",
        description="今週10回のポモドーロを完了しました",
        icon="🎯",
        criteria_type="weekly_count",
        criteria_value=10
    ),
    Badge(
        id="weekly_20",
        name="今週20回完了",
        description="今週20回のポモドーロを完了しました",
        icon="💎",
        criteria_type="weekly_count",
        criteria_value=20
    ),
    Badge(
        id="total_50",
        name="合計50回完了",
        description="累計50回のポモドーロを完了しました",
        icon="🏆",
        criteria_type="total_count",
        criteria_value=50
    ),
    Badge(
        id="total_100",
        name="合計100回完了",
        description="累計100回のポモドーロを完了しました",
        icon="👑",
        criteria_type="total_count",
        criteria_value=100
    ),
]
