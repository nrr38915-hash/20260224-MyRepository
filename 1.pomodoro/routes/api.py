"""API routes for Pomodoro Timer."""

from flask import Blueprint, jsonify, request
from services.pomodoro_service import PomodoroService
from services.gamification_service import GamificationService
from services.statistics_service import StatisticsService

api_bp = Blueprint('api', __name__)

# サービスのインスタンス
pomodoro_service = PomodoroService()
gamification_service = GamificationService()
statistics_service = StatisticsService()

# デフォルトユーザーID（シングルユーザーアプリ用）
DEFAULT_USER_ID = 1


# ========== セッション管理 ==========

@api_bp.route('/session/start', methods=['POST'])
def start_session():
    """ポモドーロセッションを開始"""
    data = request.get_json() or {}
    duration = data.get('duration', 25)
    
    session = pomodoro_service.start_session(DEFAULT_USER_ID, duration)
    return jsonify({
        'success': True,
        'session': session.to_dict()
    })


@api_bp.route('/session/<int:session_id>/complete', methods=['POST'])
def complete_session(session_id):
    """セッションを完了してXPを獲得"""
    result = pomodoro_service.complete_session(session_id)
    
    if not result:
        return jsonify({'success': False, 'error': 'Session not found'}), 404
    
    # バッジの条件をチェック
    new_badges = gamification_service.check_and_award_badges(DEFAULT_USER_ID)
    
    return jsonify({
        'success': True,
        'session': result['session'],
        'user': result['user'],
        'leveled_up': result['leveled_up'],
        'xp_earned': result['xp_earned'],
        'new_badges': [b.to_dict() for b in new_badges]
    })


@api_bp.route('/session/history', methods=['GET'])
def get_session_history():
    """セッション履歴を取得"""
    limit = request.args.get('limit', 10, type=int)
    sessions = pomodoro_service.get_user_sessions(DEFAULT_USER_ID, limit)
    return jsonify({
        'success': True,
        'sessions': sessions
    })


# ========== ゲーミフィケーション ==========

@api_bp.route('/gamification/profile', methods=['GET'])
def get_profile():
    """ユーザープロフィールを取得（XP、レベル、ストリーク）"""
    profile = gamification_service.get_user_profile(DEFAULT_USER_ID)
    return jsonify({
        'success': True,
        'profile': profile
    })


@api_bp.route('/gamification/badges', methods=['GET'])
def get_badges():
    """バッジ情報を取得"""
    badges = gamification_service.get_user_badges(DEFAULT_USER_ID)
    return jsonify({
        'success': True,
        'badges': badges
    })


# ========== 統計データ ==========

@api_bp.route('/statistics', methods=['GET'])
def get_statistics():
    """統計データを取得"""
    stats = statistics_service.get_user_statistics(DEFAULT_USER_ID)
    return jsonify({
        'success': True,
        'statistics': stats
    })


@api_bp.route('/statistics/daily', methods=['GET'])
def get_daily_activity():
    """日別アクティビティを取得"""
    days = request.args.get('days', 30, type=int)
    activity = statistics_service.get_daily_activity(DEFAULT_USER_ID, days)
    return jsonify({
        'success': True,
        'daily_activity': activity
    })


@api_bp.route('/statistics/weekly-comparison', methods=['GET'])
def get_weekly_comparison():
    """週間比較データを取得"""
    comparison = statistics_service.get_weekly_comparison(DEFAULT_USER_ID)
    return jsonify({
        'success': True,
        'comparison': comparison
    })


# ========== ヘルスチェック ==========

@api_bp.route('/health', methods=['GET'])
def health_check():
    """APIヘルスチェック"""
    return jsonify({
        'status': 'healthy',
        'service': 'Pomodoro Timer API'
    })
