/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  
  // Performance optimizations
  maxWorkers: '50%', // Use half of available cores
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Fast transforms
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true // Faster compilation
    }]
  },
  
  // Optimized file matching
  testMatch: [
    '**/__tests__/**/*.(ts|tsx)',
    '**/*.(test|spec).(ts|tsx)'
  ],
  
  // Module resolution
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  
  // Coverage (disabled by default for speed)
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/jest.config.js',
    '!**/jest-setup.ts'
  ],
  
  // Ignore patterns for speed
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/.expo/',
    '/dist/'
  ],
  
  // Module mocking for React Native
  moduleNameMapper: {
    '^react-native$': '<rootDir>/mocks/react-native.js',
    '^react-native-maps$': '<rootDir>/mocks/react-native-maps.js',
    '^expo-location$': '<rootDir>/mocks/expo-location.js',
    '^expo-maps$': '<rootDir>/mocks/expo-maps.js',
  }
};