export function createBasicReportHtml({ input, utcAudit, hd }) {
  const rows = [
    ['Type', hd.meta?.type ?? 'unknown'],
    ['Profile', hd.meta?.profile ?? 'unknown'],
    ['Authority', hd.meta?.authority ?? 'unknown'],
    ['Definition', hd.meta?.definition ?? 'unknown'],
    ['Defined Centers', (hd.definedCenters ?? []).join(', ') || '-'],
    ['Defined Channels', (hd.definedChannels ?? []).join(', ') || '-'],
    ['Active Gates', (hd.activeGates ?? []).join(', ') || '-']
  ];

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>HumanDesign Basic Report</title>
<style>
body { font-family: Inter, system-ui, sans-serif; margin: 40px; color: #1b1f2b; }
h1 { margin: 0 0 12px; }
small { color: #4d5675; }
table { width: 100%; border-collapse: collapse; margin-top: 24px; }
th, td { border: 1px solid #c8d0ea; padding: 8px 10px; text-align: left; }
th { width: 180px; background: #f3f6ff; }
.code { background: #f8f9ff; padding: 12px; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
</style>
</head>
<body>
  <h1>HumanDesign Basic Report (MVP)</h1>
  <small>입력 일시: ${input.localDate} ${input.localTime} (${input.timezone}) | UTC: ${utcAudit.utcIso}</small>

  <h2>요약</h2>
  <table>
    ${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}
  </table>

  <h2>Config Fingerprint</h2>
  <div class="code">${JSON.stringify(hd.config ?? {}, null, 2)}</div>

  <h2>Raw Input / UTC Audit</h2>
  <div class="code">${JSON.stringify({ input, utcAudit }, null, 2)}</div>
</body>
</html>`;
}
