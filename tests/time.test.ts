import { describe, expect, it } from 'vitest';
import { toUtcWithAudit } from '../src/lib/time.js';

describe('toUtcWithAudit', () => {
  it('converts Asia/Seoul local time to UTC and includes audit fields', () => {
    const result = toUtcWithAudit({
      localDate: '1980-01-01',
      localTime: '09:00:00',
      timezone: 'Asia/Seoul'
    });

    expect(result.utcIso).toBe('1980-01-01T00:00:00Z');
    expect(result.offsetMinutes).toBe(540);
    expect(result.parsedLocalIso).toBe('1980-01-01T09:00:00+09:00');
  });

  it('throws for invalid datetime', () => {
    expect(() =>
      toUtcWithAudit({
        localDate: '1980-02-31',
        localTime: '09:00:00',
        timezone: 'Asia/Seoul'
      })
    ).toThrowError(/Invalid local datetime/);
  });
});
