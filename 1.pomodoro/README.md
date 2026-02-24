# ポモドーロタイマー - ゲーミフィケーション機能

ゲーミフィケーション要素を取り入れたポモドーロタイマーアプリケーションです。

## 機能

### ✅ 実装済み機能

#### 🍅 ポモドーロタイマー
- 25分/15分/45分のタイマー設定
- 開始・一時停止・リセット機能
- プログレスリングによる視覚的なフィードバック

#### ⭐ ゲーミフィケーション
- **経験値システム**: ポモドーロ完了ごとにXP獲得
- **レベルシステム**: 100 XPごとにレベルアップ
- **ストリーク機能**: 連続達成日数のカウント
- **バッジシステム**: 6種類の実績バッジ

#### 📊 統計機能
- 週間/月間/総完了数
- 完了率の表示
- 平均・総集中時間
- 過去30日間のアクティビティグラフ

## スクリーンショット

### 初期状態
![初期状態](https://github.com/user-attachments/assets/b34d77db-9a17-4454-8cab-ad048d31a60e)

### 進捗表示（レベル3達成）
![進捗表示](https://github.com/user-attachments/assets/ea166613-f47e-40ef-8f5f-20c0ec971730)

## セットアップ

### 必要な環境
- Python 3.12以上
- pip

### インストール

```bash
cd 1.pomodoro
pip install -r requirements.txt
```

### 起動

```bash
python app.py
```

アプリケーションは http://localhost:5000 で起動します。

## テスト

### 全テスト実行
```bash
pip install -r requirements-dev.txt
pytest
```

### ユニットテストのみ
```bash
pytest tests/unit/
```

### 統合テストのみ
```bash
pytest tests/integration/
```

### カバレッジレポート
```bash
pytest --cov=. --cov-report=html
```

## プロジェクト構造

```
1.pomodoro/
├── app.py                  # Flask アプリケーション
├── models/                 # データモデル
│   ├── user.py            # ユーザーモデル
│   ├── session.py         # セッションモデル
│   ├── badge.py           # バッジモデル
│   └── statistics.py      # 統計モデル
├── repositories/           # データアクセス層
│   ├── database.py        # DB初期化
│   ├── user_repository.py
│   ├── session_repository.py
│   └── badge_repository.py
├── services/               # ビジネスロジック層
│   ├── pomodoro_service.py
│   ├── gamification_service.py
│   └── statistics_service.py
├── routes/                 # APIルート
│   └── api.py
├── static/                 # フロントエンド
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── timerCore.js
│       ├── timerUI.js
│       ├── progressRing.js
│       ├── gamificationUI.js
│       ├── statisticsUI.js
│       └── main.js
├── templates/              # HTMLテンプレート
│   └── index.html
├── tests/                  # テスト
│   ├── unit/
│   └── integration/
├── architecture.md         # アーキテクチャドキュメント
├── features.md            # 機能仕様書
└── requirements.txt       # Python依存関係
```

## 技術スタック

- **バックエンド**: Python Flask, SQLite
- **フロントエンド**: HTML, Vanilla JavaScript, CSS
- **テスト**: pytest

## バッジ一覧

| バッジ | 条件 |
|-------|------|
| 🔥 3日連続達成 | 3日連続でポモドーロを完了 |
| ⭐ 1週間連続達成 | 7日連続でポモドーロを完了 |
| 🎯 今週10回完了 | 今週10回のポモドーロを完了 |
| 💎 今週20回完了 | 今週20回のポモドーロを完了 |
| 🏆 合計50回完了 | 累計50回のポモドーロを完了 |
| 👑 合計100回完了 | 累計100回のポモドーロを完了 |

## ライセンス

MIT License
