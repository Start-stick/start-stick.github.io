import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    parser: '@typescript-eslint/parser', // 指定 ESLint 解析器
    parserOptions: {
      ecmaVersion: 2020, // 允许解析现代 ECMAScript 特性
      sourceType: 'module', // 允许使用 import/export
    },
    plugins: ['@typescript-eslint'], // 使用 TypeScript 插件
    extends: [
      'eslint:recommended', // 使用 ESLint 推荐规则
      'plugin:@typescript-eslint/recommended', // 使用 TypeScript 推荐规则
    ],
    rules: {
      // 自定义规则
    },
  }
]
