"""Unit tests for PomodoroSession model."""

import pytest
from models.session import PomodoroSession


def test_session_creation():
    """セッションの基本的な作成をテスト"""
    session = PomodoroSession(user_id=1, duration_minutes=25)
    assert session.user_id == 1
    assert session.duration_minutes == 25
    assert session.completed is False
    assert session.xp_earned == 0


def test_session_complete():
    """セッション完了をテスト"""
    session = PomodoroSession(user_id=1, duration_minutes=25)
    session.complete(xp=50)
    
    assert session.completed is True
    assert session.xp_earned == 50
    assert session.completed_at is not None


def test_session_to_dict():
    """辞書への変換をテスト"""
    session = PomodoroSession(id=1, user_id=1, duration_minutes=25, completed=True)
    session_dict = session.to_dict()
    
    assert session_dict['id'] == 1
    assert session_dict['user_id'] == 1
    assert session_dict['duration_minutes'] == 25
    assert session_dict['completed'] is True
