# Pomodoro Timer - テストドキュメント

## 概要

このプロジェクトには、Flask アプリケーションと JavaScript タイマー機能の両方に対する包括的なユニットテストが実装されています。

## テストの種類

### 1. Python (Flask) テスト

**場所**: [tests/test_app.py](tests/test_app.py)

**テスト内容**:
- ルートパスのステータスコード検証
- レスポンスの Content-Type 検証
- HTML テンプレートの要素存在確認（タイマー表示、ボタン）
- 404 エラーハンドリング

**実装されたテスト**:
- `test_index_route_status_code`: ルートパスが200を返すか
- `test_index_route_content_type`: HTML が返されるか
- `test_index_route_contains_timer`: タイマー要素が含まれるか
- `test_index_route_contains_buttons`: 開始/リセットボタンが含まれるか
- `test_404_error`: 存在しないパスが404を返すか

### 2. JavaScript (タイマー機能) テスト

**場所**: [tests/js/timer.test.js](tests/js/timer.test.js)

**テスト内容**:
- 時間表示のフォーマット検証
- カウントダウン機能のロジック検証
- タイマーの開始/停止/リセット機能検証
- 統合テスト（完全なサイクル）

**実装されたテスト**:
- `updateDisplay`: 時間の表示フォーマット（4テスト）
- `countdown`: カウントダウンロジック（3テスト）
- `startTimer`: タイマー開始機能（2テスト）
- `resetTimer`: タイマーリセット機能（3テスト）
- `getTimeLeft/setTimeLeft`: 時間の取得と設定（2テスト）
- 統合テスト: 完全なワークフロー（2テスト）

## セットアップ

### Python 環境

```bash
# 依存関係のインストール
pip install -r requirements-dev.txt
```

### JavaScript 環境

```bash
# 依存関係のインストール
npm install
```

## テストの実行

### Python テストの実行

```bash
# すべてのテストを実行
python -m pytest

# 詳細モードで実行
python -m pytest -v

# カバレッジレポート付きで実行
python -m pytest --cov=. --cov-report=html

# 特定のテストファイルのみ実行
python -m pytest tests/test_app.py
```

### JavaScript テストの実行

```bash
# すべてのテストを実行
npm test

# ウォッチモードで実行（ファイル変更を監視）
npm run test:watch

# カバレッジレポート付きで実行
npm run test:coverage
```

## テスト結果

### Python テスト結果（最新）

```
============================= test session starts ==============================
collected 5 items

tests/test_app.py::TestFlaskApp::test_index_route_status_code PASSED     [ 20%]
tests/test_app.py::TestFlaskApp::test_index_route_content_type PASSED    [ 40%]
tests/test_app.py::TestFlaskApp::test_index_route_contains_timer PASSED  [ 60%]
tests/test_app.py::TestFlaskApp::test_index_route_contains_buttons PASSED [ 80%]
tests/test_app.py::TestFlaskApp::test_404_error PASSED                   [100%]

============================== 5 passed in 0.11s ===============================
```

✅ **5/5 テスト成功**

### JavaScript テスト結果（最新）

```
Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        0.785 s
```

✅ **16/16 テスト成功**

## ファイル構成

```
1.pomodoro/
├── app.py                      # Flask アプリケーション
├── requirements.txt            # 本番用依存関係
├── requirements-dev.txt        # 開発・テスト用依存関係
├── package.json                # Node.js 設定と依存関係
├── static/
│   └── js/
│       └── timer.js           # タイマー機能（テスト可能な形式）
├── templates/
│   └── index.html
└── tests/
    ├── __init__.py            # テストパッケージ初期化
    ├── test_app.py            # Flask アプリケーションのテスト
    └── js/
        └── timer.test.js      # タイマー機能のテスト
```

## 技術スタック

### Python テスト
- **pytest**: テストフレームワーク
- **pytest-flask**: Flask アプリケーションのテスト用プラグイン

### JavaScript テスト
- **Jest**: JavaScript テストフレームワーク
- **jsdom**: ブラウザ環境のシミュレーション

## テストカバレッジ

現在の実装では以下のカバレッジを達成しています：

- **Flask アプリケーション**: ルート・エンドポイント、エラーハンドリング
- **JavaScript タイマー**: 全ての主要機能（表示、カウントダウン、開始、リセット）

## 継続的インテグレーション（CI）

今後、GitHub Actions などの CI/CD パイプラインに統合することで、以下が可能になります：

- プルリクエスト時の自動テスト実行
- コードカバレッジレポートの自動生成
- テスト失敗時の自動通知

## 追加の改善案

1. **カバレッジの向上**: 現在のテストカバレッジを測定し、100%を目指す
2. **E2Eテスト**: Playwright や Selenium を使用したエンドツーエンドテスト
3. **パフォーマンステスト**: タイマーの精度や応答時間のテスト
4. **アクセシビリティテスト**: WCAG 準拠の検証

## トラブルシューティング

### Python テストが失敗する場合

```bash
# 仮想環境を作成して依存関係を再インストール
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows
pip install -r requirements-dev.txt
```

### JavaScript テストが失敗する場合

```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

## 貢献

新しいテストケースを追加する際は、以下のガイドラインに従ってください：

1. テスト関数名は明確でわかりやすい名前にする
2. 各テストは1つの機能のみをテストする
3. テストの説明（docstring/コメント）を記述する
4. アサーションは明確なメッセージを含める
