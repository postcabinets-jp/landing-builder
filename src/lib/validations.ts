import { z } from 'zod'

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** UUID v4 format */
const uuidSchema = z.string().uuid('有効なUUID形式で入力してください')

/** Slug: lowercase alphanumeric + hyphens, 1-100 chars */
const slugSchema = z
  .string()
  .min(1, 'スラッグは必須です')
  .max(100, 'スラッグは100文字以内で入力してください')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'スラッグは小文字英数字とハイフンのみ使用できます')

/** Generic non-empty trimmed string with bounds */
function boundedString(field: string, min: number, max: number) {
  return z
    .string()
    .trim()
    .min(min, `${field}は${min}文字以上で入力してください`)
    .max(max, `${field}は${max}文字以内で入力してください`)
}

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
    .max(254, 'メールアドレスは254文字以内で入力してください'),
  password: z
    .string()
    .min(1, 'パスワードは必須です')
    .max(128, 'パスワードは128文字以内で入力してください'),
})

export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
    .max(254, 'メールアドレスは254文字以内で入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(128, 'パスワードは128文字以内で入力してください')
    .regex(/[A-Z]/, 'パスワードには大文字を1文字以上含めてください')
    .regex(/[a-z]/, 'パスワードには小文字を1文字以上含めてください')
    .regex(/[0-9]/, 'パスワードには数字を1文字以上含めてください'),
  name: boundedString('名前', 1, 100),
})

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
    .max(254, 'メールアドレスは254文字以内で入力してください'),
})

// ---------------------------------------------------------------------------
// Site schemas
// ---------------------------------------------------------------------------

export const createSiteSchema = z.object({
  name: boundedString('サイト名', 1, 100),
  slug: slugSchema.optional(),
})

export const updateSiteSchema = z
  .object({
    name: boundedString('サイト名', 1, 100).optional(),
    custom_domain: z
      .string()
      .max(253, 'ドメインは253文字以内で入力してください')
      .regex(
        /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/,
        '有効なドメイン名を入力してください',
      )
      .optional()
      .nullable(),
    global_styles: z.record(z.unknown()).optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.custom_domain !== undefined || data.global_styles !== undefined,
    { message: '少なくとも1つの更新フィールドが必要です' },
  )

export const siteIdSchema = z.object({
  siteId: uuidSchema,
})

export const toggleSitePublishSchema = z.object({
  siteId: uuidSchema,
  isPublished: z.boolean({ required_error: '公開状態は必須です' }),
})

// ---------------------------------------------------------------------------
// Page schemas
// ---------------------------------------------------------------------------

export const createPageSchema = z.object({
  title: boundedString('ページタイトル', 1, 200),
  path: z
    .string()
    .min(1, 'パスは必須です')
    .max(500, 'パスは500文字以内で入力してください')
    .regex(/^\//, 'パスは / で始まる必要があります')
    .regex(/^[a-z0-9\/_-]*$/, 'パスには小文字英数字、ハイフン、アンダースコア、スラッシュのみ使用できます'),
})

export const savePageSchema = z.object({
  pageId: uuidSchema,
  siteId: uuidSchema,
  content: z.record(z.unknown()).refine(
    (val) => val !== null && val !== undefined,
    { message: 'コンテンツは必須です' },
  ),
})

export const togglePagePublishSchema = z.object({
  pageId: uuidSchema,
  siteId: uuidSchema,
  isPublished: z.boolean({ required_error: '公開状態は必須です' }),
})

export const deletePageSchema = z.object({
  pageId: uuidSchema,
  siteId: uuidSchema,
})

// ---------------------------------------------------------------------------
// SEO meta schema
// ---------------------------------------------------------------------------

export const seoMetaSchema = z.object({
  title: z.string().max(70, 'SEOタイトルは70文字以内で入力してください').optional().default(''),
  description: z.string().max(160, 'SEOディスクリプションは160文字以内で入力してください').optional().default(''),
  ogImage: z.string().url('有効なURLを入力してください').optional().or(z.literal('')).default(''),
})

// ---------------------------------------------------------------------------
// CMS Collection schemas
// ---------------------------------------------------------------------------

export const collectionFieldSchema = z.object({
  name: z
    .string()
    .min(1, 'フィールド名は必須です')
    .max(50, 'フィールド名は50文字以内で入力してください')
    .regex(/^[a-z][a-z0-9_]*$/, 'フィールド名は小文字英字で始まり、小文字英数字とアンダースコアのみ使用できます'),
  label: boundedString('ラベル', 1, 100),
  type: z.enum(['text', 'textarea', 'number', 'boolean', 'date', 'image', 'url', 'email', 'select', 'rich_text'], {
    errorMap: () => ({ message: '有効なフィールドタイプを選択してください' }),
  }),
  required: z.boolean().default(false),
})

export const createCollectionSchema = z.object({
  name: boundedString('コレクション名', 1, 100),
})

export const updateCollectionFieldsSchema = z.object({
  collectionId: uuidSchema,
  siteId: uuidSchema,
  fields: z
    .array(collectionFieldSchema)
    .max(50, 'フィールドは50個以内にしてください')
    .refine(
      (fields) => {
        const names = fields.map((f) => f.name)
        return new Set(names).size === names.length
      },
      { message: 'フィールド名が重複しています' },
    ),
})

export const deleteCollectionSchema = z.object({
  collectionId: uuidSchema,
  siteId: uuidSchema,
})

// ---------------------------------------------------------------------------
// CMS Item schemas
// ---------------------------------------------------------------------------

export const createItemSchema = z.object({
  collectionId: uuidSchema,
  siteId: uuidSchema,
  data: z.record(z.unknown()),
})

export const updateItemSchema = z.object({
  itemId: uuidSchema,
  siteId: uuidSchema,
  collectionId: uuidSchema,
  data: z.record(z.unknown()),
})

export const toggleItemPublishSchema = z.object({
  itemId: uuidSchema,
  siteId: uuidSchema,
  collectionId: uuidSchema,
  isPublished: z.boolean({ required_error: '公開状態は必須です' }),
})

export const deleteItemSchema = z.object({
  itemId: uuidSchema,
  siteId: uuidSchema,
  collectionId: uuidSchema,
})

// ---------------------------------------------------------------------------
// Media schemas
// ---------------------------------------------------------------------------

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
  'application/pdf',
  'video/mp4',
  'video/webm',
] as const

export const uploadMediaSchema = z.object({
  siteId: uuidSchema,
  fileName: z
    .string()
    .min(1, 'ファイル名は必須です')
    .max(255, 'ファイル名は255文字以内で入力してください')
    .regex(/^[^<>:"/\\|?*\x00-\x1f]+$/, 'ファイル名に使用できない文字が含まれています'),
  mimeType: z.enum(ALLOWED_MIME_TYPES, {
    errorMap: () => ({ message: '許可されていないファイル形式です' }),
  }),
  sizeBytes: z
    .number()
    .int('ファイルサイズは整数で指定してください')
    .positive('ファイルサイズは正の数で指定してください')
    .max(50 * 1024 * 1024, 'ファイルサイズは50MB以内にしてください'),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  altText: z.string().max(500, '代替テキストは500文字以内で入力してください').optional().nullable(),
})

// ---------------------------------------------------------------------------
// Form submission schemas
// ---------------------------------------------------------------------------

export const formSubmissionSchema = z.object({
  siteId: uuidSchema,
  pageId: uuidSchema.optional().nullable(),
  formName: boundedString('フォーム名', 1, 100),
  data: z.record(z.unknown()),
})

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type CreateSiteInput = z.infer<typeof createSiteSchema>
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>
export type CreatePageInput = z.infer<typeof createPageSchema>
export type SavePageInput = z.infer<typeof savePageSchema>
export type SeoMetaInput = z.infer<typeof seoMetaSchema>
export type CollectionFieldInput = z.infer<typeof collectionFieldSchema>
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>
export type UpdateCollectionFieldsInput = z.infer<typeof updateCollectionFieldsSchema>
export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
export type UploadMediaInput = z.infer<typeof uploadMediaSchema>
export type FormSubmissionInput = z.infer<typeof formSubmissionSchema>
