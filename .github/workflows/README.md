# Workflows

## Pomodoro Documentation Sync

このワークフロー (`pomodoro-docs-sync.md` / `pomodoro-docs-sync.lock.yml`) は、`1.pomodoro/` ディレクトリのコード変更を検出し、ドキュメントを自動的に更新します。

**現在の状態**: 手動実行のみ（`workflow_dispatch`）

### 背景

このワークフローは、`1.pomodoro/` 配下のソースコードの変更を検出すると、自動的にドキュメント（`1.pomodoro/docs/`）を更新するよう設計されています。ただし、実行には GitHub Copilot CLI が必要で、そのために `COPILOT_GITHUB_TOKEN` シークレットの設定が必要です。

シークレットが設定されていない状態で自動実行されると失敗するため、現在は手動実行（`workflow_dispatch`）のみに設定されています。

### 必要な設定

ワークフローの実行には `COPILOT_GITHUB_TOKEN` シークレットが必要です。

### セットアップ手順

1. **GitHub Copilot トークンを取得する**:
   - GitHub Copilot CLI を使用するには、有効な GitHub Copilot サブスクリプションが必要です
   - GitHub Copilot の設定については、GitHub の公式ドキュメントを参照してください
   - 詳細情報: [GitHub Copilot CLI](https://github.github.com/gh-aw/reference/engines/#github-copilot-default) （アクセスには権限が必要な場合があります）

2. **リポジトリシークレットを設定する**:
   - リポジトリの Settings > Secrets and variables > Actions に移動
   - "New repository secret" をクリック
   - Name: `COPILOT_GITHUB_TOKEN`
   - Value: 取得したトークン
   - "Add secret" をクリック

3. **ワークフローをテストする**:
   - Actions タブから "Pomodoro Documentation Sync" ワークフローを選択
   - "Run workflow" ボタンをクリックして手動実行
   - シークレットが正しく設定されていれば、ワークフローが成功します

4. **自動トリガーを有効化する**（オプション）:
   - シークレットが正しく動作することを確認したら、自動トリガーを有効化できます
   - `.github/workflows/pomodoro-docs-sync.lock.yml` の `push:` トリガーのコメントを解除してください
   ```yaml
   "on":
     push:                    # コメントを解除
       branches:
       - main
       paths:
       - 1.pomodoro/**
       - "!1.pomodoro/docs/**"
     workflow_dispatch:
   ```

### トラブルシューティング

**ワークフローが失敗する場合**:
- シークレットが正しく設定されているか確認
- GitHub Copilot のサブスクリプションが有効か確認
- トークンの有効期限が切れていないか確認

### 代替案

GitHub Copilot を使用しない場合は、ワークフローソースファイル (`.github/workflows/pomodoro-docs-sync.md`) を編集して、異なるエンジンを指定することができます。

詳細については以下を参照してください：
- [gh-aw ドキュメント](https://github.github.com/gh-aw/introduction/overview/) （アクセスには権限が必要な場合があります）
- または、ワークフローを削除してドキュメントを手動で管理することも検討してください
