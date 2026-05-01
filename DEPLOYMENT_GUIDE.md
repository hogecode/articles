# GitHub Pages デプロイガイド

このプロジェクトは Astro を使用した Markdown ベースのブログアプリケーションです。GitHub Actions を使用して GitHub Pages に自動デプロイされます。

## セットアップ手順

### 1. GitHub Pages の設定

1. GitHub リポジトリの **Settings** に移動
2. **Pages** セクションに移動
3. **Source** を以下のように設定：
   - Deploy from a branch → **GitHub Actions** に変更

### 2. デプロイの確認

プッシュ後、以下の URL で公開されます：
- **ブログトップ**: `https://hogecode.github.io/articles/`
- **ブログ一覧**: `https://hogecode.github.io/articles/blog/`

## 機能

### タグとカテゴリー機能
- ブログ一覧ページで、タグとカテゴリーでフィルタリング可能
- 複数のタグを同時に選択可能
- カテゴリーは 1 つのみ選択可能

### ページネーション
- デフォルトでは 6 記事ごとにページ分割
- ページネーション コントロールで移動可能

### Markdown 対応
- `.md` および `.mdx` ファイルをサポート
- 以下のメタデータをサポート：
  - `title`: 記事タイトル
  - `description`: 説明
  - `pubDate`: 公開日
  - `updatedDate`: 更新日（オプション）
  - `heroImage`: ヒーロー画像
  - `tags`: タグ配列
  - `category`: カテゴリー

## 新しい記事の追加

`src/content/blog/` ディレクトリに新しい Markdown ファイルを作成します：

```markdown
---
title: '新しい記事'
description: '記事の説明'
pubDate: '2024-05-01'
heroImage: '../../assets/blog-placeholder-1.jpg'
tags: ['astro', 'blog']
category: 'Tutorial'
---

記事の内容をここに書きます...
```

## GitHub Actions ワークフロー

`.github/workflows/deploy.yml` では以下の処理が実行されます：

1. **Build**: 
   - Node.js 22 をセットアップ
   - 依存パッケージをインストール
   - Astro でビルド

2. **Deploy**:
   - ビルド成果物を GitHub Pages にデプロイ

## 技術スタック

- **Framework**: Astro 6.2.1
- **UI Library**: React 18
- **Styling**: Tailwind CSS（インラインスタイル使用）
- **Content**: Content Collections API
- **Package Manager**: npm

## トラブルシューティング

### デプロイが失敗する場合

1. GitHub Actions のログを確認
   - リポジトリの **Actions** タブを確認
   
2. ビルドエラーをローカルで確認
   ```bash
   npm run build
   ```

3. 一般的な問題：
   - Node.js バージョン: 22 以上が必要
   - Markdown フロントマターの形式が正しいか確認

## ローカル開発

```bash
# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## ブログのカスタマイズ

### ブログの URL プレフィックスを変更
`astro.config.mjs` の `base` を変更：

```javascript
base: '/articles',  // 現在の設定
```

### サイトURL を変更
`astro.config.mjs` の `site` を変更：

```javascript
site: 'https://hogecode.github.io',  // 現在の設定
```

## ライセンス

このプロジェクトはテンプレートとして自由に使用できます。
