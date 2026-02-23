import test from 'node:test';
import assert from 'node:assert/strict';
import { createBasicReportHtml } from '../../src/lib/report.mjs';

test('creates report html containing summary and config', () => {
  const html = createBasicReportHtml({
    input: { localDate: '1980-01-01', localTime: '09:00:00', timezone: 'Asia/Seoul' },
    utcAudit: { utcIso: '1980-01-01T00:00:00Z' },
    hd: {
      definedCenters: ['head'],
      definedChannels: ['61-24'],
      activeGates: [61],
      meta: { type: 'mg', profile: '4/6', authority: 'emotional', definition: 'split' },
      config: { tz: 'Asia/Seoul' }
    }
  });

  assert.match(html, /HumanDesign Basic Report/);
  assert.match(html, /Type/);
  assert.match(html, /1980-01-01T00:00:00Z/);
  assert.match(html, /Asia\/Seoul/);
});
