"""Unit tests for Statistics model."""

import pytest
from models.statistics import Statistics
from models.session import PomodoroSession


def test_statistics_creation():
    """統計の基本的な作成をテスト"""
    stats = Statistics(user_id=1)
    
    assert stats.user_id == 1
    assert stats.total_sessions == 0
    assert stats.completed_sessions == 0
    assert stats.completion_rate == 0.0


def test_update_from_sessions():
    """セッションから統計を更新するテスト"""
    stats = Statistics(user_id=1)
    
    # テストセッションを作成
    sessions = [
        PomodoroSession(user_id=1, duration_minutes=25, completed=True),
        PomodoroSession(user_id=1, duration_minutes=25, completed=True),
        PomodoroSession(user_id=1, duration_minutes=25, completed=False),
    ]
    
    stats.update_from_sessions(sessions)
    
    assert stats.total_sessions == 3
    assert stats.completed_sessions == 2
    assert stats.total_focus_minutes == 50
    assert stats.average_focus_minutes == 25.0
    assert stats.completion_rate == pytest.approx(66.67, 0.01)


def test_update_from_empty_sessions():
    """空のセッションリストからの更新をテスト"""
    stats = Statistics(user_id=1)
    stats.update_from_sessions([])
    
    assert stats.total_sessions == 0
    assert stats.completed_sessions == 0
    assert stats.completion_rate == 0.0


def test_statistics_to_dict():
    """統計の辞書変換をテスト"""
    stats = Statistics(
        user_id=1,
        total_sessions=10,
        completed_sessions=8,
        total_focus_minutes=200,
        average_focus_minutes=25.0,
        completion_rate=80.0
    )
    
    stats_dict = stats.to_dict()
    
    assert stats_dict['user_id'] == 1
    assert stats_dict['total_sessions'] == 10
    assert stats_dict['completed_sessions'] == 8
    assert stats_dict['total_focus_minutes'] == 200
    assert stats_dict['average_focus_minutes'] == 25.0
    assert stats_dict['completion_rate'] == 80.0
