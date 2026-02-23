import test from 'node:test';
import assert from 'node:assert/strict';
import { toUtcWithAudit } from '../src/lib/time.mjs';

test('converts Asia/Seoul local time to UTC and includes audit fields', () => {
  const result = toUtcWithAudit({
    localDate: '1980-01-01',
    localTime: '09:00:00',
    timezone: 'Asia/Seoul'
  });

  assert.equal(result.utcIso, '1980-01-01T00:00:00Z');
  assert.equal(result.offsetMinutes, 540);
  assert.equal(result.parsedLocalIso, '1980-01-01T09:00:00+09:00');
});

test('rejects unsupported timezone', () => {
  assert.throws(() => {
    toUtcWithAudit({
      localDate: '1980-01-01',
      localTime: '09:00:00',
      timezone: 'UTC'
    });
  }, /Asia\/Seoul only/);
});
