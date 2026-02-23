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

test('rejects impossible date values', () => {
  assert.throws(() => {
    toUtcWithAudit({
      localDate: '1980-02-31',
      localTime: '09:00:00',
      timezone: 'Asia/Seoul'
    });
  }, /day out of range/);
});

test('supports boundary minute checks (+1 minute)', () => {
  const base = toUtcWithAudit({ localDate: '2010-03-20', localTime: '00:00:00', timezone: 'Asia/Seoul' });
  const plus = toUtcWithAudit({ localDate: '2010-03-20', localTime: '00:01:00', timezone: 'Asia/Seoul' });

  const baseMs = Date.parse(base.utcIso);
  const plusMs = Date.parse(plus.utcIso);
  assert.equal(plusMs - baseMs, 60_000);
});

test('supports boundary minute checks (-1 minute)', () => {
  const base = toUtcWithAudit({ localDate: '2010-03-20', localTime: '00:00:00', timezone: 'Asia/Seoul' });
  const minus = toUtcWithAudit({ localDate: '2010-03-19', localTime: '23:59:00', timezone: 'Asia/Seoul' });

  const baseMs = Date.parse(base.utcIso);
  const minusMs = Date.parse(minus.utcIso);
  assert.equal(baseMs - minusMs, 60_000);
});
