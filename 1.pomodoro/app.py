"""
Pomodoro Timer Flask Application
視覚的フィードバック強化版
"""
from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    """メインページを表示"""
    return render_template('index.html')

@app.route('/api/settings')
def get_settings():
    """タイマーの設定を返す"""
    return jsonify({
        'workDuration': 25 * 60,  # 25分（秒単位）
        'breakDuration': 5 * 60,   # 5分（秒単位）
        'longBreakDuration': 15 * 60  # 15分（秒単位）
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
