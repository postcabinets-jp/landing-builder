import { describe, it, expect } from 'vitest'
import {
  signInSchema,
  signUpSchema,
  resetPasswordSchema,
  createSiteSchema,
  updateSiteSchema,
  siteIdSchema,
  toggleSitePublishSchema,
  createPageSchema,
  savePageSchema,
  togglePagePublishSchema,
  deletePageSchema,
  seoMetaSchema,
  collectionFieldSchema,
  createCollectionSchema,
  updateCollectionFieldsSchema,
  deleteCollectionSchema,
  createItemSchema,
  updateItemSchema,
  toggleItemPublishSchema,
  deleteItemSchema,
  uploadMediaSchema,
  formSubmissionSchema,
} from '@/lib/validations'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'
const INVALID_UUID = 'not-a-uuid'

function expectSuccess(schema: { safeParse: (v: unknown) => { success: boolean } }, value: unknown) {
  const result = schema.safeParse(value)
  expect(result.success).toBe(true)
}

function expectFailure(
  schema: { safeParse: (v: unknown) => { success: boolean; error?: { issues: Array<{ message: string }> } } },
  value: unknown,
  expectedMessage?: string,
) {
  const result = schema.safeParse(value)
  expect(result.success).toBe(false)
  if (expectedMessage && !result.success) {
    const messages = result.error!.issues.map((i) => i.message)
    expect(messages.some((m) => m.includes(expectedMessage))).toBe(true)
  }
}

// ===========================================================================
// Auth: signInSchema
// ===========================================================================
describe('signInSchema', () => {
  it('accepts valid email and password', () => {
    expectSuccess(signInSchema, { email: 'test@example.com', password: 'secret123' })
  })

  it('rejects missing email', () => {
    expectFailure(signInSchema, { password: 'secret123' })
  })

  it('rejects empty email', () => {
    expectFailure(signInSchema, { email: '', password: 'secret123' }, 'メールアドレスは必須です')
  })

  it('rejects invalid email format', () => {
    expectFailure(signInSchema, { email: 'not-email', password: 'secret123' }, '有効なメールアドレスを入力してください')
  })

  it('rejects missing password', () => {
    expectFailure(signInSchema, { email: 'test@example.com' })
  })

  it('rejects empty password', () => {
    expectFailure(signInSchema, { email: 'test@example.com', password: '' }, 'パスワードは必須です')
  })

  it('trims email whitespace', () => {
    const result = signInSchema.safeParse({ email: '  test@example.com  ', password: 'secret' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.email).toBe('test@example.com')
  })

  it('rejects email exceeding 254 chars', () => {
    const long = 'a'.repeat(246) + '@test.com' // 246 + 9 = 255 chars
    expectFailure(signInSchema, { email: long, password: 'x' }, '254文字以内')
  })

  it('rejects password exceeding 128 chars', () => {
    expectFailure(signInSchema, { email: 'a@b.com', password: 'x'.repeat(129) }, '128文字以内')
  })
})

// ===========================================================================
// Auth: signUpSchema
// ===========================================================================
describe('signUpSchema', () => {
  const validSignUp = { email: 'user@example.com', password: 'StrongPass1', name: 'Taro' }

  it('accepts valid input', () => {
    expectSuccess(signUpSchema, validSignUp)
  })

  it('rejects short password (< 8 chars)', () => {
    expectFailure(signUpSchema, { ...validSignUp, password: 'Ab1' }, '8文字以上')
  })

  it('rejects password without uppercase', () => {
    expectFailure(signUpSchema, { ...validSignUp, password: 'lowercase1' }, '大文字を1文字以上')
  })

  it('rejects password without lowercase', () => {
    expectFailure(signUpSchema, { ...validSignUp, password: 'UPPERCASE1' }, '小文字を1文字以上')
  })

  it('rejects password without digit', () => {
    expectFailure(signUpSchema, { ...validSignUp, password: 'NoDigitHere' }, '数字を1文字以上')
  })

  it('rejects empty name', () => {
    expectFailure(signUpSchema, { ...validSignUp, name: '' }, '名前は1文字以上')
  })

  it('rejects name exceeding 100 chars', () => {
    expectFailure(signUpSchema, { ...validSignUp, name: 'A'.repeat(101) }, '100文字以内')
  })

  it('accepts exactly 8-char password with all requirements', () => {
    expectSuccess(signUpSchema, { ...validSignUp, password: 'Abcdefg1' })
  })

  it('accepts name with spaces and unicode', () => {
    expectSuccess(signUpSchema, { ...validSignUp, name: '前田 将臣' })
  })
})

// ===========================================================================
// Auth: resetPasswordSchema
// ===========================================================================
describe('resetPasswordSchema', () => {
  it('accepts valid email', () => {
    expectSuccess(resetPasswordSchema, { email: 'reset@example.com' })
  })

  it('rejects invalid email', () => {
    expectFailure(resetPasswordSchema, { email: 'bad' }, '有効なメールアドレス')
  })

  it('rejects empty email', () => {
    expectFailure(resetPasswordSchema, { email: '' }, '必須')
  })
})

// ===========================================================================
// Sites: createSiteSchema
// ===========================================================================
describe('createSiteSchema', () => {
  it('accepts valid name without slug', () => {
    expectSuccess(createSiteSchema, { name: 'My Site' })
  })

  it('accepts valid name with slug', () => {
    expectSuccess(createSiteSchema, { name: 'My Site', slug: 'my-site' })
  })

  it('rejects empty name', () => {
    expectFailure(createSiteSchema, { name: '' }, 'サイト名は1文字以上')
  })

  it('rejects name exceeding 100 chars', () => {
    expectFailure(createSiteSchema, { name: 'x'.repeat(101) }, '100文字以内')
  })

  it('rejects invalid slug format', () => {
    expectFailure(createSiteSchema, { name: 'Test', slug: 'UPPER-CASE' }, '小文字英数字とハイフン')
  })

  it('rejects slug with leading hyphen', () => {
    expectFailure(createSiteSchema, { name: 'Test', slug: '-leading' }, '小文字英数字とハイフン')
  })

  it('rejects slug with trailing hyphen', () => {
    expectFailure(createSiteSchema, { name: 'Test', slug: 'trailing-' }, '小文字英数字とハイフン')
  })

  it('rejects slug with consecutive hyphens', () => {
    expectFailure(createSiteSchema, { name: 'Test', slug: 'double--hyphen' }, '小文字英数字とハイフン')
  })

  it('accepts single-char slug', () => {
    expectSuccess(createSiteSchema, { name: 'Test', slug: 'a' })
  })

  it('trims name whitespace', () => {
    const result = createSiteSchema.safeParse({ name: '  My Site  ' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.name).toBe('My Site')
  })

  it('rejects slug exceeding 100 chars', () => {
    expectFailure(createSiteSchema, { name: 'Test', slug: 'a'.repeat(101) }, '100文字以内')
  })
})

// ===========================================================================
// Sites: updateSiteSchema
// ===========================================================================
describe('updateSiteSchema', () => {
  it('accepts name-only update', () => {
    expectSuccess(updateSiteSchema, { name: 'New Name' })
  })

  it('accepts custom_domain-only update', () => {
    expectSuccess(updateSiteSchema, { custom_domain: 'example.com' })
  })

  it('accepts global_styles-only update', () => {
    expectSuccess(updateSiteSchema, { global_styles: { primaryColor: '#000' } })
  })

  it('accepts null custom_domain (removal)', () => {
    expectSuccess(updateSiteSchema, { custom_domain: null })
  })

  it('rejects empty object (no fields)', () => {
    expectFailure(updateSiteSchema, {}, '少なくとも1つの更新フィールド')
  })

  it('rejects invalid domain format', () => {
    expectFailure(updateSiteSchema, { custom_domain: 'not a domain' }, '有効なドメイン名')
  })

  it('accepts subdomain', () => {
    expectSuccess(updateSiteSchema, { custom_domain: 'sub.example.com' })
  })

  it('rejects domain starting with dot', () => {
    expectFailure(updateSiteSchema, { custom_domain: '.example.com' }, '有効なドメイン名')
  })

  it('rejects domain with port', () => {
    expectFailure(updateSiteSchema, { custom_domain: 'example.com:8080' }, '有効なドメイン名')
  })
})

// ===========================================================================
// Sites: siteIdSchema
// ===========================================================================
describe('siteIdSchema', () => {
  it('accepts valid UUID', () => {
    expectSuccess(siteIdSchema, { siteId: VALID_UUID })
  })

  it('rejects invalid UUID', () => {
    expectFailure(siteIdSchema, { siteId: INVALID_UUID }, 'UUID')
  })

  it('rejects empty string', () => {
    expectFailure(siteIdSchema, { siteId: '' })
  })
})

// ===========================================================================
// Sites: toggleSitePublishSchema
// ===========================================================================
describe('toggleSitePublishSchema', () => {
  it('accepts valid publish toggle', () => {
    expectSuccess(toggleSitePublishSchema, { siteId: VALID_UUID, isPublished: true })
  })

  it('accepts false value', () => {
    expectSuccess(toggleSitePublishSchema, { siteId: VALID_UUID, isPublished: false })
  })

  it('rejects non-boolean isPublished', () => {
    expectFailure(toggleSitePublishSchema, { siteId: VALID_UUID, isPublished: 'yes' })
  })

  it('rejects missing isPublished', () => {
    expectFailure(toggleSitePublishSchema, { siteId: VALID_UUID })
  })
})

// ===========================================================================
// Pages: createPageSchema
// ===========================================================================
describe('createPageSchema', () => {
  it('accepts valid page', () => {
    expectSuccess(createPageSchema, { title: 'About', path: '/about' })
  })

  it('accepts root path', () => {
    expectSuccess(createPageSchema, { title: 'Home', path: '/' })
  })

  it('accepts nested path', () => {
    expectSuccess(createPageSchema, { title: 'Blog', path: '/blog/post-1' })
  })

  it('rejects path without leading slash', () => {
    expectFailure(createPageSchema, { title: 'Test', path: 'no-slash' }, '/ で始まる')
  })

  it('rejects path with uppercase', () => {
    expectFailure(createPageSchema, { title: 'Test', path: '/About' }, '小文字英数字')
  })

  it('rejects path with spaces', () => {
    expectFailure(createPageSchema, { title: 'Test', path: '/my page' }, '小文字英数字')
  })

  it('rejects empty title', () => {
    expectFailure(createPageSchema, { title: '', path: '/' }, 'ページタイトルは1文字以上')
  })

  it('rejects title exceeding 200 chars', () => {
    expectFailure(createPageSchema, { title: 'T'.repeat(201), path: '/' }, '200文字以内')
  })

  it('rejects empty path', () => {
    expectFailure(createPageSchema, { title: 'Test', path: '' }, 'パスは必須')
  })

  it('rejects path exceeding 500 chars', () => {
    expectFailure(createPageSchema, { title: 'Test', path: '/' + 'a'.repeat(500) }, '500文字以内')
  })

  it('accepts path with underscores', () => {
    expectSuccess(createPageSchema, { title: 'Test', path: '/my_page' })
  })

  it('accepts path with hyphens', () => {
    expectSuccess(createPageSchema, { title: 'Test', path: '/my-page' })
  })
})

// ===========================================================================
// Pages: savePageSchema
// ===========================================================================
describe('savePageSchema', () => {
  it('accepts valid save input', () => {
    expectSuccess(savePageSchema, { pageId: VALID_UUID, siteId: VALID_UUID, content: { blocks: [] } })
  })

  it('rejects invalid pageId', () => {
    expectFailure(savePageSchema, { pageId: 'bad', siteId: VALID_UUID, content: {} })
  })

  it('rejects invalid siteId', () => {
    expectFailure(savePageSchema, { pageId: VALID_UUID, siteId: 'bad', content: {} })
  })

  it('accepts empty object as content', () => {
    expectSuccess(savePageSchema, { pageId: VALID_UUID, siteId: VALID_UUID, content: {} })
  })
})

// ===========================================================================
// Pages: togglePagePublishSchema
// ===========================================================================
describe('togglePagePublishSchema', () => {
  it('accepts valid toggle', () => {
    expectSuccess(togglePagePublishSchema, { pageId: VALID_UUID, siteId: VALID_UUID, isPublished: true })
  })

  it('rejects string for isPublished', () => {
    expectFailure(togglePagePublishSchema, { pageId: VALID_UUID, siteId: VALID_UUID, isPublished: 'true' })
  })
})

// ===========================================================================
// Pages: deletePageSchema
// ===========================================================================
describe('deletePageSchema', () => {
  it('accepts valid IDs', () => {
    expectSuccess(deletePageSchema, { pageId: VALID_UUID, siteId: VALID_UUID })
  })

  it('rejects missing pageId', () => {
    expectFailure(deletePageSchema, { siteId: VALID_UUID })
  })

  it('rejects missing siteId', () => {
    expectFailure(deletePageSchema, { pageId: VALID_UUID })
  })
})

// ===========================================================================
// SEO: seoMetaSchema
// ===========================================================================
describe('seoMetaSchema', () => {
  it('accepts full valid SEO meta', () => {
    expectSuccess(seoMetaSchema, { title: 'Page Title', description: 'A description', ogImage: 'https://example.com/img.png' })
  })

  it('accepts empty object (all defaults)', () => {
    expectSuccess(seoMetaSchema, {})
  })

  it('rejects SEO title exceeding 70 chars', () => {
    expectFailure(seoMetaSchema, { title: 'x'.repeat(71) }, '70文字以内')
  })

  it('rejects SEO description exceeding 160 chars', () => {
    expectFailure(seoMetaSchema, { description: 'x'.repeat(161) }, '160文字以内')
  })

  it('rejects invalid ogImage URL', () => {
    expectFailure(seoMetaSchema, { ogImage: 'not-a-url' }, '有効なURL')
  })

  it('accepts empty string for ogImage', () => {
    expectSuccess(seoMetaSchema, { ogImage: '' })
  })

  it('defaults title to empty string', () => {
    const result = seoMetaSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.title).toBe('')
  })

  it('accepts exactly 70-char title', () => {
    expectSuccess(seoMetaSchema, { title: 'x'.repeat(70) })
  })

  it('accepts exactly 160-char description', () => {
    expectSuccess(seoMetaSchema, { description: 'x'.repeat(160) })
  })
})

// ===========================================================================
// CMS: collectionFieldSchema
// ===========================================================================
describe('collectionFieldSchema', () => {
  const validField = { name: 'title', label: 'Title', type: 'text' as const, required: true }

  it('accepts valid field', () => {
    expectSuccess(collectionFieldSchema, validField)
  })

  it('accepts field with default required=false', () => {
    const result = collectionFieldSchema.safeParse({ name: 'body', label: 'Body', type: 'textarea' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.required).toBe(false)
  })

  it('rejects empty field name', () => {
    expectFailure(collectionFieldSchema, { ...validField, name: '' }, 'フィールド名は必須')
  })

  it('rejects field name starting with number', () => {
    expectFailure(collectionFieldSchema, { ...validField, name: '1field' }, 'フィールド名は小文字英字で始まり')
  })

  it('rejects field name with uppercase', () => {
    expectFailure(collectionFieldSchema, { ...validField, name: 'Title' }, 'フィールド名は小文字英字で始まり')
  })

  it('rejects field name with hyphens', () => {
    expectFailure(collectionFieldSchema, { ...validField, name: 'my-field' }, 'フィールド名は小文字英字で始まり')
  })

  it('accepts field name with underscores', () => {
    expectSuccess(collectionFieldSchema, { ...validField, name: 'my_field' })
  })

  it('rejects invalid field type', () => {
    expectFailure(collectionFieldSchema, { ...validField, type: 'invalid' }, '有効なフィールドタイプ')
  })

  it('accepts all valid field types', () => {
    const types = ['text', 'textarea', 'number', 'boolean', 'date', 'image', 'url', 'email', 'select', 'rich_text'] as const
    for (const type of types) {
      expectSuccess(collectionFieldSchema, { ...validField, type })
    }
  })

  it('rejects field name exceeding 50 chars', () => {
    expectFailure(collectionFieldSchema, { ...validField, name: 'a'.repeat(51) }, '50文字以内')
  })

  it('rejects empty label', () => {
    expectFailure(collectionFieldSchema, { ...validField, label: '' }, 'ラベルは1文字以上')
  })

  it('rejects label exceeding 100 chars', () => {
    expectFailure(collectionFieldSchema, { ...validField, label: 'L'.repeat(101) }, '100文字以内')
  })
})

// ===========================================================================
// CMS: createCollectionSchema
// ===========================================================================
describe('createCollectionSchema', () => {
  it('accepts valid collection name', () => {
    expectSuccess(createCollectionSchema, { name: 'Blog Posts' })
  })

  it('rejects empty name', () => {
    expectFailure(createCollectionSchema, { name: '' }, 'コレクション名は1文字以上')
  })

  it('rejects name exceeding 100 chars', () => {
    expectFailure(createCollectionSchema, { name: 'C'.repeat(101) }, '100文字以内')
  })
})

// ===========================================================================
// CMS: updateCollectionFieldsSchema
// ===========================================================================
describe('updateCollectionFieldsSchema', () => {
  const baseInput = {
    collectionId: VALID_UUID,
    siteId: VALID_UUID,
    fields: [{ name: 'title', label: 'Title', type: 'text' as const, required: true }],
  }

  it('accepts valid fields update', () => {
    expectSuccess(updateCollectionFieldsSchema, baseInput)
  })

  it('accepts empty fields array', () => {
    expectSuccess(updateCollectionFieldsSchema, { ...baseInput, fields: [] })
  })

  it('rejects duplicate field names', () => {
    expectFailure(
      updateCollectionFieldsSchema,
      {
        ...baseInput,
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'title', label: 'Title 2', type: 'textarea', required: false },
        ],
      },
      'フィールド名が重複',
    )
  })

  it('rejects more than 50 fields', () => {
    const fields = Array.from({ length: 51 }, (_, i) => ({
      name: `field${i}`,
      label: `Field ${i}`,
      type: 'text' as const,
      required: false,
    }))
    expectFailure(updateCollectionFieldsSchema, { ...baseInput, fields }, '50個以内')
  })

  it('rejects invalid collectionId', () => {
    expectFailure(updateCollectionFieldsSchema, { ...baseInput, collectionId: 'bad' })
  })

  it('accepts exactly 50 fields with unique names', () => {
    const fields = Array.from({ length: 50 }, (_, i) => ({
      name: `f${i}`,
      label: `F ${i}`,
      type: 'text' as const,
      required: false,
    }))
    expectSuccess(updateCollectionFieldsSchema, { ...baseInput, fields })
  })
})

// ===========================================================================
// CMS: deleteCollectionSchema
// ===========================================================================
describe('deleteCollectionSchema', () => {
  it('accepts valid IDs', () => {
    expectSuccess(deleteCollectionSchema, { collectionId: VALID_UUID, siteId: VALID_UUID })
  })

  it('rejects invalid collectionId', () => {
    expectFailure(deleteCollectionSchema, { collectionId: 'bad', siteId: VALID_UUID })
  })
})

// ===========================================================================
// CMS Items: createItemSchema
// ===========================================================================
describe('createItemSchema', () => {
  it('accepts valid item', () => {
    expectSuccess(createItemSchema, { collectionId: VALID_UUID, siteId: VALID_UUID, data: { title: 'Hello' } })
  })

  it('accepts empty data object', () => {
    expectSuccess(createItemSchema, { collectionId: VALID_UUID, siteId: VALID_UUID, data: {} })
  })

  it('rejects missing data', () => {
    expectFailure(createItemSchema, { collectionId: VALID_UUID, siteId: VALID_UUID })
  })

  it('rejects invalid collectionId', () => {
    expectFailure(createItemSchema, { collectionId: 'bad', siteId: VALID_UUID, data: {} })
  })
})

// ===========================================================================
// CMS Items: updateItemSchema
// ===========================================================================
describe('updateItemSchema', () => {
  it('accepts valid update', () => {
    expectSuccess(updateItemSchema, { itemId: VALID_UUID, siteId: VALID_UUID, collectionId: VALID_UUID, data: { title: 'Updated' } })
  })

  it('rejects invalid itemId', () => {
    expectFailure(updateItemSchema, { itemId: 'bad', siteId: VALID_UUID, collectionId: VALID_UUID, data: {} })
  })
})

// ===========================================================================
// CMS Items: toggleItemPublishSchema
// ===========================================================================
describe('toggleItemPublishSchema', () => {
  it('accepts valid toggle', () => {
    expectSuccess(toggleItemPublishSchema, { itemId: VALID_UUID, siteId: VALID_UUID, collectionId: VALID_UUID, isPublished: true })
  })

  it('rejects non-boolean', () => {
    expectFailure(toggleItemPublishSchema, { itemId: VALID_UUID, siteId: VALID_UUID, collectionId: VALID_UUID, isPublished: 1 })
  })
})

// ===========================================================================
// CMS Items: deleteItemSchema
// ===========================================================================
describe('deleteItemSchema', () => {
  it('accepts valid IDs', () => {
    expectSuccess(deleteItemSchema, { itemId: VALID_UUID, siteId: VALID_UUID, collectionId: VALID_UUID })
  })

  it('rejects missing collectionId', () => {
    expectFailure(deleteItemSchema, { itemId: VALID_UUID, siteId: VALID_UUID })
  })
})

// ===========================================================================
// Media: uploadMediaSchema
// ===========================================================================
describe('uploadMediaSchema', () => {
  const validMedia = {
    siteId: VALID_UUID,
    fileName: 'photo.jpg',
    mimeType: 'image/jpeg' as const,
    sizeBytes: 1024,
  }

  it('accepts valid upload input', () => {
    expectSuccess(uploadMediaSchema, validMedia)
  })

  it('accepts upload with optional dimensions', () => {
    expectSuccess(uploadMediaSchema, { ...validMedia, width: 1920, height: 1080 })
  })

  it('accepts upload with altText', () => {
    expectSuccess(uploadMediaSchema, { ...validMedia, altText: 'A photo' })
  })

  it('accepts null for optional fields', () => {
    expectSuccess(uploadMediaSchema, { ...validMedia, width: null, height: null, altText: null })
  })

  it('rejects empty fileName', () => {
    expectFailure(uploadMediaSchema, { ...validMedia, fileName: '' }, 'ファイル名は必須')
  })

  it('rejects fileName with forbidden characters', () => {
    expectFailure(uploadMediaSchema, { ...validMedia, fileName: 'file<name>.jpg' }, '使用できない文字')
  })

  it('rejects invalid mimeType', () => {
    expectFailure(uploadMediaSchema, { ...validMedia, mimeType: 'application/json' }, '許可されていないファイル形式')
  })

  it('rejects zero sizeBytes', () => {
    expectFailure(uploadMediaSchema, { ...validMedia, sizeBytes: 0 }, '正の数')
  })

  it('rejects negative sizeBytes', () => {
    expectFailure(uploadMediaSchema, { ...validMedia, sizeBytes: -100 }, '正の数')
  })

  it('rejects sizeBytes exceeding 50MB', () => {
    expectFailure(uploadMediaSchema, { ...validMedia, sizeBytes: 50 * 1024 * 1024 + 1 }, '50MB以内')
  })

  it('accepts exactly 50MB', () => {
    expectSuccess(uploadMediaSchema, { ...validMedia, sizeBytes: 50 * 1024 * 1024 })
  })

  it('rejects float sizeBytes', () => {
    expectFailure(uploadMediaSchema, { ...validMedia, sizeBytes: 1024.5 }, '整数')
  })

  it('rejects altText exceeding 500 chars', () => {
    expectFailure(uploadMediaSchema, { ...validMedia, altText: 'x'.repeat(501) }, '500文字以内')
  })

  it('accepts all valid MIME types', () => {
    const mimeTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'image/svg+xml', 'image/avif', 'application/pdf',
      'video/mp4', 'video/webm',
    ] as const
    for (const mimeType of mimeTypes) {
      expectSuccess(uploadMediaSchema, { ...validMedia, mimeType })
    }
  })

  it('rejects fileName exceeding 255 chars', () => {
    expectFailure(uploadMediaSchema, { ...validMedia, fileName: 'a'.repeat(256) }, '255文字以内')
  })
})

// ===========================================================================
// Form: formSubmissionSchema
// ===========================================================================
describe('formSubmissionSchema', () => {
  const validSubmission = {
    siteId: VALID_UUID,
    formName: 'Contact',
    data: { name: 'Taro', message: 'Hello' },
  }

  it('accepts valid submission', () => {
    expectSuccess(formSubmissionSchema, validSubmission)
  })

  it('accepts submission with pageId', () => {
    expectSuccess(formSubmissionSchema, { ...validSubmission, pageId: VALID_UUID })
  })

  it('accepts submission with null pageId', () => {
    expectSuccess(formSubmissionSchema, { ...validSubmission, pageId: null })
  })

  it('rejects empty formName', () => {
    expectFailure(formSubmissionSchema, { ...validSubmission, formName: '' }, 'フォーム名は1文字以上')
  })

  it('rejects formName exceeding 100 chars', () => {
    expectFailure(formSubmissionSchema, { ...validSubmission, formName: 'F'.repeat(101) }, '100文字以内')
  })

  it('rejects invalid siteId', () => {
    expectFailure(formSubmissionSchema, { ...validSubmission, siteId: 'bad' })
  })

  it('rejects invalid pageId format', () => {
    expectFailure(formSubmissionSchema, { ...validSubmission, pageId: 'not-uuid' })
  })

  it('rejects missing data', () => {
    expectFailure(formSubmissionSchema, { siteId: VALID_UUID, formName: 'Contact' })
  })
})

// ===========================================================================
// Edge cases & integration
// ===========================================================================
describe('edge cases', () => {
  it('signUpSchema rejects password of exactly 128+1 chars', () => {
    expectFailure(signUpSchema, {
      email: 'a@b.com',
      password: 'A1' + 'a'.repeat(127),
      name: 'X',
    }, '128文字以内')
  })

  it('signUpSchema accepts password of exactly 128 chars', () => {
    // 128 chars total: starts with "A1" + 126 lowercase letters
    expectSuccess(signUpSchema, {
      email: 'a@b.com',
      password: 'A1' + 'a'.repeat(126),
      name: 'X',
    })
  })

  it('createPageSchema accepts path with only slash', () => {
    expectSuccess(createPageSchema, { title: 'Home', path: '/' })
  })

  it('slug rejects spaces', () => {
    expectFailure(createSiteSchema, { name: 'Test', slug: 'has space' })
  })

  it('slug rejects special characters', () => {
    expectFailure(createSiteSchema, { name: 'Test', slug: 'hello@world' })
  })

  it('updateSiteSchema accepts combined update', () => {
    expectSuccess(updateSiteSchema, { name: 'New', custom_domain: 'new.com', global_styles: { theme: 'dark' } })
  })

  it('collectionFieldSchema rejects name starting with underscore', () => {
    expectFailure(collectionFieldSchema, { name: '_hidden', label: 'Hidden', type: 'text', required: false })
  })

  it('createPageSchema rejects path with query params', () => {
    expectFailure(createPageSchema, { title: 'Test', path: '/page?q=1' })
  })

  it('createPageSchema rejects path with hash', () => {
    expectFailure(createPageSchema, { title: 'Test', path: '/page#section' })
  })

  it('seoMetaSchema accepts partial input', () => {
    expectSuccess(seoMetaSchema, { title: 'Only Title' })
  })

  it('uploadMediaSchema rejects fileName with null bytes', () => {
    expectFailure(uploadMediaSchema, {
      siteId: VALID_UUID,
      fileName: 'file\x00.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 1024,
    })
  })

  it('multiple schemas validate UUID consistently', () => {
    const badId = '12345'
    expectFailure(siteIdSchema, { siteId: badId })
    expectFailure(deletePageSchema, { pageId: badId, siteId: VALID_UUID })
    expectFailure(deleteCollectionSchema, { collectionId: badId, siteId: VALID_UUID })
    expectFailure(deleteItemSchema, { itemId: badId, siteId: VALID_UUID, collectionId: VALID_UUID })
  })
})
