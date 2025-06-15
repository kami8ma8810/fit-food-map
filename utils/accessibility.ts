// Accessibility utilities for WCAG 2.1 AA compliance

/**
 * Color contrast ratio calculation for WCAG compliance
 * @param color1 First color in hex format (#000000)
 * @param color2 Second color in hex format (#ffffff)
 * @returns Contrast ratio (1-21)
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const luminance1 = getRelativeLuminance(color1);
  const luminance2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance for a color
 * @param color Color in hex format (#000000)
 * @returns Relative luminance (0-1)
 */
function getRelativeLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB
 * @param hex Hex color string (#000000)
 * @returns RGB object or null
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Check if color combination meets WCAG AA standard (4.5:1)
 * @param color1 First color in hex format
 * @param color2 Second color in hex format
 * @returns True if meets AA standard
 */
export function meetsWcagAA(color1: string, color2: string): boolean {
  return calculateContrastRatio(color1, color2) >= 4.5;
}

/**
 * Check if color combination meets WCAG AAA standard (7:1)
 * @param color1 First color in hex format
 * @param color2 Second color in hex format
 * @returns True if meets AAA standard
 */
export function meetsWcagAAA(color1: string, color2: string): boolean {
  return calculateContrastRatio(color1, color2) >= 7;
}

/**
 * Accessibility props builder for React Native components
 */
export interface AccessibilityProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 
    | 'adjustable'
    | 'alert'
    | 'button'
    | 'checkbox'
    | 'combobox'
    | 'header'
    | 'image'
    | 'imagebutton'
    | 'keyboardkey'
    | 'link'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'none'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'scrollbar'
    | 'search'
    | 'slider'
    | 'spinbutton'
    | 'summary'
    | 'switch'
    | 'tab'
    | 'tablist'
    | 'text'
    | 'timer'
    | 'toolbar';
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
}

/**
 * Create accessibility props for common UI elements
 */
export const createAccessibilityProps = {
  button: (label: string, hint?: string): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: label,
    accessibilityHint: hint,
  }),
  
  link: (label: string, hint?: string): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'link',
    accessibilityLabel: label,
    accessibilityHint: hint,
  }),
  
  heading: (text: string, level: number = 1): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'header',
    accessibilityLabel: text,
    accessibilityHint: `レベル${level}の見出し`,
  }),
  
  textInput: (label: string, value?: string, required: boolean = false): AccessibilityProps => ({
    accessible: true,
    accessibilityLabel: label + (required ? '（必須）' : ''),
    accessibilityValue: value ? { text: value } : undefined,
  }),
  
  slider: (label: string, value: number, min: number, max: number): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'slider',
    accessibilityLabel: label,
    accessibilityValue: { min, max, now: value },
  }),
  
  checkbox: (label: string, checked: boolean): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'checkbox',
    accessibilityLabel: label,
    accessibilityState: { checked },
  }),
  
  switch: (label: string, enabled: boolean): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'switch',
    accessibilityLabel: label,
    accessibilityState: { checked: enabled },
  }),
};

/**
 * Check if touch target meets minimum size requirements (44px)
 * @param width Touch target width
 * @param height Touch target height
 * @returns True if meets minimum size
 */
export function meetsTouchTargetSize(width: number, height: number): boolean {
  return width >= 44 && height >= 44;
}

/**
 * Color palette for accessibility compliance
 */
export const AccessibleColors = {
  // High contrast colors for AA compliance
  primary: '#0066CC',      // Blue with good contrast
  secondary: '#00AA44',    // Green with good contrast
  error: '#CC0000',        // Red with good contrast
  warning: '#FF6600',      // Orange with good contrast
  success: '#00AA44',      // Green with good contrast
  
  // Text colors
  textPrimary: '#000000',   // Black
  textSecondary: '#666666', // Dark gray (AA compliant on white)
  textLight: '#FFFFFF',     // White
  
  // Background colors
  backgroundPrimary: '#FFFFFF',   // White
  backgroundSecondary: '#F5F5F5', // Light gray
  backgroundDark: '#333333',      // Dark gray
  
  // Focus indicator
  focus: '#005FCC',        // High contrast blue for focus rings
} as const;