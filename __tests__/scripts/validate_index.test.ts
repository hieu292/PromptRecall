/**
 * Tests for validate_index script.
 */

import * as fs from 'fs';
import * as path from 'path';
import { validateFile } from '../../scripts/validate_index.js';

describe('validateFile', () => {
  const testDir = path.join(process.cwd(), '__tests__', 'fixtures', 'index');

  beforeAll(() => {
    // Create test fixtures directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up test fixtures
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should return true for a valid index file', () => {
    const validIndex = {
      version: '1.0.0',
      name: 'Test Index',
      description: 'Test index for validation',
      promptTemplates: [
        {
          id: 'test-template-1',
          name: 'Test Template',
          description: 'Test template description',
          author: 'Test Author',
          version: '1.0.0',
          locale: 'en',
          category: 'test-category',
          importUrl: 'https://example.com/template.json',
          examples: [
            {
              category: 'Theory',
              templateString: 'Example 1',
              name: 'Example 1',
            },
            {
              category: 'Theory',
              templateString: 'Example 2',
              name: 'Example 2',
            },
            {
              category: 'Theory',
              templateString: 'Example 3',
              name: 'Example 3',
            },
            {
              category: 'Practice',
              templateString: 'Example 4',
              name: 'Example 4',
            },
            {
              category: 'Practice',
              templateString: 'Example 5',
              name: 'Example 5',
            },
          ],
        },
      ],
      sources: [
        {
          id: 'test-source-1',
          name: 'Test Source',
          description: 'Test source description',
          author: 'Test Author',
          version: '1.0.0',
          locale: 'en',
          category: 'test-category',
          itemCount: 100,
          importUrl: 'https://example.com/source.json',
          examples: [
            {
              label: 'example1',
              tags: ['A1', 'noun'],
            },
            {
              label: 'example2',
              tags: ['A2', 'verb'],
            },
            {
              label: 'example3',
              tags: ['B1', 'adjective'],
            },
            {
              label: 'example4',
              tags: ['B2', 'adverb'],
            },
            {
              label: 'example5',
              tags: ['C1', 'noun'],
            },
          ],
        },
      ],
    };

    const filePath = path.join(testDir, 'valid-index.json');
    fs.writeFileSync(filePath, JSON.stringify(validIndex, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(true);
  });

  it('should return false for missing version field', () => {
    const missingVersion = {
      name: 'Test Index',
      description: 'Test description',
      promptTemplates: [],
      sources: [],
    };

    const filePath = path.join(testDir, 'missing-version.json');
    fs.writeFileSync(filePath, JSON.stringify(missingVersion, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for missing name field', () => {
    const missingName = {
      version: '1.0.0',
      description: 'Test description',
      promptTemplates: [],
      sources: [],
    };

    const filePath = path.join(testDir, 'missing-name.json');
    fs.writeFileSync(filePath, JSON.stringify(missingName, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for missing description field', () => {
    const missingDescription = {
      version: '1.0.0',
      name: 'Test Index',
      promptTemplates: [],
      sources: [],
    };

    const filePath = path.join(testDir, 'missing-description.json');
    fs.writeFileSync(filePath, JSON.stringify(missingDescription, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for missing promptTemplates field', () => {
    const missingPromptTemplates = {
      version: '1.0.0',
      name: 'Test Index',
      description: 'Test description',
      sources: [],
    };

    const filePath = path.join(testDir, 'missing-prompt-templates.json');
    fs.writeFileSync(filePath, JSON.stringify(missingPromptTemplates, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for missing sources field', () => {
    const missingSources = {
      version: '1.0.0',
      name: 'Test Index',
      description: 'Test description',
      promptTemplates: [],
    };

    const filePath = path.join(testDir, 'missing-sources.json');
    fs.writeFileSync(filePath, JSON.stringify(missingSources, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for prompt template entry missing id', () => {
    const missingId = {
      version: '1.0.0',
      name: 'Test Index',
      description: 'Test description',
      promptTemplates: [
        {
          name: 'Test Template',
          description: 'Test description',
          author: 'Test Author',
          version: '1.0.0',
          locale: 'en',
          category: 'test',
          importUrl: 'https://example.com/test.json',
          examples: [],
        },
      ],
      sources: [],
    };

    const filePath = path.join(testDir, 'missing-id.json');
    fs.writeFileSync(filePath, JSON.stringify(missingId, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for duplicate prompt template IDs', () => {
    const duplicateIds = {
      version: '1.0.0',
      name: 'Test Index',
      description: 'Test description',
      promptTemplates: [
        {
          id: 'duplicate-id',
          name: 'Template 1',
          description: 'Description 1',
          author: 'Author',
          version: '1.0.0',
          locale: 'en',
          category: 'test',
          importUrl: 'https://example.com/1.json',
          examples: [
            { category: 'Theory', templateString: 'Ex1', name: 'Ex1' },
            { category: 'Theory', templateString: 'Ex2', name: 'Ex2' },
            { category: 'Theory', templateString: 'Ex3', name: 'Ex3' },
            { category: 'Practice', templateString: 'Ex4', name: 'Ex4' },
            { category: 'Practice', templateString: 'Ex5', name: 'Ex5' },
          ],
        },
        {
          id: 'duplicate-id',
          name: 'Template 2',
          description: 'Description 2',
          author: 'Author',
          version: '1.0.0',
          locale: 'en',
          category: 'test',
          importUrl: 'https://example.com/2.json',
          examples: [
            { category: 'Theory', templateString: 'Ex1', name: 'Ex1' },
            { category: 'Theory', templateString: 'Ex2', name: 'Ex2' },
            { category: 'Theory', templateString: 'Ex3', name: 'Ex3' },
            { category: 'Practice', templateString: 'Ex4', name: 'Ex4' },
            { category: 'Practice', templateString: 'Ex5', name: 'Ex5' },
          ],
        },
      ],
      sources: [],
    };

    const filePath = path.join(testDir, 'duplicate-ids.json');
    fs.writeFileSync(filePath, JSON.stringify(duplicateIds, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for duplicate source IDs', () => {
    const duplicateSourceIds = {
      version: '1.0.0',
      name: 'Test Index',
      description: 'Test description',
      promptTemplates: [],
      sources: [
        {
          id: 'duplicate-source-id',
          name: 'Source 1',
          description: 'Description 1',
          author: 'Author',
          version: '1.0.0',
          locale: 'en',
          category: 'test',
          itemCount: 100,
          importUrl: 'https://example.com/1.json',
          examples: [
            { label: 'ex1', tags: ['A1'] },
            { label: 'ex2', tags: ['A2'] },
            { label: 'ex3', tags: ['B1'] },
            { label: 'ex4', tags: ['B2'] },
            { label: 'ex5', tags: ['C1'] },
          ],
        },
        {
          id: 'duplicate-source-id',
          name: 'Source 2',
          description: 'Description 2',
          author: 'Author',
          version: '1.0.0',
          locale: 'en',
          category: 'test',
          itemCount: 200,
          importUrl: 'https://example.com/2.json',
          examples: [
            { label: 'ex1', tags: ['A1'] },
            { label: 'ex2', tags: ['A2'] },
            { label: 'ex3', tags: ['B1'] },
            { label: 'ex4', tags: ['B2'] },
            { label: 'ex5', tags: ['C1'] },
          ],
        },
      ],
    };

    const filePath = path.join(testDir, 'duplicate-source-ids.json');
    fs.writeFileSync(filePath, JSON.stringify(duplicateSourceIds, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for prompt template with wrong number of examples', () => {
    const wrongExampleCount = {
      version: '1.0.0',
      name: 'Test Index',
      description: 'Test description',
      promptTemplates: [
        {
          id: 'test-template',
          name: 'Test Template',
          description: 'Test description',
          author: 'Test Author',
          version: '1.0.0',
          locale: 'en',
          category: 'test',
          importUrl: 'https://example.com/test.json',
          examples: [
            { category: 'Theory', templateString: 'Ex1', name: 'Ex1' },
            { category: 'Theory', templateString: 'Ex2', name: 'Ex2' },
          ],
        },
      ],
      sources: [],
    };

    const filePath = path.join(testDir, 'wrong-example-count.json');
    fs.writeFileSync(filePath, JSON.stringify(wrongExampleCount, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for source with wrong number of examples', () => {
    const wrongSourceExampleCount = {
      version: '1.0.0',
      name: 'Test Index',
      description: 'Test description',
      promptTemplates: [],
      sources: [
        {
          id: 'test-source',
          name: 'Test Source',
          description: 'Test description',
          author: 'Test Author',
          version: '1.0.0',
          locale: 'en',
          category: 'test',
          itemCount: 100,
          importUrl: 'https://example.com/test.json',
          examples: [
            { label: 'ex1', tags: ['A1'] },
            { label: 'ex2', tags: ['A2'] },
          ],
        },
      ],
    };

    const filePath = path.join(testDir, 'wrong-source-example-count.json');
    fs.writeFileSync(filePath, JSON.stringify(wrongSourceExampleCount, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for source example with empty tags', () => {
    const emptyTags = {
      version: '1.0.0',
      name: 'Test Index',
      description: 'Test description',
      promptTemplates: [],
      sources: [
        {
          id: 'test-source',
          name: 'Test Source',
          description: 'Test description',
          author: 'Test Author',
          version: '1.0.0',
          locale: 'en',
          category: 'test',
          itemCount: 100,
          importUrl: 'https://example.com/test.json',
          examples: [
            { label: 'ex1', tags: [] },
            { label: 'ex2', tags: ['A2'] },
            { label: 'ex3', tags: ['B1'] },
            { label: 'ex4', tags: ['B2'] },
            { label: 'ex5', tags: ['C1'] },
          ],
        },
      ],
    };

    const filePath = path.join(testDir, 'empty-tags.json');
    fs.writeFileSync(filePath, JSON.stringify(emptyTags, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for invalid JSON', () => {
    const filePath = path.join(testDir, 'invalid-json.json');
    fs.writeFileSync(filePath, '{ invalid json }');

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for non-existent file', () => {
    const filePath = path.join(testDir, 'non-existent.json');

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for source missing itemCount', () => {
    const missingItemCount = {
      version: '1.0.0',
      name: 'Test Index',
      description: 'Test description',
      promptTemplates: [],
      sources: [
        {
          id: 'test-source',
          name: 'Test Source',
          description: 'Test description',
          author: 'Test Author',
          version: '1.0.0',
          locale: 'en',
          category: 'test',
          importUrl: 'https://example.com/test.json',
          examples: [
            { label: 'ex1', tags: ['A1'] },
            { label: 'ex2', tags: ['A2'] },
            { label: 'ex3', tags: ['B1'] },
            { label: 'ex4', tags: ['B2'] },
            { label: 'ex5', tags: ['C1'] },
          ],
        },
      ],
    };

    const filePath = path.join(testDir, 'missing-item-count.json');
    fs.writeFileSync(filePath, JSON.stringify(missingItemCount, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });
});
