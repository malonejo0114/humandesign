import { toUtcWithAudit } from '../src/lib/time.js';

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(message);
}

const converted = toUtcWithAudit({
  localDate: '1980-01-01',
  localTime: '09:00:00',
  timezone: 'Asia/Seoul'
});

assert(converted.utcIso === '1980-01-01T00:00:00Z', 'UTC conversion failed');
assert(converted.offsetMinutes === 540, 'Offset mismatch');
