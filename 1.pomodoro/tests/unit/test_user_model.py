"""Unit tests for User model."""

import pytest
from models.user import User


def test_user_creation():
    """ユーザーの基本的な作成をテスト"""
    user = User(username="test_user", xp=0, level=1)
    assert user.username == "test_user"
    assert user.xp == 0
    assert user.level == 1
    assert user.current_streak == 0


def test_xp_for_next_level():
    """次のレベルまでのXP計算をテスト"""
    user = User(level=1)
    assert user.xp_for_next_level == 100
    
    user = User(level=5)
    assert user.xp_for_next_level == 500


def test_xp_progress_percentage():
    """XP進捗率の計算をテスト"""
    user = User(xp=0, level=1)
    assert user.xp_progress_percentage == 0.0
    
    user = User(xp=50, level=1)
    assert user.xp_progress_percentage == 50.0
    
    user = User(xp=100, level=1)
    # レベル2になるはずだが、手動で設定していないのでテストは注意
    assert user.xp_progress_percentage == 100.0


def test_add_xp_no_level_up():
    """レベルアップしない場合のXP追加をテスト"""
    user = User(xp=0, level=1)
    leveled_up = user.add_xp(50)
    
    assert user.xp == 50
    assert user.level == 1
    assert leveled_up is False


def test_add_xp_with_level_up():
    """レベルアップする場合のXP追加をテスト"""
    user = User(xp=80, level=1)
    leveled_up = user.add_xp(50)
    
    assert user.xp == 130
    assert user.level == 2
    assert leveled_up is True


def test_add_xp_multiple_levels():
    """複数レベルアップする場合のXP追加をテスト"""
    user = User(xp=50, level=1)
    leveled_up = user.add_xp(200)
    
    assert user.xp == 250
    assert user.level == 3
    assert leveled_up is True


def test_update_streak_first_session():
    """最初のセッションでストリークを開始"""
    user = User()
    user.update_streak("2024-01-01")
    
    assert user.current_streak == 1
    assert user.longest_streak == 1
    assert user.last_session_date == "2024-01-01"


def test_update_streak_same_day():
    """同じ日に複数セッションを完了してもストリークは変わらない"""
    user = User(current_streak=5, longest_streak=10, last_session_date="2024-01-01")
    user.update_streak("2024-01-01")
    
    assert user.current_streak == 5
    assert user.last_session_date == "2024-01-01"


def test_update_streak_consecutive_days():
    """連続する日のストリーク更新"""
    user = User(current_streak=1, longest_streak=1, last_session_date="2024-01-01")
    user.update_streak("2024-01-02")
    
    assert user.current_streak == 2
    assert user.longest_streak == 2


def test_to_dict():
    """辞書への変換をテスト"""
    user = User(id=1, username="test", xp=150, level=2, current_streak=5)
    user_dict = user.to_dict()
    
    assert user_dict['id'] == 1
    assert user_dict['username'] == "test"
    assert user_dict['xp'] == 150
    assert user_dict['level'] == 2
    assert user_dict['current_streak'] == 5
    assert 'xp_for_next_level' in user_dict
    assert 'xp_progress_percentage' in user_dict
