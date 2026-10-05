import { describe, expect, it } from 'vitest';
import { routing } from './routing';

describe('locale routing', () => {
  it('uses Spanish as the default with explicit locale prefixes', () => {
    expect(routing.locales).toEqual(['es', 'en']);
    expect(routing.defaultLocale).toBe('es');
    expect(routing.localePrefix).toBe('always');
    expect(routing.localeDetection).toBe(false);
  });
});