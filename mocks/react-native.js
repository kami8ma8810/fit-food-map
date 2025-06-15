// React Native mocks for Jest

module.exports = {
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  ScrollView: 'ScrollView',
  Dimensions: {
    get: jest.fn(() => ({
      width: 375,
      height: 812,
    })),
  },
};