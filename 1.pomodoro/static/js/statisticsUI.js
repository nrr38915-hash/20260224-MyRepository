/**
 * Statistics UI
 * 統計情報のUI制御
 */

class StatisticsUI {
    constructor() {
        this.elements = {
            weeklyCompleted: document.getElementById('weekly-completed'),
            monthlyCompleted: document.getElementById('monthly-completed'),
            totalCompleted: document.getElementById('total-completed'),
            completionRate: document.getElementById('completion-rate'),
            avgFocusTime: document.getElementById('avg-focus-time'),
            totalFocusTime: document.getElementById('total-focus-time')
        };
        
        this.chartCanvas = document.getElementById('activity-chart');
        this.chart = null;
    }

    /**
     * 統計情報を読み込んで表示
     */
    async loadStatistics() {
        try {
            const response = await fetch('/api/statistics');
            const data = await response.json();
            
            if (data.success) {
                this.displayStatistics(data.statistics);
            }
        } catch (error) {
            console.error('統計読み込みエラー:', error);
        }
    }

    /**
     * 統計情報を表示
     */
    displayStatistics(stats) {
        this.elements.weeklyCompleted.textContent = stats.weekly_completed;
        this.elements.monthlyCompleted.textContent = stats.monthly_completed;
        this.elements.totalCompleted.textContent = stats.completed_sessions;
        this.elements.completionRate.textContent = `${stats.completion_rate}%`;
        this.elements.avgFocusTime.textContent = `${stats.average_focus_minutes}分`;
        this.elements.totalFocusTime.textContent = `${stats.total_focus_minutes}分`;
    }

    /**
     * アクティビティグラフを読み込んで表示
     */
    async loadActivityChart() {
        try {
            const response = await fetch('/api/statistics/daily?days=30');
            const data = await response.json();
            
            if (data.success) {
                this.displayChart(data.daily_activity);
            }
        } catch (error) {
            console.error('グラフ読み込みエラー:', error);
        }
    }

    /**
     * グラフを表示（シンプルな棒グラフ）
     */
    displayChart(dailyActivity) {
        const ctx = this.chartCanvas.getContext('2d');
        
        // キャンバスをクリア
        ctx.clearRect(0, 0, this.chartCanvas.width, this.chartCanvas.height);
        
        // キャンバスサイズを調整
        const width = this.chartCanvas.clientWidth;
        const height = 200;
        this.chartCanvas.width = width;
        this.chartCanvas.height = height;
        
        // データの準備
        const maxCompleted = Math.max(...dailyActivity.map(d => d.completed), 1);
        const barWidth = width / dailyActivity.length;
        
        // グラデーション
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        // 棒グラフを描画
        dailyActivity.forEach((day, index) => {
            const barHeight = (day.completed / maxCompleted) * (height - 30);
            const x = index * barWidth;
            const y = height - barHeight - 10;
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
        });
        
        // 最新7日分の日付ラベルを表示
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        
        const step = Math.floor(dailyActivity.length / 7);
        for (let i = 0; i < dailyActivity.length; i += step) {
            const day = dailyActivity[i];
            const x = i * barWidth + barWidth / 2;
            const dateStr = day.date.substring(5); // MM-DD
            ctx.fillText(dateStr, x, height - 2);
        }
    }
}

// CommonJS形式でエクスポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatisticsUI;
}
