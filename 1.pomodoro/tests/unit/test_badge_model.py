"""Unit tests for Badge models."""

import pytest
from models.badge import Badge, UserBadge, PREDEFINED_BADGES


def test_badge_creation():
    """バッジの作成をテスト"""
    badge = Badge(
        id="test_badge",
        name="テストバッジ",
        description="テスト用のバッジです",
        icon="🎯",
        criteria_type="total_count",
        criteria_value=10
    )
    
    assert badge.id == "test_badge"
    assert badge.name == "テストバッジ"
    assert badge.criteria_type == "total_count"
    assert badge.criteria_value == 10


def test_badge_to_dict():
    """バッジの辞書変換をテスト"""
    badge = Badge(
        id="test",
        name="Test",
        description="Test badge",
        icon="🎯",
        criteria_type="streak",
        criteria_value=3
    )
    
    badge_dict = badge.to_dict()
    assert badge_dict['id'] == "test"
    assert badge_dict['name'] == "Test"
    assert badge_dict['criteria_type'] == "streak"


def test_user_badge_creation():
    """ユーザーバッジの作成をテスト"""
    user_badge = UserBadge(user_id=1, badge_id="streak_3")
    
    assert user_badge.user_id == 1
    assert user_badge.badge_id == "streak_3"


def test_predefined_badges_exist():
    """定義済みバッジが存在することをテスト"""
    assert len(PREDEFINED_BADGES) > 0
    
    # 特定のバッジが存在することを確認
    badge_ids = [b.id for b in PREDEFINED_BADGES]
    assert "streak_3" in badge_ids
    assert "weekly_10" in badge_ids
    assert "total_50" in badge_ids


def test_predefined_badges_structure():
    """定義済みバッジの構造をテスト"""
    for badge in PREDEFINED_BADGES:
        assert badge.id is not None
        assert badge.name is not None
        assert badge.description is not None
        assert badge.icon is not None
        assert badge.criteria_type in ["streak", "weekly_count", "monthly_count", "total_count"]
        assert badge.criteria_value > 0
