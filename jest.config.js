/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleDirectories: [
    "node_modules", 'tests', 'app', 'components', 'hooks', 'libs'
  ],
  moduleFileExtensions: [
    "js",
    // "mjs",
    // "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    // "node"
  ],
  moduleNameMapper: {
    '^@/(.*)$': ['<rootDir>/$1'],
    "\\.(css|less|scss)$": "identity-obj-proxy"
  },
  rootDir: '.',
  roots: [
    "<rootDir>"
  ],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  verbose: true,
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
