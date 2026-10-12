/** Jest config for @care-giver-app/api */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^@care-giver-app/types$': '<rootDir>/../../../packages/types/src/index.ts',
  },
  collectCoverageFrom: [
    'modules/booking/availability/**/*.ts',
    '!modules/booking/availability/**/*.module.ts',
    '!modules/booking/availability/dto/**',
    '!modules/booking/availability/entities/**',
  ],
  coverageDirectory: '<rootDir>/../coverage',
};
