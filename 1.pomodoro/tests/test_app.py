"""
Pomodoro Timer Flask Application - Unit Tests
"""
import unittest
import json
from app import app


class PomodoroAppTestCase(unittest.TestCase):
    """ポモドーロタイマーアプリケーションのテストケース"""
    
    def setUp(self):
        """各テストの前に実行される"""
        self.app = app
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
    
    def test_index_route(self):
        """メインページが正しく表示される"""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<!DOCTYPE html>', response.data)
        # HTMLにタイマー要素が含まれることを確認
        self.assertIn(b'timer', response.data.lower())
    
    def test_index_contains_timer_elements(self):
        """メインページに必要な要素が含まれる"""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        
        # タイマー表示要素の確認
        self.assertIn(b'timeDisplay', response.data)
        self.assertIn(b'statusDisplay', response.data)
        
        # ボタン要素の確認
        self.assertIn(b'startBtn', response.data)
        self.assertIn(b'pauseBtn', response.data)
        self.assertIn(b'resetBtn', response.data)
        
        # プログレスバー要素の確認
        self.assertIn(b'progress-ring', response.data)
        self.assertIn(b'progress-ring-circle', response.data)
        
        # パーティクルキャンバス要素の確認
        self.assertIn(b'particleCanvas', response.data)
    
    def test_settings_api(self):
        """設定APIが正しいデータを返す"""
        response = self.client.get('/api/settings')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'application/json')
        
        data = json.loads(response.data)
        self.assertIn('workDuration', data)
        self.assertIn('breakDuration', data)
        self.assertIn('longBreakDuration', data)
    
    def test_settings_api_values(self):
        """設定APIが正しい値を返す"""
        response = self.client.get('/api/settings')
        data = json.loads(response.data)
        
        # デフォルト設定値の確認
        self.assertEqual(data['workDuration'], 25 * 60)  # 25分
        self.assertEqual(data['breakDuration'], 5 * 60)   # 5分
        self.assertEqual(data['longBreakDuration'], 15 * 60)  # 15分
    
    def test_static_files_accessible(self):
        """静的ファイルがアクセス可能"""
        # CSS
        response = self.client.get('/static/css/style.css')
        self.assertEqual(response.status_code, 200)
        
        # JavaScript
        response = self.client.get('/static/js/timer.js')
        self.assertEqual(response.status_code, 200)
        
        response = self.client.get('/static/js/particles.js')
        self.assertEqual(response.status_code, 200)
    
    def test_invalid_route(self):
        """存在しないルートは404を返す"""
        response = self.client.get('/nonexistent')
        self.assertEqual(response.status_code, 404)


if __name__ == '__main__':
    unittest.main()
