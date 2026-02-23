export function createMetricsStore() {
  return {
    chartRequests: 0,
    reportRequests: 0,
    chartCacheHits: 0,
    providerFallbacks: 0,
    chartFailures: 0,
    reportFailures: 0,
    totalChartLatencyMs: 0,
    totalReportLatencyMs: 0
  };
}

export function withLatency(fn, onDone) {
  const startedAt = Date.now();
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      onDone(Date.now() - startedAt);
    });
}

export function metricsSnapshot(store) {
  const avgChartLatencyMs = store.chartRequests ? Math.round(store.totalChartLatencyMs / store.chartRequests) : 0;
  const avgReportLatencyMs = store.reportRequests ? Math.round(store.totalReportLatencyMs / store.reportRequests) : 0;

  return {
    ...store,
    avgChartLatencyMs,
    avgReportLatencyMs
  };
}
