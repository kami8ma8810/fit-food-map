// Expo Maps mocks for Jest

module.exports = {
  Map: jest.fn().mockImplementation(({ children }) => children),
  Marker: jest.fn().mockImplementation(({ children }) => children),
  Circle: jest.fn().mockImplementation(({ children }) => children),
  Polygon: jest.fn().mockImplementation(({ children }) => children),
  Polyline: jest.fn().mockImplementation(({ children }) => children),
};