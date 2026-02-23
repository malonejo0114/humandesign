import test from 'node:test';
import assert from 'node:assert/strict';
import { createMetricsStore, metricsSnapshot, withLatency } from '../../src/lib/metrics.mjs';

test('creates default metrics store', () => {
  const store = createMetricsStore();
  assert.equal(store.chartRequests, 0);
  assert.equal(store.reportRequests, 0);
});

test('calculates average latencies from snapshot', () => {
  const store = createMetricsStore();
  store.chartRequests = 2;
  store.totalChartLatencyMs = 25;
  store.reportRequests = 2;
  store.totalReportLatencyMs = 35;

  const snap = metricsSnapshot(store);
  assert.equal(snap.avgChartLatencyMs, 13);
  assert.equal(snap.avgReportLatencyMs, 18);
});

test('withLatency invokes callback with elapsed time', async () => {
  let elapsed = 0;
  const result = await withLatency(async () => 'ok', (ms) => {
    elapsed = ms;
  });

  assert.equal(result, 'ok');
  assert.ok(elapsed >= 0);
});
