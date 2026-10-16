// Presentation only: WCAG sRGB relative luminance, without changing label identity.
export function labelLuminance(hex: string): number {
  const channels = hex.slice(1).match(/../g)!.map(value => parseInt(value, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels.reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

export function labelContrast(a: string, b: string): number {
  const first = labelLuminance(a), second = labelLuminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

export function labelTextColor(background: string): '#000000' | '#ffffff' {
  return labelContrast(background, '#000000') >= labelContrast(background, '#ffffff') ? '#000000' : '#ffffff';
}

export function opaqueCssColor(value: string): string | null {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  const channels = value.match(/^rgba?\(([^)]+)\)$/)?.[1].split(/[, /]+/).map(Number);
  if (!channels || channels.length < 3 || (channels.length === 4 && channels[3] < 1)) return null;
  return '#' + channels.slice(0, 3).map(channel => Math.round(channel).toString(16).padStart(2, '0')).join('');
}
