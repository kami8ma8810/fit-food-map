import {
  calculateContrastRatio,
  meetsWcagAA,
  meetsWcagAAA,
  meetsTouchTargetSize,
  createAccessibilityProps,
  AccessibleColors,
} from '../accessibility';

describe('accessibility utilities', () => {
  describe('calculateContrastRatio', () => {
    it('should calculate correct contrast ratio for black and white', () => {
      const ratio = calculateContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 1); // Maximum contrast ratio
    });

    it('should calculate correct contrast ratio for same colors', () => {
      const ratio = calculateContrastRatio('#FF0000', '#FF0000');
      expect(ratio).toBeCloseTo(1, 1); // Minimum contrast ratio
    });

    it('should handle colors without # prefix', () => {
      const ratio = calculateContrastRatio('000000', 'FFFFFF');
      expect(ratio).toBeCloseTo(21, 1);
    });
  });

  describe('meetsWcagAA', () => {
    it('should return true for AA compliant color combinations', () => {
      // Black text on white background
      expect(meetsWcagAA('#000000', '#FFFFFF')).toBe(true);
      
      // Dark blue on white
      expect(meetsWcagAA('#0066CC', '#FFFFFF')).toBe(true);
    });

    it('should return false for non-compliant color combinations', () => {
      // Light gray text on white background (insufficient contrast)
      expect(meetsWcagAA('#CCCCCC', '#FFFFFF')).toBe(false);
      
      // Yellow text on white background
      expect(meetsWcagAA('#FFFF00', '#FFFFFF')).toBe(false);
    });
  });

  describe('meetsWcagAAA', () => {
    it('should return true for AAA compliant color combinations', () => {
      expect(meetsWcagAAA('#000000', '#FFFFFF')).toBe(true);
    });

    it('should return false for AA but not AAA compliant combinations', () => {
      // This might pass AA but not AAA
      expect(meetsWcagAAA('#666666', '#FFFFFF')).toBe(false);
    });
  });

  describe('meetsTouchTargetSize', () => {
    it('should return true for compliant touch target sizes', () => {
      expect(meetsTouchTargetSize(44, 44)).toBe(true);
      expect(meetsTouchTargetSize(48, 48)).toBe(true);
      expect(meetsTouchTargetSize(50, 44)).toBe(true);
    });

    it('should return false for non-compliant touch target sizes', () => {
      expect(meetsTouchTargetSize(40, 40)).toBe(false);
      expect(meetsTouchTargetSize(44, 40)).toBe(false);
      expect(meetsTouchTargetSize(30, 50)).toBe(false);
    });
  });

  describe('createAccessibilityProps', () => {
    it('should create correct button accessibility props', () => {
      const props = createAccessibilityProps.button('保存', '変更内容を保存します');
      
      expect(props).toEqual({
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: '保存',
        accessibilityHint: '変更内容を保存します',
      });
    });

    it('should create correct heading accessibility props', () => {
      const props = createAccessibilityProps.heading('メインタイトル', 1);
      
      expect(props).toEqual({
        accessible: true,
        accessibilityRole: 'header',
        accessibilityLabel: 'メインタイトル',
        accessibilityHint: 'レベル1の見出し',
      });
    });

    it('should create correct checkbox accessibility props', () => {
      const props = createAccessibilityProps.checkbox('利用規約に同意する', true);
      
      expect(props).toEqual({
        accessible: true,
        accessibilityRole: 'checkbox',
        accessibilityLabel: '利用規約に同意する',
        accessibilityState: { checked: true },
      });
    });

    it('should create correct text input accessibility props', () => {
      const propsRequired = createAccessibilityProps.textInput('メールアドレス', 'user@example.com', true);
      
      expect(propsRequired).toEqual({
        accessible: true,
        accessibilityLabel: 'メールアドレス（必須）',
        accessibilityValue: { text: 'user@example.com' },
      });

      const propsOptional = createAccessibilityProps.textInput('ニックネーム');
      
      expect(propsOptional).toEqual({
        accessible: true,
        accessibilityLabel: 'ニックネーム',
        accessibilityValue: undefined,
      });
    });

    it('should create correct slider accessibility props', () => {
      const props = createAccessibilityProps.slider('音量', 75, 0, 100);
      
      expect(props).toEqual({
        accessible: true,
        accessibilityRole: 'slider',
        accessibilityLabel: '音量',
        accessibilityValue: { min: 0, max: 100, now: 75 },
      });
    });
  });

  describe('AccessibleColors', () => {
    it('should have WCAG AA compliant color combinations', () => {
      // Test primary text on white background
      expect(meetsWcagAA(AccessibleColors.textPrimary, AccessibleColors.backgroundPrimary)).toBe(true);
      
      // Test secondary text on white background
      expect(meetsWcagAA(AccessibleColors.textSecondary, AccessibleColors.backgroundPrimary)).toBe(true);
      
      // Test white text on dark background
      expect(meetsWcagAA(AccessibleColors.textLight, AccessibleColors.backgroundDark)).toBe(true);
      
      // Test primary color on white background
      expect(meetsWcagAA(AccessibleColors.primary, AccessibleColors.backgroundPrimary)).toBe(true);
    });
  });
});