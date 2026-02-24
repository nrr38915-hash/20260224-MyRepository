/**
 * Main Application
 * アプリケーションのメインエントリーポイント
 */

// グローバル変数として初期化
let timer;
let timerUI;
let progressRing;
let gamificationUI;
let statisticsUI;

/**
 * アプリケーション初期化
 */
function initApp() {
    // タイマーの初期化
    timer = new TimerCore();
    timerUI = new TimerUI(timer);
    progressRing = new ProgressRing(timer);
    
    // ゲーミフィケーションUIの初期化
    gamificationUI = new GamificationUI();
    gamificationUI.loadProfile();
    gamificationUI.loadBadges();
    
    // 統計UIの初期化
    statisticsUI = new StatisticsUI();
    statisticsUI.loadStatistics();
    statisticsUI.loadActivityChart();
    
    // グローバルに公開（他のモジュールから参照できるように）
    window.gamificationUI = gamificationUI;
    window.statisticsUI = statisticsUI;
    
    console.log('🍅 ポモドーロタイマー初期化完了');
}

// DOMContentLoadedイベントで初期化
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initApp);
}

// CommonJS形式でエクスポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initApp };
}
