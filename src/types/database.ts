export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sites: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          custom_domain: string | null
          favicon_url: string | null
          global_styles: Json
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          custom_domain?: string | null
          favicon_url?: string | null
          global_styles?: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          custom_domain?: string | null
          favicon_url?: string | null
          global_styles?: Json
          is_published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          id: string
          site_id: string
          title: string
          path: string
          seo_meta: Json
          is_template: boolean
          collection_id: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_id: string
          title: string
          path: string
          seo_meta?: Json
          is_template?: boolean
          collection_id?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          title?: string
          path?: string
          seo_meta?: Json
          is_template?: boolean
          collection_id?: string | null
          is_published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      page_versions: {
        Row: {
          id: string
          page_id: string
          content: Json
          label: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          content: Json
          label?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          content?: Json
          label?: string | null
        }
        Relationships: []
      }
      cms_collections: {
        Row: {
          id: string
          site_id: string
          name: string
          slug: string
          fields: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_id: string
          name: string
          slug: string
          fields?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          name?: string
          slug?: string
          fields?: Json
          updated_at?: string
        }
        Relationships: []
      }
      cms_items: {
        Row: {
          id: string
          collection_id: string
          data: Json
          slug: string | null
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          collection_id: string
          data?: Json
          slug?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          collection_id?: string
          data?: Json
          slug?: string | null
          is_published?: boolean
          published_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          id: string
          site_id: string
          file_name: string
          storage_path: string
          mime_type: string
          size_bytes: number | null
          width: number | null
          height: number | null
          alt_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          site_id: string
          file_name: string
          storage_path: string
          mime_type: string
          size_bytes?: number | null
          width?: number | null
          height?: number | null
          alt_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          alt_text?: string | null
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          id: string
          site_id: string
          page_id: string | null
          form_name: string
          data: Json
          ip_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          site_id: string
          page_id?: string | null
          form_name: string
          data: Json
          ip_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
