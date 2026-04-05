#!/usr/bin/env tsx
/**
 * Index Validator
 *
 * Validates the index.json file against the schema.
 *
 * Usage:
 *   npx tsx scripts/validate_index.ts [path-to-index.json]
 *   npx tsx scripts/validate_index.ts (defaults to index.json)
 */

import * as fs from 'fs';
import * as path from 'path';

interface PromptTemplateExample {
  category: string;
  templateString: string;
  name: string;
}

interface PromptTemplateEntry {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  locale: string;
  category: string;
  importUrl: string;
  examples: PromptTemplateExample[];
}

interface SourceExample {
  label: string;
  tags: string[];
}

interface SourceEntry {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  locale: string;
  category: string;
  itemCount: number;
  importUrl: string;
  examples: SourceExample[];
}

interface IndexManifest {
  version: string;
  name: string;
  description: string;
  promptTemplates: PromptTemplateEntry[];
  sources: SourceEntry[];
}

interface ValidationError {
  message: string;
  path?: string;
  expected?: string;
  actual?: unknown;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validates a prompt template entry.
 */
function validatePromptTemplateEntry(
  entry: Partial<PromptTemplateEntry>,
  index: number,
  errors: ValidationError[]
): void {
  const basePath = `promptTemplates[${index}]`;

  if (!entry.id || typeof entry.id !== 'string') {
    errors.push({
      message: 'Missing or invalid field: id',
      path: `${basePath}.id`,
      expected: 'string',
    });
  }

  if (!entry.name || typeof entry.name !== 'string') {
    errors.push({
      message: 'Missing or invalid field: name',
      path: `${basePath}.name`,
      expected: 'string',
    });
  }

  if (!entry.description || typeof entry.description !== 'string') {
    errors.push({
      message: 'Missing or invalid field: description',
      path: `${basePath}.description`,
      expected: 'string',
    });
  }

  if (!entry.author || typeof entry.author !== 'string') {
    errors.push({
      message: 'Missing or invalid field: author',
      path: `${basePath}.author`,
      expected: 'string',
    });
  }

  if (!entry.version || typeof entry.version !== 'string') {
    errors.push({
      message: 'Missing or invalid field: version',
      path: `${basePath}.version`,
      expected: 'string',
    });
  }

  if (!entry.locale || typeof entry.locale !== 'string') {
    errors.push({
      message: 'Missing or invalid field: locale',
      path: `${basePath}.locale`,
      expected: 'string',
    });
  }

  if (!entry.category || typeof entry.category !== 'string') {
    errors.push({
      message: 'Missing or invalid field: category',
      path: `${basePath}.category`,
      expected: 'string',
    });
  }

  if (!entry.importUrl || typeof entry.importUrl !== 'string') {
    errors.push({
      message: 'Missing or invalid field: importUrl',
      path: `${basePath}.importUrl`,
      expected: 'string',
    });
  }

  // Validate examples array
  if (!Array.isArray(entry.examples)) {
    errors.push({
      message: 'Missing or invalid field: examples',
      path: `${basePath}.examples`,
      expected: 'array',
    });
  } else {
    if (entry.examples.length !== 5) {
      errors.push({
        message: 'Examples array must contain exactly 5 items',
        path: `${basePath}.examples`,
        expected: '5 items',
        actual: entry.examples.length,
      });
    }

    entry.examples.forEach((example, exIndex) => {
      const exPath = `${basePath}.examples[${exIndex}]`;

      if (!example.category || typeof example.category !== 'string') {
        errors.push({
          message: 'Example missing required field: category',
          path: `${exPath}.category`,
          expected: 'string',
        });
      }

      if (!example.templateString || typeof example.templateString !== 'string') {
        errors.push({
          message: 'Example missing required field: templateString',
          path: `${exPath}.templateString`,
          expected: 'string',
        });
      }

      if (!example.name || typeof example.name !== 'string') {
        errors.push({
          message: 'Example missing required field: name',
          path: `${exPath}.name`,
          expected: 'string',
        });
      }
    });
  }
}

/**
 * Validates a source entry.
 */
function validateSourceEntry(
  entry: Partial<SourceEntry>,
  index: number,
  errors: ValidationError[]
): void {
  const basePath = `sources[${index}]`;

  if (!entry.id || typeof entry.id !== 'string') {
    errors.push({
      message: 'Missing or invalid field: id',
      path: `${basePath}.id`,
      expected: 'string',
    });
  }

  if (!entry.name || typeof entry.name !== 'string') {
    errors.push({
      message: 'Missing or invalid field: name',
      path: `${basePath}.name`,
      expected: 'string',
    });
  }

  if (!entry.description || typeof entry.description !== 'string') {
    errors.push({
      message: 'Missing or invalid field: description',
      path: `${basePath}.description`,
      expected: 'string',
    });
  }

  if (!entry.author || typeof entry.author !== 'string') {
    errors.push({
      message: 'Missing or invalid field: author',
      path: `${basePath}.author`,
      expected: 'string',
    });
  }

  if (!entry.version || typeof entry.version !== 'string') {
    errors.push({
      message: 'Missing or invalid field: version',
      path: `${basePath}.version`,
      expected: 'string',
    });
  }

  if (!entry.locale || typeof entry.locale !== 'string') {
    errors.push({
      message: 'Missing or invalid field: locale',
      path: `${basePath}.locale`,
      expected: 'string',
    });
  }

  if (!entry.category || typeof entry.category !== 'string') {
    errors.push({
      message: 'Missing or invalid field: category',
      path: `${basePath}.category`,
      expected: 'string',
    });
  }

  if (typeof entry.itemCount !== 'number') {
    errors.push({
      message: 'Missing or invalid field: itemCount',
      path: `${basePath}.itemCount`,
      expected: 'number',
    });
  }

  if (!entry.importUrl || typeof entry.importUrl !== 'string') {
    errors.push({
      message: 'Missing or invalid field: importUrl',
      path: `${basePath}.importUrl`,
      expected: 'string',
    });
  }

  // Validate examples array
  if (!Array.isArray(entry.examples)) {
    errors.push({
      message: 'Missing or invalid field: examples',
      path: `${basePath}.examples`,
      expected: 'array',
    });
  } else {
    if (entry.examples.length !== 5) {
      errors.push({
        message: 'Examples array must contain exactly 5 items',
        path: `${basePath}.examples`,
        expected: '5 items',
        actual: entry.examples.length,
      });
    }

    entry.examples.forEach((example, exIndex) => {
      const exPath = `${basePath}.examples[${exIndex}]`;

      if (!example.label || typeof example.label !== 'string') {
        errors.push({
          message: 'Example missing required field: label',
          path: `${exPath}.label`,
          expected: 'string',
        });
      }

      if (!Array.isArray(example.tags)) {
        errors.push({
          message: 'Example missing required field: tags',
          path: `${exPath}.tags`,
          expected: 'array',
        });
      } else if (example.tags.length === 0) {
        errors.push({
          message: 'Example tags array must not be empty',
          path: `${exPath}.tags`,
          expected: 'non-empty array',
        });
      }
    });
  }
}

/**
 * Validates the index manifest.
 */
function validateIndexManifest(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: [{ message: 'Index must be an object', expected: 'object', actual: typeof data }],
    };
  }

  const manifest = data as Partial<IndexManifest>;

  // Validate required top-level fields
  if (!manifest.version || typeof manifest.version !== 'string') {
    errors.push({
      message: 'Missing or invalid field: version',
      path: 'version',
      expected: 'string',
    });
  }

  if (!manifest.name || typeof manifest.name !== 'string') {
    errors.push({ message: 'Missing or invalid field: name', path: 'name', expected: 'string' });
  }

  if (!manifest.description || typeof manifest.description !== 'string') {
    errors.push({
      message: 'Missing or invalid field: description',
      path: 'description',
      expected: 'string',
    });
  }

  // Validate promptTemplates array
  if (!Array.isArray(manifest.promptTemplates)) {
    errors.push({
      message: 'Missing or invalid field: promptTemplates',
      path: 'promptTemplates',
      expected: 'array',
    });
  } else {
    // Check for duplicate IDs
    const promptTemplateIds = new Set<string>();
    manifest.promptTemplates.forEach((entry, index) => {
      if (entry.id) {
        if (promptTemplateIds.has(entry.id)) {
          errors.push({
            message: `Duplicate ID found: ${entry.id}`,
            path: `promptTemplates[${index}].id`,
          });
        }
        promptTemplateIds.add(entry.id);
      }
      validatePromptTemplateEntry(entry, index, errors);
    });
  }

  // Validate sources array
  if (!Array.isArray(manifest.sources)) {
    errors.push({
      message: 'Missing or invalid field: sources',
      path: 'sources',
      expected: 'array',
    });
  } else {
    // Check for duplicate IDs
    const sourceIds = new Set<string>();
    manifest.sources.forEach((entry, index) => {
      if (entry.id) {
        if (sourceIds.has(entry.id)) {
          errors.push({
            message: `Duplicate ID found: ${entry.id}`,
            path: `sources[${index}].id`,
          });
        }
        sourceIds.add(entry.id);
      }
      validateSourceEntry(entry, index, errors);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates the index file.
 */
export function validateFile(filePath: string): boolean {
  console.log(`\n📄 Validating: ${filePath}`);

  try {
    // Read and parse JSON
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Validate
    const result = validateIndexManifest(data);

    if (result.valid) {
      const manifest = data as IndexManifest;
      console.log('✅ Valid index manifest');
      console.log(`   Version: ${manifest.version}`);
      console.log(`   Name: ${manifest.name}`);
      console.log(`   Description: ${manifest.description}`);
      console.log(`   Prompt Templates: ${manifest.promptTemplates.length}`);
      console.log(`   Sources: ${manifest.sources.length}`);
      return true;
    } else {
      console.log('❌ Invalid index manifest');
      console.log('\nErrors:');
      result.errors.forEach((error, index: number) => {
        console.log(`  ${index + 1}. ${error.path ? `[${error.path}] ` : ''}${error.message}`);
        if (error.expected) {
          console.log(`     Expected: ${error.expected}`);
        }
        if (error.actual !== undefined) {
          console.log(`     Actual: ${JSON.stringify(error.actual)}`);
        }
      });
      return false;
    }
  } catch (error) {
    console.log('❌ Error reading or parsing file');
    if (error instanceof Error) {
      console.log(`   ${error.message}`);
    }
    return false;
  }
}

/**
 * Main entry point.
 */
export function main() {
  const args = process.argv.slice(2);
  const filePath = args.length > 0 ? args[0] : 'index.json';

  console.log('🔍 Index Validator');
  console.log('='.repeat(50));

  // Resolve path
  const resolvedPath = path.resolve(filePath);

  // Check if file exists
  if (!fs.existsSync(resolvedPath)) {
    console.log(`\n⚠️  File not found: ${filePath}`);
    process.exit(1);
  }

  // Check if it's a file
  const stat = fs.statSync(resolvedPath);
  if (!stat.isFile()) {
    console.log(`\n⚠️  Not a file: ${filePath}`);
    process.exit(1);
  }

  const isValid = validateFile(resolvedPath);

  // Print summary
  console.log('\n' + '='.repeat(50));
  if (isValid) {
    console.log('✅ Index validation passed');
  } else {
    console.log('❌ Index validation failed');
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
