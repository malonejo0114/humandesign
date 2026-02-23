import { toUtcWithAudit } from './lib/time.mjs';

const sample = toUtcWithAudit({
  localDate: '1980-01-01',
  localTime: '09:00:00',
  timezone: 'Asia/Seoul'
});

console.log('HD UTC conversion sample', sample);
