import eslintConfigLogux from '@logux/eslint-config/ts'

export default [
  {
    ignores: ['**/errors.ts', 'vitest.config.ts']
  },
  ...eslintConfigLogux
]
