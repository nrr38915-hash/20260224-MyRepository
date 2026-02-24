"""
Flask アプリケーションのユニットテスト
"""
import pytest
from app import app


@pytest.fixture
def client():
    """テスト用の Flask クライアントを作成"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


class TestFlaskApp:
    """Flask アプリケーションのテストクラス"""
    
    def test_index_route_status_code(self, client):
        """
        ルートパスが200ステータスコードを返すことをテスト
        """
        response = client.get('/')
        assert response.status_code == 200
    
    def test_index_route_content_type(self, client):
        """
        ルートパスが HTML を返すことをテスト
        """
        response = client.get('/')
        assert 'text/html' in response.content_type
    
    def test_index_route_contains_timer(self, client):
        """
        ルートパスのレスポンスにタイマー要素が含まれることをテスト
        """
        response = client.get('/')
        assert b'timer-display' in response.data
    
    def test_index_route_contains_buttons(self, client):
        """
        ルートパスのレスポンスに開始/リセットボタンが含まれることをテスト
        """
        response = client.get('/')
        assert b'start-btn' in response.data
        assert b'reset-btn' in response.data
    
    def test_404_error(self, client):
        """
        存在しないパスが404を返すことをテスト
        """
        response = client.get('/nonexistent')
        assert response.status_code == 404
