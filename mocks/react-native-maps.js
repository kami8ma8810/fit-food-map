// React Native Maps mocks for Jest

module.exports = {
  default: jest.fn().mockImplementation(({ children }) => children),
  MapView: jest.fn().mockImplementation(({ children }) => children),
  Marker: jest.fn().mockImplementation(({ children }) => children),
  Callout: jest.fn().mockImplementation(({ children }) => children),
  PROVIDER_DEFAULT: 'default',
  PROVIDER_GOOGLE: 'google',
};