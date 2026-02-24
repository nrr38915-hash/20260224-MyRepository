/**
 * Timer Core Logic
 * ポモドーロタイマーのコアロジック
 */

class TimerCore {
    constructor() {
        this.duration = 25 * 60; // 秒単位
        this.timeLeft = this.duration;
        this.isRunning = false;
        this.intervalId = null;
        this.sessionId = null;
        this.onTick = null;
        this.onComplete = null;
    }

    /**
     * タイマーを開始
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    /**
     * タイマーを一時停止
     */
    pause() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * タイマーをリセット
     */
    reset() {
        this.pause();
        this.timeLeft = this.duration;
        if (this.onTick) {
            this.onTick(this.timeLeft);
        }
    }

    /**
     * 1秒ごとの処理
     */
    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            if (this.onTick) {
                this.onTick(this.timeLeft);
            }
        } else {
            this.complete();
        }
    }

    /**
     * タイマー完了時の処理
     */
    complete() {
        this.pause();
        if (this.onComplete) {
            this.onComplete();
        }
    }

    /**
     * 時間設定を変更
     */
    setDuration(minutes) {
        this.duration = minutes * 60;
        this.timeLeft = this.duration;
        if (this.onTick) {
            this.onTick(this.timeLeft);
        }
    }

    /**
     * 残り時間を取得
     */
    getTimeLeft() {
        return this.timeLeft;
    }

    /**
     * 進捗率を取得（0-1）
     */
    getProgress() {
        return 1 - (this.timeLeft / this.duration);
    }

    /**
     * セッションIDを設定
     */
    setSessionId(id) {
        this.sessionId = id;
    }

    /**
     * セッションIDを取得
     */
    getSessionId() {
        return this.sessionId;
    }
}

// CommonJS形式でエクスポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimerCore;
}
