/**
 * ポモドーロタイマー - 視覚的フィードバック強化版
 * タイマーロジックとプログレスバーアニメーション
 */

class PomodoroTimer {
    constructor() {
        this.workDuration = 25 * 60; // 25分
        this.breakDuration = 5 * 60; // 5分
        this.longBreakDuration = 15 * 60; // 15分
        
        this.currentDuration = this.workDuration;
        this.timeRemaining = this.currentDuration;
        this.isRunning = false;
        this.isWorkSession = true;
        this.sessionCount = 0;
        this.intervalId = null;
        
        // DOM要素
        this.timeDisplay = document.getElementById('timeDisplay');
        this.statusDisplay = document.getElementById('statusDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.sessionCountDisplay = document.getElementById('sessionCount');
        
        // プログレスバー要素
        this.progressCircle = document.querySelector('.progress-ring-circle');
        this.gradientStart = document.querySelector('.gradient-start');
        this.gradientEnd = document.querySelector('.gradient-end');
        this.circleRadius = 140;
        this.circleCircumference = 2 * Math.PI * this.circleRadius;
        
        this.initializeEventListeners();
        this.updateDisplay();
        this.updateProgressBar(100);
    }
    
    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            document.body.classList.add('timer-running');
            
            if (this.isWorkSession) {
                this.statusDisplay.textContent = '集中時間';
            } else {
                this.statusDisplay.textContent = '休憩時間';
            }
            
            this.intervalId = setInterval(() => this.tick(), 1000);
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            document.body.classList.remove('timer-running');
            this.statusDisplay.textContent = '一時停止';
            
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
    }
    
    reset() {
        this.pause();
        this.timeRemaining = this.currentDuration;
        this.updateDisplay();
        this.updateProgressBar(100);
        this.updateGradientColor(100);
        this.statusDisplay.textContent = '準備完了';
    }
    
    tick() {
        if (this.timeRemaining > 0) {
            this.timeRemaining--;
            this.updateDisplay();
            
            // 進捗率を計算（0-100%）
            const progress = (this.timeRemaining / this.currentDuration) * 100;
            this.updateProgressBar(progress);
            this.updateGradientColor(progress);
        } else {
            this.complete();
        }
    }
    
    complete() {
        this.pause();
        
        if (this.isWorkSession) {
            this.sessionCount++;
            this.sessionCountDisplay.textContent = this.sessionCount;
            
            // 長い休憩か短い休憩かを判定
            if (this.sessionCount % 4 === 0) {
                this.currentDuration = this.longBreakDuration;
                this.statusDisplay.textContent = '完了！長い休憩をどうぞ';
            } else {
                this.currentDuration = this.breakDuration;
                this.statusDisplay.textContent = '完了！休憩しましょう';
            }
            this.isWorkSession = false;
        } else {
            this.currentDuration = this.workDuration;
            this.statusDisplay.textContent = '休憩終了！次のセッションへ';
            this.isWorkSession = true;
        }
        
        this.timeRemaining = this.currentDuration;
        this.updateDisplay();
        this.updateProgressBar(100);
        this.updateGradientColor(100);
        
        // 音声通知（オプション）
        this.playNotificationSound();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timeDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * 円形プログレスバーを更新
     * @param {number} progress - 進捗率（0-100）
     */
    updateProgressBar(progress) {
        const offset = this.circleCircumference - (progress / 100) * this.circleCircumference;
        this.progressCircle.style.strokeDashoffset = offset;
    }
    
    /**
     * 時間経過に応じてグラデーションの色を変更
     * @param {number} progress - 進捗率（0-100）
     */
    updateGradientColor(progress) {
        // プログレスバーのクラスをリセット
        this.progressCircle.classList.remove('warning', 'danger');
        
        if (progress > 50) {
            // 50-100%: 青
            this.gradientStart.style.stopColor = '#4299e1';
            this.gradientEnd.style.stopColor = '#3182ce';
        } else if (progress > 20) {
            // 20-50%: 黄色
            this.progressCircle.classList.add('warning');
            this.gradientStart.style.stopColor = '#ecc94b';
            this.gradientEnd.style.stopColor = '#d69e2e';
        } else {
            // 0-20%: 赤
            this.progressCircle.classList.add('danger');
            this.gradientStart.style.stopColor = '#fc8181';
            this.gradientEnd.style.stopColor = '#e53e3e';
        }
    }
    
    playNotificationSound() {
        // ブラウザの通知APIを使用（オプション）
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('ポモドーロタイマー', {
                body: this.isWorkSession ? '休憩終了！次のセッションを始めましょう' : 'セッション完了！休憩しましょう',
                icon: '/static/pomodoro.png'
            });
        }
    }
    
    // 設定の取得（API経由）
    async loadSettings() {
        try {
            const response = await fetch('/api/settings');
            const settings = await response.json();
            this.workDuration = settings.workDuration;
            this.breakDuration = settings.breakDuration;
            this.longBreakDuration = settings.longBreakDuration;
            this.currentDuration = this.workDuration;
            this.timeRemaining = this.currentDuration;
            this.updateDisplay();
        } catch (error) {
            console.error('設定の読み込みに失敗しました:', error);
        }
    }
}

// ページ読み込み時にタイマーを初期化
let timer;
document.addEventListener('DOMContentLoaded', () => {
    timer = new PomodoroTimer();
    timer.loadSettings();
    
    // 通知の許可をリクエスト
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

// テスト用のエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PomodoroTimer };
}
