import Link from 'next/link'

const FEATURES = [
  {
    title: 'ビジュアルエディタ',
    desc: 'ドラッグ&ドロップでページを構築。CSS知識不要。テキスト・画像・ボタンをキャンバスに直接配置。',
    detail: 'モバイル/タブレット/デスクトップのプレビュー即時切替',
  },
  {
    title: 'CMS — 制限ゼロ',
    desc: 'フィールド数・コレクション数・アイテム数の上限なし。PostgreSQLの制約のみ。Webflowの60フィールド/10コレクション制限とは無縁。',
    detail: 'テキスト / リッチテキスト / 画像 / 日付 / 数値 / 真偽',
  },
  {
    title: 'セルフホスト1コマンド',
    desc: '`docker compose up` で即起動。Supabase + Next.js の完全なスタックをローカルでも本番でも動かせる。FrappeのようなBench設定は一切不要。',
    detail: 'Vercel Deploy Buttonでワンクリック本番デプロイも可',
  },
  {
    title: '組み込みフォーム',
    desc: 'フォームブロックを追加するだけ。送信データはSupabaseに自動保存。CSVエクスポート対応。',
    detail: 'スパム対策のIPハッシュ保存付き',
  },
  {
    title: 'SEO設定',
    desc: 'title / description / OGP / canonical を各ページ個別に設定。Webflowで問題になっていたroot domainのSEOバグは存在しない。',
    detail: '構造化データ対応予定（v1.1）',
  },
  {
    title: '公開/下書き管理',
    desc: 'サイト全体・ページ単位・CMSアイテム単位で公開状態を制御。承認フローなしでチームが独立して作業できる。',
    detail: 'バージョン履歴・ロールバック対応',
  },
]

const STACK = ['Next.js 15 (App Router)', 'Supabase (PostgreSQL + Auth + RLS)', 'Tailwind CSS v4', 'shadcn/ui', 'TypeScript strict']

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 rounded-md flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="white"/>
                <rect x="9" y="1" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="1" y="9" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="9" y="9" width="6" height="6" rx="1" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span className="font-semibold">landing-builder</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/postcabinets-jp/landing-builder" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              GitHub
            </a>
            <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              ログイン
            </Link>
            <Link href="/register" className="text-sm bg-slate-900 text-white px-4 py-1.5 rounded-md hover:bg-slate-800 transition-colors">
              無料で始める
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-blue-100">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Webflow代替 — MIT License — セルフホスト対応
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6 text-slate-900">
            ノーコードで作る。<br/>
            <span className="text-slate-400">制限なしで運用する。</span>
          </h1>
          <p className="text-xl text-slate-500 mb-8 leading-relaxed">
            landing-builderはWebflowのオープンソース代替。
            ビジュアルエディタ・CMS・フォーム・SEO設定を標準搭載。
            月額$113の3重課金とは縁を切れる。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              無料でアカウント作成
            </Link>
            <a
              href="https://vercel.com/new/clone?repository-url=https://github.com/postcabinets-jp/landing-builder&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY&project-name=my-landing-builder&repository-name=landing-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium hover:border-slate-400 transition-colors"
            >
              <svg height="14" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#000000"/>
              </svg>
              Vercelにデプロイ
            </a>
          </div>
        </div>
      </section>

      {/* Editor preview mock */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/70">
          {/* Editor toolbar mock */}
          <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex bg-slate-800 rounded px-2 py-1 gap-2 text-slate-400 text-xs items-center">
                <span>Desktop</span>
                <span className="text-slate-600">|</span>
                <span>Tablet</span>
                <span className="text-slate-600">|</span>
                <span>Mobile</span>
              </div>
            </div>
            <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded">保存</div>
          </div>
          <div className="flex bg-slate-50" style={{ minHeight: 260 }}>
            {/* Left panel */}
            <div className="w-44 bg-white border-r border-slate-200 p-3">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-3 font-semibold">要素を追加</p>
              {['見出し', 'テキスト', 'ボタン', '画像', '区切り線', 'セクション'].map((el) => (
                <div key={el} className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 rounded cursor-pointer">
                  <div className="w-2.5 h-2.5 bg-slate-200 rounded-sm flex-shrink-0"></div>
                  {el}
                </div>
              ))}
            </div>
            {/* Canvas */}
            <div className="flex-1 p-8 flex justify-center items-start">
              <div className="bg-white rounded-lg shadow-sm w-full max-w-xl p-8 space-y-4 border border-slate-100">
                <div className="relative border-2 border-blue-400 rounded p-2">
                  <div className="absolute -top-5 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">heading</div>
                  <p className="text-2xl font-bold text-slate-900">デザインで、ビジネスを動かす。</p>
                </div>
                <div className="border-2 border-transparent hover:border-blue-200 rounded p-2">
                  <p className="text-slate-500 text-sm">Tanaka Design Studioは、スタートアップから老舗企業まで、ブランドの「伝える力」を設計します。</p>
                </div>
                <div className="border-2 border-transparent hover:border-blue-200 rounded p-2">
                  <span className="bg-slate-900 text-white text-sm px-4 py-2 rounded inline-block">実績を見る</span>
                </div>
              </div>
            </div>
            {/* Right panel */}
            <div className="w-48 bg-white border-l border-slate-200 p-3">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-3 font-semibold">プロパティ</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">テキスト</p>
                  <div className="border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 truncate">デザインで、ビジ...</div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">文字色</p>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded bg-slate-900 border border-slate-200 flex-shrink-0"></div>
                    <div className="border border-slate-200 rounded px-2 py-1 text-xs font-mono flex-1">#1e293b</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-3">Webflowがやらないこと、すべてやる</h2>
            <p className="text-slate-500">制限・3重課金・廃止機能への対抗策をOSSとして提供</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-6 hover:border-slate-400 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-3">{feature.desc}</p>
                <p className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-md">{feature.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* vs Webflow pricing */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-3">Webflow vs landing-builder</h2>
          <p className="text-slate-400 mb-10">現実的なコスト比較（Agency向けプランの場合）</p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <p className="text-slate-400 text-sm mb-4">Webflow（実態）</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-300">Workspaceシート</span><span className="text-red-400">$39/mo</span></div>
                <div className="flex justify-between"><span className="text-slate-300">サイトプラン × 3</span><span className="text-red-400">$75/mo</span></div>
                <div className="flex justify-between"><span className="text-slate-300">Analyzeアドオン</span><span className="text-red-400">$14/mo</span></div>
                <div className="border-t border-slate-600 pt-2 flex justify-between font-semibold"><span>合計</span><span className="text-red-400">$128/mo</span></div>
              </div>
              <div className="mt-4 space-y-1 text-xs text-slate-500">
                <p>× CMSフィールド上限60個</p>
                <p>× Logic機能廃止（2024年）</p>
                <p>× サポートはAIチャットのみ</p>
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-blue-500/50">
              <p className="text-blue-400 text-sm mb-4">landing-builder</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-300">Supabase Pro</span><span className="text-green-400">$25/mo</span></div>
                <div className="flex justify-between"><span className="text-slate-300">Vercel Pro</span><span className="text-green-400">$20/mo</span></div>
                <div className="flex justify-between"><span className="text-slate-300">ライセンス費</span><span className="text-green-400">$0</span></div>
                <div className="border-t border-slate-600 pt-2 flex justify-between font-semibold"><span>合計</span><span className="text-green-400">$45/mo</span></div>
              </div>
              <div className="mt-4 space-y-1 text-xs text-slate-500">
                <p>✓ CMSフィールド・アイテム制限なし</p>
                <p>✓ コードで拡張可能</p>
                <p>✓ データは自分のDB</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deploy section */}
      <section className="py-20 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-3">今すぐデプロイ</h2>
          <p className="text-slate-500 mb-8">
            Vercelボタン1クリックで完全な環境が立ち上がる。Supabaseプロジェクトを準備するだけ。
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href="https://vercel.com/new/clone?repository-url=https://github.com/postcabinets-jp/landing-builder&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY&project-name=my-landing-builder&repository-name=landing-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-medium hover:border-slate-400 transition-colors"
            >
              <svg height="14" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#000000"/>
              </svg>
              Deploy to Vercel
            </a>
            <a
              href="https://github.com/postcabinets-jp/landing-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:border-slate-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </a>
          </div>
          <div className="bg-slate-900 text-green-400 rounded-lg p-4 text-left font-mono text-sm">
            <p className="text-slate-500 text-xs mb-2"># ローカルで起動</p>
            <p>git clone https://github.com/postcabinets-jp/landing-builder</p>
            <p>cp .env.example .env.local</p>
            <p>npm install && npm run dev</p>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="border-t border-slate-100 py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">技術スタック</h2>
          <div className="flex flex-wrap gap-3">
            {STACK.map((tech) => (
              <span key={tech} className="bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2 rounded-lg font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-900 rounded flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="white"/>
                <rect x="9" y="1" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="1" y="9" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="9" y="9" width="6" height="6" rx="1" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span className="text-sm text-slate-500">landing-builder — MIT License</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <a href="https://github.com/postcabinets-jp/landing-builder" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700 transition-colors">GitHub</a>
            <span>Built by <a href="https://postcabinets.co.jp" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700 transition-colors">POST CABINETS</a></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
