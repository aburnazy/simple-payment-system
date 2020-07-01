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
  ],
  collectCoverageFrom: ['./**/*.js', 'app.js'],
  coverageDirectory: 'coverage',
};
