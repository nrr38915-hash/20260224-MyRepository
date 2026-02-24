/**
 * Gamification UI
 * ゲーミフィケーション要素のUI制御
 */

class GamificationUI {
    constructor() {
        this.profileElements = {
            username: document.getElementById('username'),
            level: document.getElementById('user-level'),
            xpProgress: document.getElementById('xp-progress'),
            xpText: document.getElementById('xp-text'),
            streakCount: document.getElementById('streak-count')
        };
        
        this.badgesGrid = document.getElementById('badges-grid');
    }

    /**
     * プロフィールを読み込んで表示
     */
    async loadProfile() {
        try {
            const response = await fetch('/api/gamification/profile');
            const data = await response.json();
            
            if (data.success) {
                this.displayProfile(data.profile);
            }
        } catch (error) {
            console.error('プロフィール読み込みエラー:', error);
        }
    }

    /**
     * プロフィールを表示
     */
    displayProfile(profile) {
        this.profileElements.username.textContent = profile.username;
        this.profileElements.level.textContent = `Lv. ${profile.level}`;
        this.profileElements.streakCount.textContent = profile.current_streak;
        
        // XPバーの更新
        const progressPercent = profile.xp_progress_percentage || 0;
        this.profileElements.xpProgress.style.width = `${progressPercent}%`;
        
        // XPテキストの更新
        const currentLevelXP = profile.xp - ((profile.level - 1) * 100);
        this.profileElements.xpText.textContent = 
            `${currentLevelXP} / ${profile.xp_for_next_level} XP`;
    }

    /**
     * バッジを読み込んで表示
     */
    async loadBadges() {
        try {
            const response = await fetch('/api/gamification/badges');
            const data = await response.json();
            
            if (data.success) {
                this.displayBadges(data.badges);
            }
        } catch (error) {
            console.error('バッジ読み込みエラー:', error);
        }
    }

    /**
     * バッジを表示
     */
    displayBadges(badgesData) {
        this.badgesGrid.innerHTML = '';
        
        const allBadges = [...badgesData.earned, ...badgesData.not_earned];
        
        allBadges.forEach(badge => {
            const isEarned = badgesData.earned.some(b => b.id === badge.id);
            const badgeElement = this.createBadgeElement(badge, isEarned);
            this.badgesGrid.appendChild(badgeElement);
        });
    }

    /**
     * バッジ要素を作成
     */
    createBadgeElement(badge, isEarned) {
        const div = document.createElement('div');
        div.className = `badge-item ${isEarned ? 'earned' : 'not-earned'}`;
        div.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-description">${badge.description}</div>
        `;
        return div;
    }
}

/**
 * レベルアップモーダルを表示
 */
function showLevelUpModal(level) {
    const modal = document.getElementById('level-up-modal');
    const levelSpan = document.getElementById('new-level');
    levelSpan.textContent = level;
    modal.classList.add('show');
}

/**
 * レベルアップモーダルを閉じる
 */
function closeLevelUpModal() {
    const modal = document.getElementById('level-up-modal');
    modal.classList.remove('show');
}

/**
 * バッジ獲得モーダルを表示
 */
function showBadgeModal(badges) {
    const modal = document.getElementById('badge-modal');
    const badgeList = document.getElementById('badge-list');
    
    badgeList.innerHTML = '';
    badges.forEach(badge => {
        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'badge-earned-item';
        badgeDiv.innerHTML = `
            <div class="badge-earned-icon">${badge.icon}</div>
            <div class="badge-earned-info">
                <div class="badge-earned-name">${badge.name}</div>
                <div class="badge-earned-desc">${badge.description}</div>
            </div>
        `;
        badgeList.appendChild(badgeDiv);
    });
    
    modal.classList.add('show');
}

/**
 * バッジモーダルを閉じる
 */
function closeBadgeModal() {
    const modal = document.getElementById('badge-modal');
    modal.classList.remove('show');
}

// CommonJS形式でエクスポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GamificationUI, showLevelUpModal, closeLevelUpModal, showBadgeModal, closeBadgeModal };
}
