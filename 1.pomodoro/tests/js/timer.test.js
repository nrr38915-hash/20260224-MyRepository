/**
 * タイマー機能のユニットテスト
 */

// timer.js をインポート
const {
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
} = require('../../static/js/timer.js');

describe('Pomodoro Timer', () => {
    
    beforeEach(() => {
        // 各テストの前にタイマーをリセット
        jest.clearAllTimers();
        jest.useFakeTimers();
    });

    afterEach(() => {
        // 各テストの後にタイマーをクリーンアップ
        const timer = getTimer();
        if (timer) {
            clearInterval(timer);
        }
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    describe('updateDisplay', () => {
        test('時間が正しくフォーマットされる（25分）', () => {
            setTimeLeft(25 * 60);
            const display = updateDisplay();
            expect(display).toBe('25:00');
        });

        test('時間が正しくフォーマットされる（1桁の分と秒）', () => {
            setTimeLeft(5 * 60 + 3); // 5分3秒
            const display = updateDisplay();
            expect(display).toBe('05:03');
        });

        test('0秒が正しく表示される', () => {
            setTimeLeft(0);
            const display = updateDisplay();
            expect(display).toBe('00:00');
        });

        test('59秒が正しく表示される', () => {
            setTimeLeft(59);
            const display = updateDisplay();
            expect(display).toBe('00:59');
        });
    });

    describe('countdown', () => {
        test('カウントダウンで1秒減る', () => {
            setTimeLeft(25 * 60);
            countdown();
            expect(getTimeLeft()).toBe(25 * 60 - 1);
        });

        test('0秒の時にカウントダウンすると状態遷移が発生する', () => {
            // alert をモック
            global.alert = jest.fn();
            
            resetTimer();
            setTimeLeft(0);
            const prevState = getCurrentState();
            countdown();
            // 状態遷移が発生するため、timeLeftは新しい状態の時間になる
            expect(getCurrentState()).not.toBe(prevState);
        });

        test('1秒から0秒にカウントダウンできる', () => {
            setTimeLeft(1);
            countdown();
            expect(getTimeLeft()).toBe(0);
        });
    });

    describe('startTimer', () => {
        test('タイマーが開始される', () => {
            const timer = startTimer();
            expect(timer).not.toBeNull();
            expect(getTimer()).not.toBeNull();
            expect(getIsRunning()).toBe(true);
        });

        test('タイマーが既に動作中の場合、状態は変わらない', () => {
            startTimer();
            expect(getIsRunning()).toBe(true);
            const timer1 = getTimer();
            startTimer();
            expect(getIsRunning()).toBe(true);
            expect(getTimer()).toBe(timer1);
        });
    });

    describe('stopTimer', () => {
        test('タイマーが停止される', () => {
            startTimer();
            expect(getIsRunning()).toBe(true);
            stopTimer();
            expect(getIsRunning()).toBe(false);
            expect(getTimer()).toBeNull();
        });

        test('停止中のタイマーをもう一度停止しても問題ない', () => {
            stopTimer();
            expect(getIsRunning()).toBe(false);
            stopTimer();
            expect(getIsRunning()).toBe(false);
        });
    });

    describe('resetTimer', () => {
        test('タイマーが初期状態（ポモドーロ・25分）にリセットされる', () => {
            setTimeLeft(100);
            setCurrentState(TIMER_STATES.SHORT_BREAK);
            resetTimer();
            expect(getTimeLeft()).toBe(TIMER_DURATIONS[TIMER_STATES.POMODORO]);
            expect(getCurrentState()).toBe(TIMER_STATES.POMODORO);
        });

        test('動作中のタイマーが停止される', () => {
            startTimer();
            expect(getTimer()).not.toBeNull();
            resetTimer();
            expect(getTimer()).toBeNull();
            expect(getIsRunning()).toBe(false);
        });

        test('0秒からポモドーロ状態にリセットできる', () => {
            setTimeLeft(0);
            resetTimer();
            expect(getTimeLeft()).toBe(TIMER_DURATIONS[TIMER_STATES.POMODORO]);
            expect(getCurrentState()).toBe(TIMER_STATES.POMODORO);
        });
    });

    describe('getTimeLeft と setTimeLeft', () => {
        test('setTimeLeft で設定した値が getTimeLeft で取得できる', () => {
            setTimeLeft(600);
            expect(getTimeLeft()).toBe(600);
        });

        test('様々な秒数を設定できる', () => {
            const testValues = [0, 1, 60, 300, 1500, 3600];
            testValues.forEach(value => {
                setTimeLeft(value);
                expect(getTimeLeft()).toBe(value);
            });
        });
    });

    describe('状態管理', () => {
        test('初期状態はポモドーロ（作業中）', () => {
            resetTimer();
            expect(getCurrentState()).toBe(TIMER_STATES.POMODORO);
        });

        test('状態を変更できる', () => {
            setCurrentState(TIMER_STATES.SHORT_BREAK);
            expect(getCurrentState()).toBe(TIMER_STATES.SHORT_BREAK);
            expect(getTimeLeft()).toBe(TIMER_DURATIONS[TIMER_STATES.SHORT_BREAK]);
        });

        test('各状態の時間が正しく設定される', () => {
            setCurrentState(TIMER_STATES.POMODORO);
            expect(getTimeLeft()).toBe(25 * 60);

            setCurrentState(TIMER_STATES.SHORT_BREAK);
            expect(getTimeLeft()).toBe(5 * 60);

            setCurrentState(TIMER_STATES.LONG_BREAK);
            expect(getTimeLeft()).toBe(15 * 60);
        });

        test('状態ラベルが定義されている', () => {
            expect(STATE_LABELS[TIMER_STATES.POMODORO]).toBe('作業中');
            expect(STATE_LABELS[TIMER_STATES.SHORT_BREAK]).toBe('短い休憩');
            expect(STATE_LABELS[TIMER_STATES.LONG_BREAK]).toBe('長い休憩');
        });
    });

    describe('skipTimer', () => {
        test('スキップ時にタイマーが停止される', () => {
            startTimer();
            expect(getIsRunning()).toBe(true);
            
            // alert をモック
            global.alert = jest.fn();
            
            skipTimer();
            expect(getIsRunning()).toBe(false);
        });
    });

    describe('統合テスト', () => {
        beforeEach(() => {
            // alert をモック
            global.alert = jest.fn();
        });

        test('タイマーの完全なサイクル: 開始 -> カウントダウン -> リセット', () => {
            // 初期状態
            resetTimer();
            expect(getTimeLeft()).toBe(TIMER_DURATIONS[TIMER_STATES.POMODORO]);
            expect(getCurrentState()).toBe(TIMER_STATES.POMODORO);

            // タイマー開始
            startTimer();
            expect(getTimer()).not.toBeNull();
            expect(getIsRunning()).toBe(true);

            // カウントダウン
            countdown();
            expect(getTimeLeft()).toBe(TIMER_DURATIONS[TIMER_STATES.POMODORO] - 1);

            // 停止
            stopTimer();
            expect(getIsRunning()).toBe(false);

            // リセット
            resetTimer();
            expect(getTimeLeft()).toBe(TIMER_DURATIONS[TIMER_STATES.POMODORO]);
            expect(getTimer()).toBeNull();
        });

        test('短い時間でのカウントダウン完了', () => {
            setTimeLeft(3);
            
            countdown(); // 2秒
            expect(getTimeLeft()).toBe(2);
            
            countdown(); // 1秒
            expect(getTimeLeft()).toBe(1);
            
            countdown(); // 0秒 - 状態遷移が発生
            expect(getTimeLeft()).toBe(0);
        });

        test('ポモドーロ完了後の状態遷移（短い休憩）', () => {
            resetTimer();
            expect(getCurrentState()).toBe(TIMER_STATES.POMODORO);
            
            // 1秒に設定してカウントダウン
            setTimeLeft(1);
            countdown(); // 0秒になる
            
            // もう一度countdownを呼んで状態遷移をトリガー
            const initialPomodoros = getCompletedPomodoros();
            countdown(); // 完了して短い休憩に遷移
            
            // 状態が短い休憩に変わり、時間がリセットされる
            expect(getCurrentState()).toBe(TIMER_STATES.SHORT_BREAK);
            expect(getTimeLeft()).toBe(TIMER_DURATIONS[TIMER_STATES.SHORT_BREAK]);
            expect(getCompletedPomodoros()).toBe(initialPomodoros + 1);
        });
    });
});
