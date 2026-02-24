/**
 * Timer UI
 * タイマーのUI制御
 */

class TimerUI {
    constructor(timer) {
        this.timer = timer;
        this.timerDisplay = document.getElementById('timer-display');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.durationSelect = document.getElementById('duration-select');

        this.initEventListeners();
    }

    /**
     * イベントリスナーを初期化
     */
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.handleStart());
        this.pauseBtn.addEventListener('click', () => this.handlePause());
        this.resetBtn.addEventListener('click', () => this.handleReset());
        this.durationSelect.addEventListener('change', (e) => this.handleDurationChange(e));

        // タイマーのコールバックを設定
        this.timer.onTick = (timeLeft) => this.updateDisplay(timeLeft);
        this.timer.onComplete = () => this.handleComplete();
    }

    /**
     * 開始ボタンのハンドラ
     */
    async handleStart() {
        if (!this.timer.sessionId) {
            // 新しいセッションを開始
            const duration = parseInt(this.durationSelect.value);
            const session = await this.startSession(duration);
            if (session) {
                this.timer.setSessionId(session.id);
            }
        }

        this.timer.start();
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.durationSelect.disabled = true;
    }

    /**
     * 一時停止ボタンのハンドラ
     */
    handlePause() {
        this.timer.pause();
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }

    /**
     * リセットボタンのハンドラ
     */
    handleReset() {
        this.timer.reset();
        this.timer.setSessionId(null);
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.durationSelect.disabled = false;
    }

    /**
     * 時間設定変更のハンドラ
     */
    handleDurationChange(event) {
        const minutes = parseInt(event.target.value);
        this.timer.setDuration(minutes);
    }

    /**
     * タイマー完了時のハンドラ
     */
    async handleComplete() {
        // セッション完了をAPIに通知
        if (this.timer.sessionId) {
            const result = await this.completeSession(this.timer.sessionId);
            if (result) {
                // レベルアップやバッジ獲得の通知
                if (result.leveled_up) {
                    showLevelUpModal(result.user.level);
                }
                if (result.new_badges && result.new_badges.length > 0) {
                    showBadgeModal(result.new_badges);
                }
                
                // プロフィールと統計を更新
                if (window.gamificationUI) {
                    window.gamificationUI.loadProfile();
                    window.gamificationUI.loadBadges();
                }
                if (window.statisticsUI) {
                    window.statisticsUI.loadStatistics();
                }
            }
        }

        // 完了通知
        alert('🎉 ポモドーロ完了！お疲れ様でした！');
        
        // リセット
        this.handleReset();
    }

    /**
     * 表示を更新
     */
    updateDisplay(timeLeft) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        this.timerDisplay.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /**
     * セッションを開始（API呼び出し）
     */
    async startSession(duration) {
        try {
            const response = await fetch('/api/session/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ duration })
            });
            const data = await response.json();
            return data.success ? data.session : null;
        } catch (error) {
            console.error('セッション開始エラー:', error);
            return null;
        }
    }

    /**
     * セッションを完了（API呼び出し）
     */
    async completeSession(sessionId) {
        try {
            const response = await fetch(`/api/session/${sessionId}/complete`, {
                method: 'POST'
            });
            const data = await response.json();
            return data.success ? data : null;
        } catch (error) {
            console.error('セッション完了エラー:', error);
            return null;
        }
    }
}

// CommonJS形式でエクスポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimerUI;
}
