# landing-builder

**Webflowのオープンソース代替** — ノーコードビジュアルサイトビルダー

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/postcabinets-jp/landing-builder&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY&project-name=my-landing-builder&repository-name=landing-builder)

---

## なぜ landing-builder か

| 問題 | Webflow | landing-builder |
|------|---------|-----------------|
| 料金 | $128/mo（シート＋サイト＋アドオン3重課金）| $45/mo（Supabase + Vercel）|
| CMSフィールド | 上限60個/コレクション | 制限なし（PostgreSQL） |
| CMSコレクション | 上限10個 | 制限なし |
| ホスティング | Webflow依存 | セルフホスト or Vercel |
| ソースコード | クローズド | MIT License |

## 機能

- **ビジュアルエディタ** — ドラッグ&ドロップでページ構築（見出し/テキスト/ボタン/画像/セクション）
- **レスポンシブプレビュー** — Desktop / Tablet / Mobile リアルタイム切替
- **CMS制限ゼロ** — フィールド型: text / richtext / image / date / number / boolean
- **ページバージョン管理** — 保存履歴・ロールバック対応
- **組み込みフォーム** — 送信データをSupabaseに自動保存、CSVエクスポート
- **SEO設定** — title / description / OGP / canonical をページ単位で設定
- **メディアライブラリ** — Supabase Storage連携
- **Google OAuth + メール認証** — Supabase Auth
- **RLS (Row Level Security)** — 全テーブルにユーザー分離ポリシー

## Quick Start

### Option A: Vercelにデプロイ（推奨）

1. 上の「Deploy with Vercel」ボタンをクリック
2. [Supabase](https://supabase.com)でプロジェクト作成
3. 環境変数を設定
4. `supabase/migrations/` のSQLをSupabase SQL Editorで実行

### Option B: ローカル開発

```bash
git clone https://github.com/postcabinets-jp/landing-builder
cd landing-builder
cp .env.example .env.local
# .env.local に Supabase の URL と API key を設定
npm install
npm run dev
# http://localhost:3000
```

## 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## データベースセットアップ

Supabase SQL Editorで実行:

```sql
-- supabase/migrations/20260701000001_initial_schema.sql の内容を実行
-- （supabase/seed.sql で現実的なデモデータも投入できます）
```

## 技術スタック

| レイヤー | 採用技術 |
|---------|---------|
| フレームワーク | Next.js 15 (App Router) |
| データベース | Supabase (PostgreSQL) |
| 認証 | Supabase Auth (email + Google OAuth) |
| ストレージ | Supabase Storage |
| UI | Tailwind CSS v4 + shadcn/ui |
| 型 | TypeScript strict |
| デプロイ | Vercel |

## ディレクトリ構成

```
src/
├── app/
│   ├── (auth)/          # login / register / forgot-password
│   ├── (dashboard)/     # ダッシュボード全体
│   │   └── dashboard/
│   │       └── [siteId]/
│   │           ├── pages/[pageId]/editor/  # ビジュアルエディタ
│   │           ├── cms/[collectionId]/     # CMS管理
│   │           ├── media/                  # メディアライブラリ
│   │           ├── forms/                  # フォーム送信一覧
│   │           └── settings/              # サイト設定
│   ├── actions/         # Server Actions (CRUD)
│   └── auth/callback/   # OAuth コールバック
├── components/
│   ├── layout/          # Sidebar / Header
│   └── ui/              # shadcn components
├── lib/supabase/        # client / server / middleware
└── types/               # database.ts (型定義)
supabase/
├── migrations/          # スキーマ
└── seed.sql             # 現実的なデモデータ
```

## ロードマップ

- [ ] アニメーション/トランジション設定
- [ ] A/Bテスト機能
- [ ] 組み込みアナリティクス（PV/UU/直帰率）
- [ ] テンプレートギャラリー（20種以上）
- [ ] チーム共同編集
- [ ] Webflowインポート
- [ ] i18n多言語対応

## License

MIT

---

Built by [POST CABINETS](https://postcabinets.co.jp)
