module.exports = {
    roots: ['E:/work/vzo-backend/app/test'], // specify the root directory for tests
    testMatch: ['**/*.test.js'], // match any .test.js files in the test root directory
    testPathIgnorePatterns: ['/node_modules/'],
    testEnvironment: 'node',
    verbose: true,
    forceExit: true
};
  