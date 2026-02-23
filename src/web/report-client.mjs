export async function requestBasicReportWithRetry(payload, { retries = 1, fetchImpl = fetch } = {}) {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchImpl('/api/report/basic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let message = `report generation failed: ${response.status}`;
        try {
          const data = await response.json();
          if (data?.error) message = data.error;
        } catch {
          // no-op
        }
        throw new Error(message);
      }

      return response.text();
    } catch (error) {
      lastError = error;
      if (attempt >= retries) break;
    }
  }

  throw lastError ?? new Error('report generation failed');
}
