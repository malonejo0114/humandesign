import test from 'node:test';
import assert from 'node:assert/strict';
import { createChartCacheKey } from '../../src/lib/cache-key.mjs';

test('creates deterministic key for same input', () => {
  const input = { localDate: '2001-09-09', localTime: '09:09:00', timezone: 'Asia/Seoul', mode: 'exact' };
  const a = createChartCacheKey(input);
  const b = createChartCacheKey(input);
  assert.equal(a, b);
});

test('changes key when input changes', () => {
  const a = createChartCacheKey({ localDate: '2001-09-09', localTime: '09:09:00', timezone: 'Asia/Seoul', mode: 'exact' });
  const b = createChartCacheKey({ localDate: '2001-09-09', localTime: '09:10:00', timezone: 'Asia/Seoul', mode: 'exact' });
  assert.notEqual(a, b);
});
