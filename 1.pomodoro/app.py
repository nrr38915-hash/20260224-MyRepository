"""Pomodoro Timer Flask Application with Gamification Features."""

import os
from flask import Flask, render_template, jsonify, request
from repositories.database import init_db
from routes.api import api_bp


def create_app():
    """Flask アプリケーションファクトリ"""
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # データベースを初期化
    with app.app_context():
        init_db()
    
    # ブループリントを登録
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # メインページ
    @app.route('/')
    def index():
        return render_template('index.html')
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
