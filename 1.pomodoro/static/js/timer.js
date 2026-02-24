// timer.js

// タイマー状態の定義
const TIMER_STATES = {
    POMODORO: 'pomodoro',
    SHORT_BREAK: 'short_break',
    LONG_BREAK: 'long_break'
};

// 各状態の時間設定（秒）
const TIMER_DURATIONS = {
    [TIMER_STATES.POMODORO]: 25 * 60,       // 25分
    [TIMER_STATES.SHORT_BREAK]: 5 * 60,     // 5分
    [TIMER_STATES.LONG_BREAK]: 15 * 60      // 15分
};

// 状態の表示名
const STATE_LABELS = {
    [TIMER_STATES.POMODORO]: '作業中',
    [TIMER_STATES.SHORT_BREAK]: '短い休憩',
    [TIMER_STATES.LONG_BREAK]: '長い休憩'
};

// タイマーの状態
let timer = null;
let timeLeft = TIMER_DURATIONS[TIMER_STATES.POMODORO];
let currentState = TIMER_STATES.POMODORO;
let isRunning = false;
let completedPomodoros = 0;
let totalFocusedTime = 0; // 分単位

// DOM要素の取得（テスト環境では存在しない可能性がある）
const display = typeof document !== 'undefined' ? document.getElementById('timer-display') : null;
const startBtn = typeof document !== 'undefined' ? document.getElementById('start-btn') : null;
const resetBtn = typeof document !== 'undefined' ? document.getElementById('reset-btn') : null;
const skipBtn = typeof document !== 'undefined' ? document.getElementById('skip-btn') : null;
const statusDisplay = typeof document !== 'undefined' ? document.getElementById('status-display') : null;
const progressCircle = typeof document !== 'undefined' ? document.getElementById('progress-circle') : null;
const completedCountEl = typeof document !== 'undefined' ? document.getElementById('completed-count') : null;
const focusedTimeEl = typeof document !== 'undefined' ? document.getElementById('focused-time') : null;

// 円形プログレスバーの設定
const circleRadius = 120;
const circleCircumference = 2 * Math.PI * circleRadius;

if (progressCircle) {
    progressCircle.style.strokeDasharray = circleCircumference;
    progressCircle.style.strokeDashoffset = 0;
}

// 表示を更新
function updateDisplay() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const sec = String(timeLeft % 60).padStart(2, '0');
    if (display) {
        display.textContent = `${min}:${sec}`;
    }
    return `${min}:${sec}`;
}

// 状態表示を更新
function updateStatusDisplay() {
    if (statusDisplay) {
        statusDisplay.textContent = STATE_LABELS[currentState];
    }
}

// 円形プログレスバーを更新
function updateProgressBar() {
    if (!progressCircle) return;
    
    const maxDuration = TIMER_DURATIONS[currentState];
    const progress = timeLeft / maxDuration;
    const offset = circleCircumference * (1 - progress);
    
    progressCircle.style.strokeDashoffset = offset;
}

// 進捗統計を更新
function updateProgressStats() {
    if (completedCountEl) {
        completedCountEl.textContent = completedPomodoros;
    }
    if (focusedTimeEl) {
        focusedTimeEl.textContent = `${totalFocusedTime}分`;
    }
}

// すべての表示を更新
function updateAllDisplays() {
    updateDisplay();
    updateStatusDisplay();
    updateProgressBar();
    updateProgressStats();
}

// カウントダウン処理
function countdown() {
    if (timeLeft > 0) {
        timeLeft--;
        updateAllDisplays();
    } else {
        // タイマー終了
        onTimerComplete();
    }
}

// タイマー終了時の処理
function onTimerComplete() {
    clearInterval(timer);
    timer = null;
    isRunning = false;
    
    // 通知を表示
    showNotification();
    
    // ポモドーロが完了した場合、統計を更新
    if (currentState === TIMER_STATES.POMODORO) {
        completedPomodoros++;
        totalFocusedTime += 25;
        updateProgressStats();
    }
    
    // 次の状態に遷移
    transitionToNextState();
    
    // ボタンのラベルを更新
    updateStartButtonLabel();
}

// 次の状態に遷移
function transitionToNextState() {
    if (currentState === TIMER_STATES.POMODORO) {
        // ポモドーロ完了後、4回目なら長い休憩、それ以外は短い休憩
        if (completedPomodoros % 4 === 0) {
            currentState = TIMER_STATES.LONG_BREAK;
        } else {
            currentState = TIMER_STATES.SHORT_BREAK;
        }
    } else {
        // 休憩後は作業に戻る
        currentState = TIMER_STATES.POMODORO;
    }
    
    timeLeft = TIMER_DURATIONS[currentState];
    updateAllDisplays();
}

// タイマーを開始
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(countdown, 1000);
        updateStartButtonLabel();
    }
    return timer;
}

// タイマーを停止
function stopTimer() {
    if (isRunning) {
        clearInterval(timer);
        timer = null;
        isRunning = false;
        updateStartButtonLabel();
    }
}

// タイマーをリセット
function resetTimer() {
    stopTimer();
    currentState = TIMER_STATES.POMODORO;
    timeLeft = TIMER_DURATIONS[currentState];
    updateAllDisplays();
}

// スキップ機能
function skipTimer() {
    stopTimer();
    onTimerComplete();
}

// 通知を表示
function showNotification() {
    const message = currentState === TIMER_STATES.POMODORO 
        ? 'ポモドーロ完了！休憩しましょう。' 
        : '休憩終了！作業を再開しましょう。';
    
    // ブラウザ通知
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('ポモドーロタイマー', { body: message });
    } else {
        // アラート通知
        if (typeof alert !== 'undefined') {
            alert(message);
        }
    }
    
    // 音声通知（オプション・後で追加可能）
    playNotificationSound();
}

// 通知音を再生（ビープ音を生成）
function playNotificationSound() {
    if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') {
        return;
    }
    
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio notification not available');
    }
}

// 開始ボタンのラベルを更新
function updateStartButtonLabel() {
    if (startBtn) {
        startBtn.textContent = isRunning ? '停止' : '開始';
    }
}

// ブラウザ通知の許可を要求
function requestNotificationPermission() {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// テスト用ゲッター
function getTimeLeft() {
    return timeLeft;
}

function setTimeLeft(seconds) {
    timeLeft = seconds;
    updateAllDisplays();
}

function getTimer() {
    return timer;
}

function getCurrentState() {
    return currentState;
}

function setCurrentState(state) {
    currentState = state;
    timeLeft = TIMER_DURATIONS[state];
    updateAllDisplays();
}

function getIsRunning() {
    return isRunning;
}

function getCompletedPomodoros() {
    return completedPomodoros;
}

// ブラウザ環境でのイベントリスナー設定
if (startBtn) {
    startBtn.addEventListener('click', () => {
        if (isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', resetTimer);
}

if (skipBtn) {
    skipBtn.addEventListener('click', skipTimer);
}

// 初期化
if (display) {
    updateAllDisplays();
    requestNotificationPermission();
}

// テスト用にエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateDisplay,
        countdown,
        startTimer,
        stopTimer,
        resetTimer,
        skipTimer,
        getTimeLeft,
        setTimeLeft,
        getTimer,
        getCurrentState,
        setCurrentState,
        getIsRunning,
        getCompletedPomodoros,
        TIMER_STATES,
        TIMER_DURATIONS,
        STATE_LABELS
    };
}

