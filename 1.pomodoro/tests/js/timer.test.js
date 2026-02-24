/**
 * PomodoroTimer ユニットテスト
 */

// モックDOM環境をセットアップ
const setupMockDOM = () => {
    document.body.innerHTML = `
        <div id="timeDisplay">25:00</div>
        <div id="statusDisplay">準備完了</div>
        <button id="startBtn">開始</button>
        <button id="pauseBtn">一時停止</button>
        <button id="resetBtn">リセット</button>
        <div id="sessionCount">0</div>
        <svg class="progress-ring">
            <circle class="progress-ring-circle" cx="150" cy="150" r="140"></circle>
        </svg>
        <defs>
            <linearGradient id="progressGradient">
                <stop class="gradient-start"></stop>
                <stop class="gradient-end"></stop>
            </linearGradient>
        </defs>
    `;
};

describe('PomodoroTimer', () => {
    let timer;
    
    beforeEach(() => {
        setupMockDOM();
        jest.useFakeTimers();
        const { PomodoroTimer } = require('../../static/js/timer.js');
        timer = new PomodoroTimer();
    });
    
    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });
    
    describe('初期化', () => {
        test('初期状態が正しく設定される', () => {
            expect(timer.workDuration).toBe(25 * 60);
            expect(timer.breakDuration).toBe(5 * 60);
            expect(timer.timeRemaining).toBe(25 * 60);
            expect(timer.isRunning).toBe(false);
            expect(timer.isWorkSession).toBe(true);
            expect(timer.sessionCount).toBe(0);
        });
        
        test('時間表示が正しく初期化される', () => {
            const timeDisplay = document.getElementById('timeDisplay');
            expect(timeDisplay.textContent).toBe('25:00');
        });
    });
    
    describe('タイマーの開始', () => {
        test('start()でタイマーが開始される', () => {
            timer.start();
            expect(timer.isRunning).toBe(true);
            expect(timer.startBtn.disabled).toBe(true);
            expect(timer.pauseBtn.disabled).toBe(false);
        });
        
        test('タイマー開始時にステータスが更新される', () => {
            timer.start();
            expect(timer.statusDisplay.textContent).toBe('集中時間');
        });
    });
    
    describe('タイマーの一時停止', () => {
        test('pause()でタイマーが停止される', () => {
            timer.start();
            timer.pause();
            expect(timer.isRunning).toBe(false);
            expect(timer.startBtn.disabled).toBe(false);
            expect(timer.pauseBtn.disabled).toBe(true);
        });
        
        test('一時停止時にステータスが更新される', () => {
            timer.start();
            timer.pause();
            expect(timer.statusDisplay.textContent).toBe('一時停止');
        });
    });
    
    describe('タイマーのリセット', () => {
        test('reset()でタイマーが初期状態に戻る', () => {
            timer.start();
            jest.advanceTimersByTime(10000); // 10秒経過
            timer.reset();
            
            expect(timer.isRunning).toBe(false);
            expect(timer.timeRemaining).toBe(timer.currentDuration);
            expect(timer.statusDisplay.textContent).toBe('準備完了');
        });
    });
    
    describe('タイマーのカウントダウン', () => {
        test('1秒ごとに時間が減少する', () => {
            timer.start();
            const initialTime = timer.timeRemaining;
            
            jest.advanceTimersByTime(1000);
            expect(timer.timeRemaining).toBe(initialTime - 1);
            
            jest.advanceTimersByTime(1000);
            expect(timer.timeRemaining).toBe(initialTime - 2);
        });
        
        test('時間表示が正しく更新される', () => {
            timer.timeRemaining = 65; // 1:05
            timer.updateDisplay();
            expect(timer.timeDisplay.textContent).toBe('01:05');
            
            timer.timeRemaining = 5; // 0:05
            timer.updateDisplay();
            expect(timer.timeDisplay.textContent).toBe('00:05');
        });
    });
    
    describe('セッションの完了', () => {
        test('作業セッション完了後に休憩モードに切り替わる', () => {
            timer.timeRemaining = 1;
            timer.start();
            
            jest.advanceTimersByTime(1000); // 1秒経過：timeRemainingが0になる
            jest.advanceTimersByTime(1000); // もう1秒経過：complete()が呼ばれる
            
            expect(timer.isWorkSession).toBe(false);
            expect(timer.sessionCount).toBe(1);
            expect(timer.currentDuration).toBe(timer.breakDuration);
        });
        
        test('4セッション後に長い休憩になる', () => {
            // 3セッション完了
            for (let i = 0; i < 3; i++) {
                timer.timeRemaining = 1;
                timer.isWorkSession = true;
                timer.currentDuration = timer.workDuration;
                timer.start();
                jest.advanceTimersByTime(2000); // 完了まで待つ
                timer.pause();
            }
            
            // 4セッション目完了
            timer.timeRemaining = 1;
            timer.isWorkSession = true;
            timer.currentDuration = timer.workDuration;
            timer.start();
            jest.advanceTimersByTime(2000);
            
            expect(timer.sessionCount).toBe(4);
            expect(timer.currentDuration).toBe(timer.longBreakDuration);
        });
    });
    
    describe('プログレスバーの更新', () => {
        test('updateProgressBar()が正しく動作する', () => {
            const progressCircle = timer.progressCircle;
            
            timer.updateProgressBar(100);
            expect(progressCircle.style.strokeDashoffset).toBe('0');
            
            timer.updateProgressBar(50);
            const expectedOffset = timer.circleCircumference * 0.5;
            expect(parseFloat(progressCircle.style.strokeDashoffset)).toBeCloseTo(expectedOffset, 1);
            
            timer.updateProgressBar(0);
            expect(parseFloat(progressCircle.style.strokeDashoffset)).toBeCloseTo(timer.circleCircumference, 1);
        });
    });
    
    describe('グラデーションの色変化', () => {
        test('進捗率に応じて色が変化する', () => {
            // 100%→50%: 青
            timer.updateGradientColor(75);
            expect(timer.gradientStart.style.stopColor).toBe('rgb(66, 153, 225)');
            
            // 50%→20%: 黄色
            timer.updateGradientColor(35);
            expect(timer.gradientStart.style.stopColor).toBe('rgb(236, 201, 75)');
            
            // 20%→0%: 赤
            timer.updateGradientColor(10);
            expect(timer.gradientStart.style.stopColor).toBe('rgb(252, 129, 129)');
        });
        
        test('プログレスバーにクラスが適切に追加される', () => {
            const progressCircle = timer.progressCircle;
            
            timer.updateGradientColor(75);
            expect(progressCircle.classList.contains('warning')).toBe(false);
            expect(progressCircle.classList.contains('danger')).toBe(false);
            
            timer.updateGradientColor(35);
            expect(progressCircle.classList.contains('warning')).toBe(true);
            
            timer.updateGradientColor(10);
            expect(progressCircle.classList.contains('danger')).toBe(true);
        });
    });
});
