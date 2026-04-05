# PromptRecall Resources

A comprehensive, extensible collection of learning resources and AI prompt templates designed to enhance learning experiences across various domains. Currently featuring language learning resources with plans to expand into additional educational areas.

## Overview

This repository provides:

- **Prompt Templates**: Ready-to-use AI prompt templates for various learning scenarios
- **Learning Sources**: Curated datasets and content organized by topics and proficiency levels
- **Structured Metadata**: Standardized schemas for easy integration and discovery
- **Import System**: Direct URLs for seamless resource importing

All resources are designed to work with AI language models to create personalized, interactive learning experiences.

## Current Resources

### Language Learning

Currently supporting English and Vietnamese language education:

- **Vocabulary Dictionaries**: Extensive word lists with CEFR levels (A1-C2) and linguistic metadata
- **Grammar Topics**: Structured grammar concepts organized by proficiency level
- **Prompt Templates**: Theory and practice prompts for vocabulary and grammar mastery

### Future Expansion

The repository is designed to accommodate additional domains such as:

- Mathematics and sciences
- Programming and technology
- History and social studies
- Arts and creative subjects
- Professional skills and certifications

## Resource Categories

### Prompt Templates

Located in `prompt-templates/`:

Reusable AI prompt templates for generating learning content:

- **Language Learning**
  - English Vocabulary (EN/VI): Theory and practice prompts
  - English Grammar (EN/VI): Explanations, usage, and exercises
  
- **Future Categories**
  - Subject-specific templates
  - Skill-based learning prompts
  - Assessment and evaluation templates

### Learning Sources

Located in `sources/`:

Structured datasets and content collections:

- **Language Dictionaries**
  - 4958 Essential English Words (CEFR A1-C2)
  - 3893 Vietnamese Words (CEFR A1-C1)
  
- **Grammar Topics**
  - 89 English Grammar Topics (CEFR A1-C2)
  
- **Future Sources**
  - Domain-specific knowledge bases
  - Practice problem sets
  - Reference materials

## Quick Start

### Using the Index

The `index.json` file provides a complete catalog of all resources with direct import URLs:

```json
{
  "version": "1.0.0",
  "name": "PromptRecall Resources Index",
  "description": "Comprehensive index of all prompt templates and learning sources",
  "promptTemplates": [...],
  "sources": [...]
}
```

Each entry includes:
- `id`: Unique identifier for the resource
- `name`: Resource name
- `description`: Brief description
- `author`: PromptRecall Team
- `version`: Version number
- `locale`: Language code (en/vi)
- `category`: Resource category
- `importUrl`: Direct GitHub raw URL for importing
- `examples`: 5 sample data items showing the resource structure

### Import URLs

All resources can be imported directly via GitHub raw URLs:

```
https://raw.githubusercontent.com/hieu292/PromptRecall/main/[path-to-file]
```

## File Structure

```
.
├── index.json                          # Master index of all resources
├── prompt-templates/
│   ├── english-vocabulary/
│   │   ├── english-vocabulary-prompt-templates.en.json
│   │   ├── english-vocabulary-prompt-templates.vi.json
│   │   └── from-vi-to-en-vocabulary-prompt-templates.vi.json
│   └── english-grammar/
│       ├── english-grammar-prompt-templates.en.json
│       └── english-grammar-prompt-templates.vi.json
├── sources/
│   ├── dictionaries/
│   │   ├── 4958-common-english-with-cefr-level-and-pos.en.json
│   │   └── 3893-common-vietnamese-with-cefr-level.vi.json
│   └── english-grammar-topics/
│       ├── 89-english-grammar-topics-source.en.json
│       └── 89-english-grammar-topics-source.vi.json
└── scripts/
    ├── validate_index.ts
    ├── validate_source_manifest.ts
    └── validate_prompt_template.ts
```

## Validation

### Validate Index

```bash
# Validate the index.json file
npx tsx scripts/validate_index.ts index.json

# Or simply (defaults to index.json)
npx tsx scripts/validate_index.ts
```

### Validate Source Manifests

```bash
# Validate a single file
npx tsx scripts/validate_source_manifest.ts sources/dictionaries/4958-common-english-with-cefr-level-and-pos.en.json

# Validate all source files
npm run validate:source
```

### Validate Prompt Templates

```bash
# Validate a single file
npx tsx scripts/validate_prompt_template.ts prompt-templates/english-vocabulary/english-vocabulary-prompt-templates.en.json

# Validate all prompt template files
npm run validate:prompt
```

### What Gets Validated

#### Index Validation
- **Version field**: Must be present and a string
- **Required fields**: name, description, promptTemplates, sources
- **Unique IDs**: All entries must have unique IDs
- **Examples**: Each entry must have exactly 5 example items
- **Nested fields**: All required fields in prompt templates and sources

#### Source Manifest Validation
- **Schema version**: Must be "1.0.0"
- **Required fields**: name, description, author, version, locale
- **Items array**: Each item must have label and tags
- **Tags array**: Each tag must have a name
- **Prompt templates**: Each template must have name, category, and templateString
- **Type correctness**: All fields must have correct data types

#### Prompt Template Validation
- **Schema version**: Must be "1.0.0"
- **Required fields**: name, description, author, locale
- **Templates array**: Each template must have name, category, and templateString
- **Type correctness**: All fields must have correct data types

## Schema

### Index Schema

```typescript
interface IndexManifest {
  version: string;
  name: string;
  description: string;
  promptTemplates: PromptTemplateEntry[];
  sources: SourceEntry[];
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

interface PromptTemplateExample {
  category: string;
  templateString: string;
  name: string;
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

interface SourceExample {
  label: string;
  tags: string[];
}
```

### Source Manifest Schema

```typescript
interface SourceManifest {
  schemaVersion: string;
  name: string;
  description: string;
  author: string;
  version: string;
  locale: string;
  items: SourceItem[];
  tags?: SourceTag[];
  promptTemplates?: PromptTemplate[];
}

interface SourceItem {
  label: string;
  tags: string[];
}

interface SourceTag {
  name: string;
  description?: string;
}

interface PromptTemplate {
  name: string;
  category: string;
  templateString: string;
}
```

## Organization Standards

### Proficiency Levels

Language resources use the Common European Framework of Reference (CEFR):

- **A1**: Beginner
- **A2**: Elementary
- **B1**: Intermediate
- **B2**: Upper Intermediate
- **C1**: Advanced
- **C2**: Proficiency

### Extensibility

The schema is designed to support various classification systems:

- CEFR levels for languages
- Grade levels for academic subjects
- Difficulty ratings for skills
- Custom taxonomies for specialized domains

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Scripts

```bash
npm run lint          # Run ESLint
npm run typecheck     # Run TypeScript type checking
npm run test          # Run tests
npm run validate:index    # Validate index.json
npm run validate:source   # Validate all source files
npm run validate:prompt   # Validate all prompt template files
```

## Contributing

We welcome contributions to expand and improve the resource collection!

### Guidelines

1. **Follow the Schema**: Ensure all JSON files adhere to the defined schema
2. **Run Validation**: Execute validation scripts before committing
3. **Include Metadata**: Provide complete metadata (id, name, description, author, version, locale)
4. **Add Examples**: Include exactly 5 representative examples for index entries
5. **Unique IDs**: Ensure all resource IDs are unique across the index
6. **Organize Appropriately**: Use clear category structures and proficiency levels
7. **Multilingual Support**: Provide translations where applicable
8. **Document Changes**: Update the index.json and relevant documentation

### Adding New Domains

To add resources for a new subject area:

1. Create a new category folder in `prompt-templates/` or `sources/`
2. Follow the existing schema structure
3. Add the resource to `index.json` with:
   - A unique ID
   - Complete metadata
   - Exactly 5 representative examples
4. Add validation tests
5. Run `npm run validate:index` to verify
6. Document the new category in README.md

### Quality Standards

- Accurate and verified content
- Clear, concise descriptions
- Proper attribution and licensing
- Consistent formatting and structure

## License

ISC

## Author

PromptRecall Team

## Version

1.0.0
