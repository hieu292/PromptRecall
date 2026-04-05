/**
 * Tests for source manifest type validation.
 */

import {
  validateSourceManifest,
  isSourceManifest,
  assertSourceManifest,
  type SourceManifest,
} from '../../lib/sourceManifest.types.js';

describe('validateSourceManifest', () => {
  const validManifest: SourceManifest = {
    schemaVersion: '1.0.0',
    name: 'Test Vocabulary',
    description: 'A test vocabulary source',
    author: 'Test Author',
    version: '1.0.0',
    locale: 'en',
    items: [
      {
        label: 'hello',
        tags: ['A1', 'greeting'],
      },
      {
        label: 'goodbye',
        tags: ['A1', 'greeting'],
        description: 'A farewell greeting',
        metadata: {
          example: 'Goodbye, see you later!',
        },
      },
    ],
    tags: [{ name: 'A1' }, { name: 'greeting' }],
    promptTemplates: [
      {
        name: 'Translation',
        category: 'translation',
        templateString: 'Translate "{{ label }}" to Vietnamese',
      },
    ],
  };

  it('should validate a correct manifest', () => {
    const result = validateSourceManifest(validManifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject non-object data', () => {
    const result = validateSourceManifest('not an object');
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toContain('must be an object');
  });

  it('should reject null data', () => {
    const result = validateSourceManifest(null);
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toContain('must be an object');
  });

  it('should reject missing schemaVersion', () => {
    const invalid = { ...validManifest };
    delete (invalid as Record<string, unknown>).schemaVersion;
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'schemaVersion')).toBe(true);
  });

  it('should reject unsupported schemaVersion', () => {
    const invalid = { ...validManifest, schemaVersion: '2.0.0' as unknown as '1.0.0' };
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'schemaVersion' && e.expected === '1.0.0')).toBe(
      true
    );
  });

  it('should reject missing name', () => {
    const invalid = { ...validManifest };
    delete (invalid as Record<string, unknown>).name;
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'name')).toBe(true);
  });

  it('should reject missing description', () => {
    const invalid = { ...validManifest };
    delete (invalid as Record<string, unknown>).description;
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'description')).toBe(true);
  });

  it('should reject missing author', () => {
    const invalid = { ...validManifest };
    delete (invalid as Record<string, unknown>).author;
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'author')).toBe(true);
  });

  it('should reject missing version', () => {
    const invalid = { ...validManifest };
    delete (invalid as Record<string, unknown>).version;
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'version')).toBe(true);
  });

  it('should reject non-array items', () => {
    const invalid = { ...validManifest, items: 'not an array' as unknown as [] };
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'items')).toBe(true);
  });

  it('should reject item without label', () => {
    const invalid = {
      ...validManifest,
      items: [{ tags: ['A1'] } as { label: string; tags: string[] }],
    };
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'items[0].label')).toBe(true);
  });

  it('should reject item without tags', () => {
    const invalid = {
      ...validManifest,
      items: [{ label: 'test' } as { label: string; tags: string[] }],
    };
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'items[0].tags')).toBe(true);
  });

  it('should reject item with invalid description type', () => {
    const invalid = {
      ...validManifest,
      items: [{ label: 'test', tags: ['A1'], description: 123 } as unknown as { label: string; tags: string[] }],
    };
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'items[0].description')).toBe(true);
  });

  it('should reject item with invalid metadata type', () => {
    const invalid = {
      ...validManifest,
      items: [{ label: 'test', tags: ['A1'], metadata: 'not an object' } as unknown as { label: string; tags: string[] }],
    };
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'items[0].metadata')).toBe(true);
  });

  it('should reject non-array tags', () => {
    const invalid = { ...validManifest, tags: 'not an array' as unknown as [] };
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'tags')).toBe(true);
  });

  it('should reject tag without name', () => {
    const invalid = {
      ...validManifest,
      tags: [{} as { name: string }],
    };
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'tags[0].name')).toBe(true);
  });

  it('should reject non-array promptTemplates', () => {
    const invalid = { ...validManifest, promptTemplates: 'not an array' as unknown as [] };
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'promptTemplates')).toBe(true);
  });

  it('should reject template without category', () => {
    const invalid = {
      ...validManifest,
      promptTemplates: [{ name: 'test', templateString: 'test' } as { name: string; category: string; templateString: string }],
    };
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'promptTemplates[0].category')).toBe(true);
  });

  it('should reject template without templateString', () => {
    const invalid = {
      ...validManifest,
      promptTemplates: [{ name: 'test', category: 'test' } as { name: string; category: string; templateString: string }],
    };
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'promptTemplates[0].templateString')).toBe(true);
  });

  it('should reject missing locale', () => {
    const invalid = { ...validManifest };
    delete (invalid as Record<string, unknown>).locale;
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'locale')).toBe(true);
  });

  it('should reject invalid locale type', () => {
    const invalid = {
      ...validManifest,
      locale: 123,
    } as unknown as SourceManifest;
    const result = validateSourceManifest(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === 'locale')).toBe(true);
  });

  it('should accept manifest with empty arrays', () => {
    const valid = {
      ...validManifest,
      items: [],
      tags: [],
      promptTemplates: [],
    };
    const result = validateSourceManifest(valid);
    expect(result.valid).toBe(true);
  });

  it('should accept manifest with optional fields', () => {
    const valid = {
      ...validManifest,
      originUrl: 'https://example.com/manifest.json',
      installedAt: '2026-04-05T00:00:00.000Z',
    };
    const result = validateSourceManifest(valid);
    expect(result.valid).toBe(true);
  });
});

describe('isSourceManifest', () => {
  it('should return true for valid manifest', () => {
    const valid: SourceManifest = {
      schemaVersion: '1.0.0',
      name: 'Test',
      description: 'Test',
      author: 'Test',
      version: '1.0.0',
      locale: 'en',
      items: [],
      tags: [],
      promptTemplates: [],
    };
    expect(isSourceManifest(valid)).toBe(true);
  });

  it('should return false for invalid manifest', () => {
    const invalid = { name: 'Test' };
    expect(isSourceManifest(invalid)).toBe(false);
  });
});

describe('assertSourceManifest', () => {
  it('should not throw for valid manifest', () => {
    const valid: SourceManifest = {
      schemaVersion: '1.0.0',
      name: 'Test',
      description: 'Test',
      author: 'Test',
      version: '1.0.0',
      locale: 'en',
      items: [],
      tags: [],
      promptTemplates: [],
    };
    expect(() => assertSourceManifest(valid)).not.toThrow();
  });

  it('should throw for invalid manifest', () => {
    const invalid = { name: 'Test' };
    expect(() => assertSourceManifest(invalid)).toThrow('Invalid source manifest');
  });

  it('should include error details in thrown error', () => {
    const invalid = { name: 'Test' };
    try {
      assertSourceManifest(invalid);
      fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('schemaVersion');
    }
  });
});
