/**
 * Progress Ring
 * プログレスリングのアニメーション
 */

class ProgressRing {
    constructor(timer) {
        this.timer = timer;
        this.circle = document.getElementById('progress-circle');
        this.radius = 130;
        this.circumference = 2 * Math.PI * this.radius;
        
        // 初期設定
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = '0';
        
        // タイマーのコールバックに登録
        const originalOnTick = this.timer.onTick;
        this.timer.onTick = (timeLeft) => {
            if (originalOnTick) originalOnTick(timeLeft);
            this.updateProgress();
        };
    }

    /**
     * 進捗を更新
     */
    updateProgress() {
        const progress = this.timer.getProgress();
        const offset = this.circumference * (1 - progress);
        this.circle.style.strokeDashoffset = offset;
    }
}

// CommonJS形式でエクスポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressRing;
}
