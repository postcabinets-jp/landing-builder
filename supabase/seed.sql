-- ============================================================
-- Seed data for development / demo
-- Uses auth.users placeholder UUIDs (replace with real ones after signup)
-- ============================================================

-- Demo site: Tanaka Design Studio
INSERT INTO sites (id, user_id, name, slug, global_styles, is_published) VALUES
  (
    '11111111-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001', -- replace with real user_id
    'Tanaka Design Studio',
    'tanaka-design',
    '{"colors":{"primary":"#1a1a2e","accent":"#e94560","background":"#ffffff","text":"#333333"},"fonts":{"heading":"Noto Serif JP","body":"Noto Sans JP"},"spacing":{"base":8}}',
    true
  ),
  (
    '11111111-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Sakura Coffee Roasters',
    'sakura-coffee',
    '{"colors":{"primary":"#2d1b00","accent":"#c17f24","background":"#faf7f2","text":"#2d1b00"},"fonts":{"heading":"Playfair Display","body":"Inter"},"spacing":{"base":8}}',
    false
  );

-- Pages for Tanaka Design Studio
INSERT INTO pages (id, site_id, title, path, seo_meta, is_published) VALUES
  (
    '22222222-0000-0000-0000-000000000001',
    '11111111-0000-0000-0000-000000000001',
    'Home',
    '/',
    '{"title":"Tanaka Design Studio — グラフィック&UIデザイン","description":"東京を拠点とするデザインスタジオ。ブランドアイデンティティからWebデザインまで一貫支援。","ogImage":""}',
    true
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    '11111111-0000-0000-0000-000000000001',
    'Works',
    '/works',
    '{"title":"実績 — Tanaka Design Studio","description":"過去の制作実績をご覧ください。","ogImage":""}',
    true
  ),
  (
    '22222222-0000-0000-0000-000000000003',
    '11111111-0000-0000-0000-000000000001',
    'Blog',
    '/blog/[slug]',
    '{"title":"Blog — Tanaka Design Studio","description":"デザインに関するコラムと思考。","ogImage":""}',
    true
  );

-- Page version snapshot (Home page block tree)
INSERT INTO page_versions (page_id, content, label, created_by) VALUES
  (
    '22222222-0000-0000-0000-000000000001',
    '{
      "blocks": [
        {
          "id": "hero-1",
          "type": "section",
          "layout": "flex",
          "direction": "column",
          "align": "center",
          "padding": {"top": 120, "bottom": 120},
          "children": [
            {"id": "h1-1", "type": "heading", "level": 1, "text": "デザインで、ビジネスを動かす。", "style": {"fontSize": 56, "fontWeight": 700, "lineHeight": 1.2, "color": "#1a1a2e"}},
            {"id": "p-1", "type": "paragraph", "text": "Tanaka Design Studioは、スタートアップから老舗企業まで、ブランドの「伝える力」を設計します。", "style": {"fontSize": 18, "color": "#666"}},
            {"id": "btn-1", "type": "button", "text": "実績を見る", "href": "/works", "style": {"backgroundColor": "#e94560", "color": "#fff", "borderRadius": 4}}
          ]
        }
      ]
    }',
    'Initial draft — 2026-07-01',
    NULL
  );

-- CMS Collection: Blog Posts
INSERT INTO cms_collections (id, site_id, name, slug, fields) VALUES
  (
    '33333333-0000-0000-0000-000000000001',
    '11111111-0000-0000-0000-000000000001',
    'ブログ記事',
    'blog-posts',
    '[
      {"name": "title", "label": "タイトル", "type": "text", "required": true},
      {"name": "body", "label": "本文", "type": "richtext", "required": true},
      {"name": "cover_image", "label": "カバー画像", "type": "image", "required": false},
      {"name": "published_date", "label": "公開日", "type": "date", "required": true},
      {"name": "author", "label": "著者", "type": "text", "required": true},
      {"name": "tags", "label": "タグ", "type": "text", "required": false}
    ]'
  ),
  (
    '33333333-0000-0000-0000-000000000002',
    '11111111-0000-0000-0000-000000000001',
    '制作実績',
    'works',
    '[
      {"name": "title", "label": "プロジェクト名", "type": "text", "required": true},
      {"name": "client", "label": "クライアント", "type": "text", "required": true},
      {"name": "description", "label": "概要", "type": "richtext", "required": true},
      {"name": "thumbnail", "label": "サムネイル", "type": "image", "required": true},
      {"name": "year", "label": "年", "type": "number", "required": true},
      {"name": "category", "label": "カテゴリ", "type": "text", "required": true}
    ]'
  );

-- CMS Items: Blog posts
INSERT INTO cms_items (collection_id, data, slug, is_published, published_at) VALUES
  (
    '33333333-0000-0000-0000-000000000001',
    '{
      "title": "Figmaのオートレイアウトをマスターする5つのコツ",
      "body": "<p>オートレイアウトは、Figmaの中で最も強力な機能の一つです。正しく使えば、レスポンシブなコンポーネントを驚くほど効率的に作成できます。</p><p>今回は実務で特に役立つ5つのテクニックをご紹介します。</p>",
      "cover_image": "",
      "published_date": "2026-06-15",
      "author": "田中 拓也",
      "tags": "Figma, デザインツール, UI"
    }',
    'figma-auto-layout-tips',
    true,
    '2026-06-15 09:00:00+09'
  ),
  (
    '33333333-0000-0000-0000-000000000001',
    '{
      "title": "2026年のWebデザイントレンド：ビジュアル密度の復権",
      "body": "<p>ミニマリズム全盛の時代が終わり、情報密度の高いデザインが再び注目されています。背景には、ユーザーのリテラシー向上と高解像度ディスプレイの普及があります。</p>",
      "cover_image": "",
      "published_date": "2026-07-01",
      "author": "田中 拓也",
      "tags": "トレンド, Webデザイン"
    }',
    '2026-web-design-trends',
    true,
    '2026-07-01 09:00:00+09'
  );

-- CMS Items: Works
INSERT INTO cms_items (collection_id, data, slug, is_published, published_at) VALUES
  (
    '33333333-0000-0000-0000-000000000002',
    '{
      "title": "Brewista ECサイトリデザイン",
      "client": "Brewista Japan株式会社",
      "description": "<p>コーヒー器具ブランドのECサイト全面リデザイン。商品画像を主役に据えたビジュアル重視のレイアウトを構築し、CVRを前年比23%改善。</p>",
      "thumbnail": "",
      "year": 2025,
      "category": "Webデザイン"
    }',
    'brewista-ec-redesign',
    true,
    '2026-03-01 00:00:00+09'
  ),
  (
    '33333333-0000-0000-0000-000000000002',
    '{
      "title": "Nori法律事務所 ブランドアイデンティティ",
      "client": "Nori法律事務所",
      "description": "<p>創業50年の法律事務所のブランド刷新プロジェクト。伝統と信頼を体現しながら、若い世代にも親しみやすいビジュアルアイデンティティを設計。</p>",
      "thumbnail": "",
      "year": 2025,
      "category": "ブランディング"
    }',
    'nori-law-office-branding',
    true,
    '2026-05-15 00:00:00+09'
  );

-- Form submissions demo
INSERT INTO form_submissions (site_id, form_name, data) VALUES
  (
    '11111111-0000-0000-0000-000000000001',
    '問い合わせフォーム',
    '{"name": "山田 花子", "email": "hanako.yamada@example.com", "company": "株式会社サンプル", "message": "ECサイトのリデザインについてご相談したいです。予算感や進め方を教えていただけますか？"}'
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    '問い合わせフォーム',
    '{"name": "鈴木 一郎", "email": "ichiro.suzuki@startup.co.jp", "company": "スタートアップ合同会社", "message": "プロダクトのUIデザインをお願いしたいと考えています。まずはオンラインでお話できますか？"}'
  );
