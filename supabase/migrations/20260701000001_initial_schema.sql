-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- SITES
-- ============================================================
CREATE TABLE sites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users NOT NULL,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  custom_domain TEXT,
  favicon_url   TEXT,
  global_styles JSONB DEFAULT '{"colors":{"primary":"#0f172a","accent":"#3b82f6","background":"#ffffff","text":"#1e293b"},"fonts":{"heading":"Inter","body":"Inter"},"spacing":{"base":8}}',
  is_published  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sites_owner" ON sites FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_sites_user ON sites(user_id);
CREATE INDEX idx_sites_slug  ON sites(slug);

-- ============================================================
-- PAGES
-- ============================================================
CREATE TABLE pages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id       UUID REFERENCES sites ON DELETE CASCADE NOT NULL,
  title         TEXT NOT NULL,
  path          TEXT NOT NULL,
  seo_meta      JSONB DEFAULT '{"title":"","description":"","ogImage":""}',
  is_template   BOOLEAN DEFAULT false,
  collection_id UUID,
  is_published  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(site_id, path)
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages_owner" ON pages FOR ALL
  USING (site_id IN (SELECT id FROM sites WHERE user_id = auth.uid()));
CREATE INDEX idx_pages_site ON pages(site_id);

-- ============================================================
-- PAGE VERSIONS
-- ============================================================
CREATE TABLE page_versions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id    UUID REFERENCES pages ON DELETE CASCADE NOT NULL,
  content    JSONB NOT NULL,
  label      TEXT,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "versions_owner" ON page_versions FOR ALL
  USING (page_id IN (
    SELECT p.id FROM pages p
    JOIN sites s ON s.id = p.site_id
    WHERE s.user_id = auth.uid()
  ));
CREATE INDEX idx_versions_page ON page_versions(page_id, created_at DESC);

-- ============================================================
-- CMS COLLECTIONS
-- ============================================================
CREATE TABLE cms_collections (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id    UUID REFERENCES sites ON DELETE CASCADE NOT NULL,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL,
  fields     JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(site_id, slug)
);

ALTER TABLE cms_collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "collections_owner" ON cms_collections FOR ALL
  USING (site_id IN (SELECT id FROM sites WHERE user_id = auth.uid()));
CREATE INDEX idx_collections_site ON cms_collections(site_id);

-- ============================================================
-- CMS ITEMS
-- ============================================================
CREATE TABLE cms_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES cms_collections ON DELETE CASCADE NOT NULL,
  data          JSONB NOT NULL DEFAULT '{}',
  slug          TEXT,
  is_published  BOOLEAN DEFAULT false,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cms_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "items_owner" ON cms_items FOR ALL
  USING (collection_id IN (
    SELECT c.id FROM cms_collections c
    JOIN sites s ON s.id = c.site_id
    WHERE s.user_id = auth.uid()
  ));
CREATE POLICY "items_public_read" ON cms_items FOR SELECT
  USING (is_published = true);
CREATE INDEX idx_items_collection ON cms_items(collection_id);
CREATE INDEX idx_items_slug       ON cms_items(collection_id, slug);

-- ============================================================
-- MEDIA ASSETS
-- ============================================================
CREATE TABLE media_assets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id      UUID REFERENCES sites ON DELETE CASCADE NOT NULL,
  file_name    TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type    TEXT NOT NULL,
  size_bytes   BIGINT,
  width        INTEGER,
  height       INTEGER,
  alt_text     TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media_owner" ON media_assets FOR ALL
  USING (site_id IN (SELECT id FROM sites WHERE user_id = auth.uid()));
CREATE INDEX idx_media_site ON media_assets(site_id);

-- ============================================================
-- FORM SUBMISSIONS
-- ============================================================
CREATE TABLE form_submissions (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id   UUID REFERENCES sites ON DELETE CASCADE NOT NULL,
  page_id   UUID REFERENCES pages,
  form_name TEXT NOT NULL,
  data      JSONB NOT NULL,
  ip_hash   TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submissions_owner" ON form_submissions FOR SELECT
  USING (site_id IN (SELECT id FROM sites WHERE user_id = auth.uid()));
CREATE POLICY "submissions_public_insert" ON form_submissions FOR INSERT WITH CHECK (true);
CREATE INDEX idx_submissions_site ON form_submissions(site_id, created_at DESC);

-- ============================================================
-- UPDATED_AT triggers
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sites_updated_at    BEFORE UPDATE ON sites    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER pages_updated_at    BEFORE UPDATE ON pages    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER collections_updated_at BEFORE UPDATE ON cms_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER items_updated_at    BEFORE UPDATE ON cms_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
