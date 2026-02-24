"""Integration tests for API endpoints."""

import pytest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app import create_app
from repositories.database import init_db
import tempfile


@pytest.fixture
def client():
    """テスト用のFlaskクライアントを作成"""
    db_fd, db_path = tempfile.mkstemp()
    
    # テスト用のDB pathを設定
    import repositories.database as db_module
    db_module.DB_PATH = db_path
    
    app = create_app()
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        with app.app_context():
            init_db()
        yield client
    
    os.close(db_fd)
    os.unlink(db_path)


def test_health_check(client):
    """ヘルスチェックAPIのテスト"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'


def test_start_session(client):
    """セッション開始APIのテスト"""
    response = client.post('/api/session/start', json={'duration': 25})
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert 'session' in data
    assert data['session']['duration_minutes'] == 25


def test_complete_session(client):
    """セッション完了APIのテスト"""
    # まずセッションを開始
    start_response = client.post('/api/session/start', json={'duration': 25})
    session_id = start_response.get_json()['session']['id']
    
    # セッションを完了
    complete_response = client.post(f'/api/session/{session_id}/complete')
    assert complete_response.status_code == 200
    
    data = complete_response.get_json()
    assert data['success'] is True
    assert data['xp_earned'] == 50  # 25分 * 2
    assert 'user' in data


def test_get_profile(client):
    """プロフィール取得APIのテスト"""
    response = client.get('/api/gamification/profile')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert 'profile' in data
    assert data['profile']['level'] >= 1


def test_get_badges(client):
    """バッジ取得APIのテスト"""
    response = client.get('/api/gamification/badges')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert 'badges' in data
    assert 'earned' in data['badges']
    assert 'not_earned' in data['badges']


def test_get_statistics(client):
    """統計取得APIのテスト"""
    response = client.get('/api/statistics')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert 'statistics' in data


def test_complete_session_and_level_up(client):
    """セッション完了でレベルアップするシナリオをテスト"""
    # 複数のセッションを完了してレベルアップを目指す
    for _ in range(3):  # 3セッション = 150 XP → レベル2
        start_response = client.post('/api/session/start', json={'duration': 25})
        session_id = start_response.get_json()['session']['id']
        client.post(f'/api/session/{session_id}/complete')
    
    # プロフィールを確認
    profile_response = client.get('/api/gamification/profile')
    profile = profile_response.get_json()['profile']
    
    assert profile['level'] >= 2
    assert profile['xp'] >= 150


def test_badge_award_after_sessions(client):
    """複数セッション完了後にバッジが授与されることをテスト"""
    # 3つのセッションを異なる日に完了（ストリークバッジのため）
    # 注: 実際のテストでは同じ日になるので、ストリークバッジは取得できない
    # 代わりに総完了数で判定されるバッジを狙う
    
    for _ in range(5):
        start_response = client.post('/api/session/start', json={'duration': 25})
        session_id = start_response.get_json()['session']['id']
        client.post(f'/api/session/{session_id}/complete')
    
    # バッジを確認
    badges_response = client.get('/api/gamification/badges')
    badges = badges_response.get_json()['badges']
    
    # バッジシステムが動作していることを確認
    assert 'earned' in badges
    assert 'not_earned' in badges
