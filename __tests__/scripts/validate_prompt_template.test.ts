/**
 * Tests for validate_prompt_template script.
 */

import * as fs from 'fs';
import * as path from 'path';
import { validateFile } from '../../scripts/validate_prompt_template.js';

describe('validateFile', () => {
  const testDir = path.join(process.cwd(), '__tests__', 'fixtures', 'prompt-templates');

  beforeAll(() => {
    // Create test fixtures directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up test fixtures
    const fixturesDir = path.join(process.cwd(), '__tests__', 'fixtures');
    if (fs.existsSync(fixturesDir)) {
      fs.rmSync(fixturesDir, { recursive: true, force: true });
    }
  });

  it('should return true for a valid prompt template file', () => {
    const validTemplate = {
      schemaVersion: '1.0.0',
      name: 'Test Prompt Templates',
      description: 'Test prompt templates for validation',
      author: 'Test Author',
      locale: 'en',
      promptTemplates: [
        {
          category: 'Theory',
          templateString: 'Explain {{ item }}',
          name: 'Basic Explanation',
        },
      ],
    };

    const filePath = path.join(testDir, 'valid-template.json');
    fs.writeFileSync(filePath, JSON.stringify(validTemplate, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(true);
  });

  it('should return false for an invalid prompt template file', () => {
    const invalidTemplate = {
      name: 'Test',
      // Missing required fields
    };

    const filePath = path.join(testDir, 'invalid-template.json');
    fs.writeFileSync(filePath, JSON.stringify(invalidTemplate, null, 2));

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

  it('should validate template with optional locale field', () => {
    const templateWithLocale = {
      schemaVersion: '1.0.0',
      name: 'Localized Templates',
      description: 'Templates with locale support',
      author: 'Test Author',
      locale: 'en',
      promptTemplates: [
        {
          category: 'Translation',
          templateString: 'Translate {{ item }}',
          name: 'Translation',
        },
      ],
    };

    const filePath = path.join(testDir, 'template-with-locale.json');
    fs.writeFileSync(filePath, JSON.stringify(templateWithLocale, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(true);
  });

  it('should return false for template with wrong schemaVersion', () => {
    const wrongVersionTemplate = {
      schemaVersion: '2.0.0',
      name: 'Test',
      description: 'Test description',
      author: 'Test Author',
      locale: 'en',
      promptTemplates: [],
    };

    const filePath = path.join(testDir, 'wrong-version.json');
    fs.writeFileSync(filePath, JSON.stringify(wrongVersionTemplate, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for template with invalid template structure', () => {
    const invalidTemplateStructure = {
      schemaVersion: '1.0.0',
      name: 'Test',
      description: 'Test description',
      author: 'Test Author',
      locale: 'en',
      promptTemplates: [
        {
          name: 'Test',
          // Missing required category and templateString
        },
      ],
    };

    const filePath = path.join(testDir, 'invalid-structure.json');
    fs.writeFileSync(filePath, JSON.stringify(invalidTemplateStructure, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for missing name field', () => {
    const missingName = {
      schemaVersion: '1.0.0',
      locale: 'en',
      promptTemplates: [],
    };

    const filePath = path.join(testDir, 'missing-name.json');
    fs.writeFileSync(filePath, JSON.stringify(missingName, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for missing promptTemplates field', () => {
    const missingTemplates = {
      schemaVersion: '1.0.0',
      name: 'Test',
      description: 'Test description',
      author: 'Test Author',
      locale: 'en',
    };

    const filePath = path.join(testDir, 'missing-templates.json');
    fs.writeFileSync(filePath, JSON.stringify(missingTemplates, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for missing description field', () => {
    const missingDescription = {
      schemaVersion: '1.0.0',
      name: 'Test',
      author: 'Test Author',
      locale: 'en',
      promptTemplates: [],
    };

    const filePath = path.join(testDir, 'missing-description.json');
    fs.writeFileSync(filePath, JSON.stringify(missingDescription, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should return false for missing author field', () => {
    const missingAuthor = {
      schemaVersion: '1.0.0',
      name: 'Test',
      description: 'Test description',
      locale: 'en',
      promptTemplates: [],
    };

    const filePath = path.join(testDir, 'missing-author.json');
    fs.writeFileSync(filePath, JSON.stringify(missingAuthor, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(false);
  });

  it('should validate multiple templates', () => {
    const multipleTemplates = {
      schemaVersion: '1.0.0',
      name: 'Multiple Templates',
      description: 'Collection of multiple templates',
      author: 'Test Author',
      locale: 'en',
      promptTemplates: [
        {
          category: 'Theory',
          templateString: 'Explain {{ item }}',
          name: 'Explanation',
        },
        {
          category: 'Practice',
          templateString: 'Practice {{ item }}',
          name: 'Practice Exercise',
        },
      ],
    };

    const filePath = path.join(testDir, 'multiple-templates.json');
    fs.writeFileSync(filePath, JSON.stringify(multipleTemplates, null, 2));

    const result = validateFile(filePath);
    expect(result).toBe(true);
  });
});
