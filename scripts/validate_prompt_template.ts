#!/usr/bin/env tsx
/**
 * Prompt Template Validator
 *
 * Validates prompt template JSON files against the schema.
 *
 * Usage:
 *   npx tsx scripts/validate_prompt_template.ts <path-to-template.json>
 *   npx tsx scripts/validate_prompt_template.ts prompt-templates/folder/*.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { type PromptTemplate } from '../lib/sourceManifest.types.js';

interface PromptTemplateManifest {
  schemaVersion: string;
  name: string;
  description: string;
  author: string;
  locale: string;
  promptTemplates: PromptTemplate[];
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

interface ValidationStats {
  total: number;
  valid: number;
  invalid: number;
}

/**
 * Validates a prompt template manifest.
 */
function validatePromptTemplateManifest(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: [{ message: 'Manifest must be an object', expected: 'object', actual: typeof data }],
    };
  }

  const manifest = data as Partial<PromptTemplateManifest>;

  // Validate required fields
  if (!manifest.schemaVersion || typeof manifest.schemaVersion !== 'string') {
    errors.push({
      message: 'Missing or invalid field: schemaVersion',
      path: 'schemaVersion',
      expected: 'string',
    });
  } else if (manifest.schemaVersion !== '1.0.0') {
    errors.push({
      message: 'Unsupported schema version',
      path: 'schemaVersion',
      expected: '1.0.0',
      actual: manifest.schemaVersion,
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

  if (!manifest.author || typeof manifest.author !== 'string') {
    errors.push({
      message: 'Missing or invalid field: author',
      path: 'author',
      expected: 'string',
    });
  }

  if (!manifest.locale || typeof manifest.locale !== 'string') {
    errors.push({
      message: 'Missing or invalid field: locale',
      path: 'locale',
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
    manifest.promptTemplates.forEach((template, index) => {
      if (!template.name || typeof template.name !== 'string') {
        errors.push({
          message: 'Template missing required field: name',
          path: `promptTemplates[${index}].name`,
          expected: 'string',
        });
      }

      if (!template.category || typeof template.category !== 'string') {
        errors.push({
          message: 'Template missing required field: category',
          path: `promptTemplates[${index}].category`,
          expected: 'string',
        });
      }

      if (!template.templateString || typeof template.templateString !== 'string') {
        errors.push({
          message: 'Template missing required field: templateString',
          path: `promptTemplates[${index}].templateString`,
          expected: 'string',
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a single prompt template file.
 */
export function validateFile(filePath: string): boolean {
  console.log(`\n📄 Validating: ${filePath}`);

  try {
    // Read and parse JSON
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Validate
    const result = validatePromptTemplateManifest(data);

    if (result.valid) {
      const manifest = data as PromptTemplateManifest;
      console.log('✅ Valid prompt template manifest');
      console.log(`   Name: ${manifest.name}`);
      console.log(`   Description: ${manifest.description}`);
      console.log(`   Author: ${manifest.author}`);
      console.log(`   Schema Version: ${manifest.schemaVersion}`);
      console.log(`   Locale: ${manifest.locale}`);
      console.log(`   Templates: ${manifest.promptTemplates.length}`);
      return true;
    } else {
      console.log('❌ Invalid prompt template manifest');
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

  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/validate_prompt_template.ts <path-to-template.json>');
    console.error('Example: npx tsx scripts/validate_prompt_template.ts prompt-templates/folder/*.json');
    process.exit(1);
  }

  const stats: ValidationStats = {
    total: 0,
    valid: 0,
    invalid: 0,
  };

  console.log('🔍 Prompt Template Validator');
  console.log('='.repeat(50));

  // Validate each file
  for (const filePath of args) {
    // Resolve path
    const resolvedPath = path.resolve(filePath);

    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
      console.log(`\n⚠️  File not found: ${filePath}`);
      continue;
    }

    // Check if it's a file
    const stat = fs.statSync(resolvedPath);
    if (!stat.isFile()) {
      console.log(`\n⚠️  Not a file: ${filePath}`);
      continue;
    }

    stats.total++;
    const isValid = validateFile(resolvedPath);

    if (isValid) {
      stats.valid++;
    } else {
      stats.invalid++;
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary');
  console.log(`   Total files: ${stats.total}`);
  console.log(`   ✅ Valid: ${stats.valid}`);
  console.log(`   ❌ Invalid: ${stats.invalid}`);

  // Exit with error code if any invalid
  if (stats.invalid > 0) {
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
