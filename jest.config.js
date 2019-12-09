module.exports = {
  collectCoverage: true,
  coverageDirectory: 'dist/coverage',
  setupFiles: ['<rootDir>/node_modules/@babel/polyfill'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.js?$': 'babel-jest'
  }
};
