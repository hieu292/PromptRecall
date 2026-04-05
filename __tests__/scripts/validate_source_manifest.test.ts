/**
 * Tests for validate_source_manifest script.
 */

import * as fs from 'fs';
import * as path from 'path';
import { validateFile } from '../../scripts/validate_source_manifest.js';

describe('validateFile', () => {
  const testDir = path.join(process.cwd(), '__tests__', 'fixtures');
  
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

  it('should return true for a valid manifest file', () => {
    const validManifest = {
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
      ],
      tags: [{ name: 'A1' }, { name: 'greeting' }],
      promptTemplates: [],
    };

    const filePath = path.join(testDir, 'valid-manifest.json');
    fs.writeFileSync(filePath, JSON.stringify(validManifest, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(true);
  });

  it('should return false for an invalid manifest file', () => {
    const invalidManifest = {
      name: 'Test',
      // Missing required fields
    };

    const filePath = path.join(testDir, 'invalid-manifest.json');
    fs.writeFileSync(filePath, JSON.stringify(invalidManifest, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for a file with invalid JSON', () => {
    const filePath = path.join(testDir, 'invalid-json.json');
    fs.writeFileSync(filePath, '{ invalid json }');

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for a non-existent file', () => {
    const filePath = path.join(testDir, 'non-existent.json');

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should validate manifest with all optional fields', () => {
    const manifestWithOptionals = {
      schemaVersion: '1.0.0',
      name: 'Complete Test',
      description: 'A complete test manifest',
      author: 'Test Author',
      version: '1.0.0',
      locale: 'en',
      items: [
        {
          label: 'test',
          tags: ['A1'],
          description: 'Test item',
          metadata: {
            example: 'This is a test',
          },
        },
      ],
      tags: [{ name: 'A1' }],
      promptTemplates: [
        {
          name: 'Translation',
          category: 'translation',
          templateString: 'Translate "{{ label }}"',
        },
      ],
      originUrl: 'https://example.com/manifest.json',
      installedAt: '2026-04-05T00:00:00.000Z',
    };

    const filePath = path.join(testDir, 'complete-manifest.json');
    fs.writeFileSync(filePath, JSON.stringify(manifestWithOptionals, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(true);
  });

  it('should return false for manifest with wrong schemaVersion', () => {
    const wrongVersionManifest = {
      schemaVersion: '2.0.0',
      name: 'Test',
      description: 'Test',
      author: 'Test',
      version: '1.0.0',
      locale: 'en',
      items: [],
      tags: [],
      promptTemplates: [],
    };

    const filePath = path.join(testDir, 'wrong-version.json');
    fs.writeFileSync(filePath, JSON.stringify(wrongVersionManifest, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for manifest with invalid item structure', () => {
    const invalidItemManifest = {
      schemaVersion: '1.0.0',
      name: 'Test',
      description: 'Test',
      author: 'Test',
      version: '1.0.0',
      locale: 'en',
      items: [
        {
          label: 'test',
          // Missing required tags field
        },
      ],
      tags: [],
      promptTemplates: [],
    };

    const filePath = path.join(testDir, 'invalid-item.json');
    fs.writeFileSync(filePath, JSON.stringify(invalidItemManifest, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for manifest with invalid template structure', () => {
    const invalidTemplateManifest = {
      schemaVersion: '1.0.0',
      name: 'Test',
      description: 'Test',
      author: 'Test',
      version: '1.0.0',
      locale: 'en',
      items: [],
      tags: [],
      promptTemplates: [
        {
          name: 'Test',
          // Missing required category and templateString
        },
      ],
    };

    const filePath = path.join(testDir, 'invalid-template.json');
    fs.writeFileSync(filePath, JSON.stringify(invalidTemplateManifest, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });
});
