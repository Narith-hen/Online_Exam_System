module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts', '**/test/**/*.spec.ts', '**/test/**/*.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/test/integration/', '/test/e2e/'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  verbose: true,
};
