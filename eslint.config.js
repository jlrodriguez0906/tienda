// Configuración de ESLint (formato "flat config", ESLint 9).
const js = require('@eslint/js');

module.exports = [
  { ignores: ['node_modules/', 'coverage/', 'docs-generada/', 'mejora/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly', module: 'writable', process: 'readonly', console: 'readonly',
        __dirname: 'readonly', fetch: 'readonly', URL: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'off',
      eqeqeq: 'error',
      'prefer-const': 'error'
    }
  },
  {
    // La interfaz se ejecuta en el navegador, no en Node.
    files: ['public/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: { document: 'readonly', fetch: 'readonly' }
    }
  }
];
