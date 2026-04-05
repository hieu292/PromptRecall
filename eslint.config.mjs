// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: { jest },
    rules: {
      'jest/no-disabled-tests': 'warn',
    },
  },
  {
    ignores: ['jest.config.js'],
  }
);