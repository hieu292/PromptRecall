/**
 * Source Manifest Type Definitions
 *
 * Type definitions and validation for PromptRecall source manifests
 * conforming to the schema defined in docs/requirements.md (Section 4.1).
 *
 * Requirements: 4.1, 4.2, 4.3
 */

/**
 * Source manifest schema version.
 * Current version: 1.0.0
 */
export type SchemaVersion = '1.0.0';

/**
 * Tag definition in a source manifest.
 */
export interface SourceTag {
  /** Tag name (e.g., word type, topic) */
  name: string;
  /** Optional semantic parameter key (e.g., 'word_type').
   *  When set, the tag's name is available as {{ keyParam }} in prompt templates. */
  keyParam?: string;
}

/**
 * Item definition in a source manifest.
 * Represents a single learning item (word, phrase, concept, etc.)
 */
export interface SourceItem {
  /** Display label for the item (required) */
  label: string;
  /** Optional description of the item */
  description?: string;
  /** Array of tag names associated with this item */
  tags: string[];
  /** Optional flexible metadata object for custom fields */
  metadata?: Record<string, unknown>;
}

/**
 * Prompt template definition in a source manifest.
 * Templates use {{ variable_name }} placeholder syntax.
 */
export interface PromptTemplate {
  /** Template name/title */
  name?: string;
  /** Template category (e.g., 'translation', 'grammar_explanation') */
  category: string;
  /** Template string with {{ }} placeholders */
  templateString: string;
}

/**
 * Complete source manifest structure.
 * Represents a content pack that can be imported into PromptRecall.
 */
export interface SourceManifest {
  /** Schema version (must be '1.0.0') */
  schemaVersion: SchemaVersion;
  /** Source name */
  name: string;
  /** Source description */
  description: string;
  /** Author name or organization */
  author: string;
  /** Source version (semantic versioning recommended) */
  version: string;
  /** Locale code (e.g., 'vi', 'en') */
  locale: string;
  /** Array of learning items */
  items: SourceItem[];
  /** Array of available tags */
  tags: SourceTag[];
  /** Array of prompt templates */
  promptTemplates: PromptTemplate[];
  /** Optional: Original URL where this source was imported from */
  originUrl?: string;
  /** Optional: Installation timestamp (ISO 8601) */
  installedAt?: string;
}

/**
 * Validation error details.
 */
export interface ValidationError {
  /** Error message */
  message: string;
  /** Path to the field that failed validation (e.g., 'items[0].label') */
  path?: string;
  /** Expected value or type */
  expected?: string;
  /** Actual value received */
  actual?: unknown;
}

/**
 * Validation result.
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Array of validation errors (empty if valid) */
  errors: ValidationError[];
}

/**
 * Validates a source manifest against the schema.
 *
 * @param data - The data to validate
 * @returns Validation result with any errors found
 */
export function validateSourceManifest(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if data is an object
  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: [{ message: 'Manifest must be an object', expected: 'object', actual: typeof data }],
    };
  }

  const manifest = data as Partial<SourceManifest>;

  // Validate required top-level fields
  if (!manifest.schemaVersion) {
    errors.push({ message: 'Missing required field: schemaVersion', path: 'schemaVersion' });
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

  if (!manifest.version || typeof manifest.version !== 'string') {
    errors.push({
      message: 'Missing or invalid field: version',
      path: 'version',
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

  // Validate items array
  if (!Array.isArray(manifest.items)) {
    errors.push({ message: 'Missing or invalid field: items', path: 'items', expected: 'array' });
  } else {
    manifest.items.forEach((item, index) => {
      if (!item.label || typeof item.label !== 'string') {
        errors.push({
          message: 'Item missing required field: label',
          path: `items[${index}].label`,
          expected: 'string',
        });
      }

      if (!Array.isArray(item.tags)) {
        errors.push({
          message: 'Item missing or invalid field: tags',
          path: `items[${index}].tags`,
          expected: 'array',
        });
      }

      if (item.description !== undefined && typeof item.description !== 'string') {
        errors.push({
          message: 'Item description must be a string',
          path: `items[${index}].description`,
          expected: 'string',
          actual: typeof item.description,
        });
      }

      if (
        item.metadata !== undefined &&
        (typeof item.metadata !== 'object' || item.metadata === null)
      ) {
        errors.push({
          message: 'Item metadata must be an object',
          path: `items[${index}].metadata`,
          expected: 'object',
          actual: typeof item.metadata,
        });
      }
    });
  }

  // Validate tags array
  if (!Array.isArray(manifest.tags)) {
    errors.push({ message: 'Missing or invalid field: tags', path: 'tags', expected: 'array' });
  } else {
    manifest.tags.forEach((tag, index) => {
      if (!tag.name || typeof tag.name !== 'string') {
        errors.push({
          message: 'Tag missing required field: name',
          path: `tags[${index}].name`,
          expected: 'string',
        });
      }
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
      if (template.name !== undefined && typeof template.name !== 'string') {
        errors.push({
          message: 'Template name must be a string',
          path: `promptTemplates[${index}].name`,
          expected: 'string',
          actual: typeof template.name,
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
 * Type guard to check if data is a valid SourceManifest.
 *
 * @param data - The data to check
 * @returns True if data is a valid SourceManifest
 */
export function isSourceManifest(data: unknown): data is SourceManifest {
  const result = validateSourceManifest(data);
  return result.valid;
}

/**
 * Validates a source manifest and throws an error if invalid.
 *
 * @param data - The data to validate
 * @throws Error if validation fails
 * @returns The validated manifest
 */
export function assertSourceManifest(data: unknown): asserts data is SourceManifest {
  const result = validateSourceManifest(data);
  if (!result.valid) {
    const errorMessages = result.errors
      .map((e) => `${e.path ? `${e.path}: ` : ''}${e.message}`)
      .join('\n');
    throw new Error(`Invalid source manifest:\n${errorMessages}`);
  }
}
