import test from 'node:test';
import assert from 'node:assert/strict';
import { requestBasicReportWithRetry } from '../../src/web/report-client.mjs';

test('retries once and succeeds', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    if (calls === 1) {
      throw new Error('temporary failure');
    }
    return {
      ok: true,
      text: async () => '<html>ok</html>'
    };
  };

  const html = await requestBasicReportWithRetry({ sample: true }, { retries: 1, fetchImpl });
  assert.equal(html, '<html>ok</html>');
  assert.equal(calls, 2);
});

test('throws when retries exhausted', async () => {
  const fetchImpl = async () => ({ ok: false, status: 500, json: async () => ({ error: 'server down' }) });

  await assert.rejects(
    () => requestBasicReportWithRetry({ sample: true }, { retries: 1, fetchImpl }),
    /server down/
  );
});
