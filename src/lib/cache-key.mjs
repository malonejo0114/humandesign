import { createHash } from 'node:crypto';

export function createChartCacheKey(input) {
  const canonical = JSON.stringify({
    localDate: input.localDate,
    localTime: input.localTime,
    timezone: input.timezone,
    mode: input.mode
  });

  return createHash('sha256').update(canonical).digest('hex');
}
