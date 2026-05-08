import { describe, expect, it } from 'vitest';
import { percentageDelta } from './index';

describe('percentageDelta', () => {
  it('calculates relative change', () => {
    expect(percentageDelta(100, 110)).toBe(10);
  });
});
