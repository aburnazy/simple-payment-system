module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/?(*.)test.js'],
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['html', 'json'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/bin',
    '<rootDir>/coverage',
    '<rootDir>/infrastructure/db/connectionpool.js',
    'jest.config.js',
    'prettier.config.js',
  ],
  collectCoverageFrom: ['./**/*.js', 'app.js'],
  coverageDirectory: 'coverage',
};
