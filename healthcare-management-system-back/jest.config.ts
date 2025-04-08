// jest.config.ts
import { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src', // tell Jest to look inside 'src' folder
  testRegex: '.*\\.spec\\.ts$', // look for .spec.ts files
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest', // use ts-jest to compile TS files
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage', // output coverage reports
  testEnvironment: 'node',
  verbose: true, // show individual test results
};

export default config;
