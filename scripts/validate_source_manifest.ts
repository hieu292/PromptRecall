#!/usr/bin/env tsx
/**
 * Source Manifest Validator
 *
 * Validates source manifest JSON files against the schema.
 *
 * Usage:
 *   npx tsx scripts/validate_source_manifest.ts <path-to-manifest.json>
 *   npx tsx scripts/validate_source_manifest.ts data/sources/*.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { validateSourceManifest, type SourceManifest } from '../lib/sourceManifest.types.js';

interface ValidationStats {
  total: number;
  valid: number;
  invalid: number;
}

/**
 * Validates a single manifest file.
 */
export function validateFile(filePath: string): boolean {
  console.log(`\n📄 Validating: ${filePath}`);

  try {
    // Read and parse JSON
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Validate
    const result = validateSourceManifest(data);

    if (result.valid) {
      const manifest = data as SourceManifest;
      console.log('✅ Valid manifest');
      console.log(`   Name: ${manifest.name}`);
      console.log(`   Version: ${manifest.version}`);
      console.log(`   Items: ${manifest.items.length}`);
      console.log(`   Tags: ${manifest.tags.length}`);
      console.log(`   Templates: ${manifest.promptTemplates.length}`);
      return true;
    } else {
      console.log('❌ Invalid manifest');
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
    console.error('Usage: npx tsx scripts/validate_source_manifest.ts <path-to-manifest.json>');
    console.error('Example: npx tsx scripts/validate_source_manifest.ts data/sources/*.json');
    process.exit(1);
  }

  const stats: ValidationStats = {
    total: 0,
    valid: 0,
    invalid: 0,
  };

  console.log('🔍 Source Manifest Validator');
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
