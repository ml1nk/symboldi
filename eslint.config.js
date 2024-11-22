import love from 'eslint-config-love'

export default [
  {
    ...love,
    files: [
      "packages/*/src/**/*.ts",
      "packages/*/test/**/*.ts",
    ],
  },
]