# Pomodoro Timer

シンプルで使いやすい Pomodoro タイマーアプリケーションです。

## 機能

- ⏱️ 25分のカウントダウンタイマー
- ▶️ 開始/停止機能
- 🔄 リセット機能
- 🎨 クリーンで見やすい UI

## 技術スタック

- **バックエンド**: Flask (Python)
- **フロントエンド**: HTML, CSS, JavaScript
- **テスト**: pytest, Jest

## セットアップ

### 1. 依存関係のインストール

#### Python 依存関係

```bash
pip install -r requirements.txt
```

#### JavaScript 依存関係（テスト用）

```bash
npm install
```

### 2. アプリケーションの起動

```bash
python app.py
```

ブラウザで `http://localhost:5000` を開いてください。

## テスト

このプロジェクトには包括的なユニットテストが実装されています。

### Python テスト

Flask アプリケーションのテストを実行：

```bash
python -m pytest -v
```

### JavaScript テスト

タイマー機能のテストを実行：

```bash
npm test
```

### テストの詳細

テストの詳細については、[tests/README.md](tests/README.md) を参照してください。

## プロジェクト構成

```
1.pomodoro/
├── app.py                      # Flask アプリケーション
├── requirements.txt            # Python 依存関係
├── requirements-dev.txt        # 開発・テスト用依存関係
├── package.json                # Node.js 設定
├── static/
│   ├── css/
│   │   └── style.css          # スタイルシート
│   └── js/
│       └── timer.js           # タイマー機能
├── templates/
│   └── index.html             # メインページ
└── tests/
    ├── test_app.py            # Flask アプリのテスト
    └── js/
        └── timer.test.js      # タイマー機能のテスト
```

## 開発

### テストの追加

新しいテストを追加する場合：

- **Python テスト**: `tests/test_*.py` に追加
- **JavaScript テスト**: `tests/js/*.test.js` に追加

### コードの変更

1. コードを変更
2. テストを実行して既存機能が壊れていないことを確認
3. 新機能にはテストを追加

## ライセンス

MIT
