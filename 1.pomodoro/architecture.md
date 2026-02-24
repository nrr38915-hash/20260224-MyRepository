# ポモドーロタイマー アーキテクチャ

## 概要
このポモドーロタイマーアプリケーションは、ゲーミフィケーション要素を取り入れた集中時間管理ツールです。経験値（XP）、レベル、バッジ、ストリーク、統計情報を通じて、ユーザーのモチベーション維持と継続利用を促進します。

## アーキテクチャパターン

### レイヤー構造
アプリケーションは3層アーキテクチャを採用しています：

```
┌─────────────────────────────────────────┐
│         プレゼンテーション層              │
│    (HTML/JavaScript/CSS)                 │
│  - タイマーUI                            │
│  - ゲーミフィケーションUI                │
│  - 統計UI                                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           サービス層                     │
│    (Business Logic)                      │
│  - PomodoroService                       │
│  - GamificationService                   │
│  - StatisticsService                     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         リポジトリ層                      │
│    (Data Access)                         │
│  - UserRepository                        │
│  - SessionRepository                     │
│  - BadgeRepository                       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          データベース                     │
│         (SQLite)                         │
└─────────────────────────────────────────┘
```

## コンポーネント詳細

### バックエンド (Python Flask)

#### 1. データモデル (`models/`)
- **User**: ユーザープロフィール（XP、レベル、ストリーク管理）
- **PomodoroSession**: ポモドーロセッションの記録
- **Badge**: バッジ定義
- **UserBadge**: ユーザーが取得したバッジ
- **Statistics**: 統計情報

#### 2. リポジトリ層 (`repositories/`)
データアクセスパターンを実装し、データベース操作を抽象化：
- **UserRepository**: ユーザーデータのCRUD操作
- **SessionRepository**: セッションデータのCRUD操作、期間フィルタリング
- **BadgeRepository**: バッジデータの管理

#### 3. サービス層 (`services/`)
ビジネスロジックを実装：
- **PomodoroService**: セッション管理、XP計算、ストリーク更新
- **GamificationService**: バッジ条件判定、レベルアップ処理
- **StatisticsService**: 統計データの集計と計算

#### 4. API層 (`routes/`)
RESTful APIエンドポイントを提供：
- `/api/session/*`: セッション管理
- `/api/gamification/*`: ゲーミフィケーションデータ
- `/api/statistics/*`: 統計データ

### フロントエンド (JavaScript)

#### モジュール構成
- **timerCore.js**: タイマーのコアロジック（時間管理、状態管理）
- **timerUI.js**: タイマーUI制御、ボタンイベント処理
- **progressRing.js**: プログレスリングのアニメーション
- **gamificationUI.js**: ゲーミフィケーション要素の表示
- **statisticsUI.js**: 統計グラフと数値の表示
- **main.js**: アプリケーションの初期化とグローバル設定

## データフロー

### セッション完了フロー
```
1. ユーザーがタイマーを開始
   ↓
2. TimerUI → API: POST /api/session/start
   ↓
3. PomodoroService: 新しいセッションを作成
   ↓
4. タイマー終了時
   ↓
5. TimerUI → API: POST /api/session/{id}/complete
   ↓
6. PomodoroService: XP計算、ストリーク更新
   ↓
7. GamificationService: バッジ条件チェック
   ↓
8. レスポンス: {session, user, leveled_up, new_badges}
   ↓
9. UI更新: レベルアップ通知、バッジ獲得通知
```

## ゲーミフィケーション設計

### XPシステム
- **基本XP**: ポモドーロ時間 × 2 (25分 = 50 XP)
- **レベル計算**: XP ÷ 100（切り捨て）+ 1
- **次レベルまでのXP**: 現在のレベル × 100

### バッジシステム
定義済みバッジ：
1. **3日連続達成** 🔥 - 3日連続でポモドーロ完了
2. **1週間連続達成** ⭐ - 7日連続でポモドーロ完了
3. **今週10回完了** 🎯 - 今週10回のポモドーロ完了
4. **今週20回完了** 💎 - 今週20回のポモドーロ完了
5. **合計50回完了** 🏆 - 累計50回のポモドーロ完了
6. **合計100回完了** 👑 - 累計100回のポモドーロ完了

### ストリークシステム
- 連続達成日数をカウント
- 同日の複数セッションはカウントしない
- 最長ストリークを記録

## データベーススキーマ

### users テーブル
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_session_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

### sessions テーブル
```sql
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    completed BOOLEAN DEFAULT 0,
    started_at TEXT DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT,
    xp_earned INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
)
```

### user_badges テーブル
```sql
CREATE TABLE user_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    badge_id TEXT NOT NULL,
    earned_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id, badge_id)
)
```

## セキュリティ考慮事項

1. **入力検証**: すべてのAPI入力を検証
2. **SQLインジェクション対策**: パラメータ化クエリを使用
3. **XSS対策**: ユーザー入力のエスケープ処理
4. **認証**: 現在はシングルユーザー、将来的に認証機能追加予定

## パフォーマンス最適化

1. **データベースインデックス**: user_id、created_at等にインデックス推奨
2. **キャッシング**: 統計データの一時キャッシュ検討
3. **非同期処理**: 重い計算処理の非同期化検討

## 拡張性

### 今後の拡張案
1. **マルチユーザー対応**: 認証システムの追加
2. **カスタムバッジ**: ユーザー定義バッジ
3. **チーム機能**: グループでの競争・協力
4. **外部連携**: カレンダー連携、通知システム
5. **データエクスポート**: CSV/JSON形式でのデータエクスポート

## 技術スタック

- **バックエンド**: Python 3.12, Flask 3.0
- **データベース**: SQLite3
- **フロントエンド**: HTML5, Vanilla JavaScript, CSS3
- **テスト**: pytest, pytest-cov

## デプロイメント

### 開発環境
```bash
pip install -r requirements.txt
python app.py
```

### プロダクション環境
- WSGI サーバー（Gunicorn等）の使用を推奨
- 環境変数での設定管理
- データベースバックアップの自動化
