function section(title, body) {
  return `<section class="page"><h2>${title}</h2>${body}</section>`;
}

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

  const tableHtml = `<table>${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>`;
  const codeBlock = (value) => `<pre class="code">${JSON.stringify(value, null, 2)}</pre>`;

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>HumanDesign Basic Report</title>
<style>
@page { size: A4; margin: 16mm; }
body { font-family: Inter, system-ui, sans-serif; color: #1b1f2b; margin: 0; }
.page { min-height: calc(297mm - 32mm); page-break-after: always; padding: 4mm 0; }
.page:last-child { page-break-after: auto; }
h1 { margin: 0 0 12px; }
h2 { margin: 0 0 12px; }
small { color: #4d5675; }
table { width: 100%; border-collapse: collapse; margin-top: 8px; }
th, td { border: 1px solid #c8d0ea; padding: 8px 10px; text-align: left; vertical-align: top; }
th { width: 180px; background: #f3f6ff; }
.code { background: #f8f9ff; padding: 12px; border-radius: 8px; white-space: pre-wrap; word-break: break-word; }
</style>
</head>
<body>
  <section class="page">
    <h1>HumanDesign Basic Report (MVP)</h1>
    <small>입력 일시: ${input.localDate} ${input.localTime} (${input.timezone}) | UTC: ${utcAudit.utcIso}</small>
    <p>본 리포트는 MVP 단계의 참고용 자동 생성 리포트입니다.</p>
  </section>
  ${section('1. 요약', tableHtml)}
  ${section('2. Centers / Channels / Gates', `<p><strong>Centers</strong>: ${(hd.definedCenters ?? []).join(', ') || '-'}</p><p><strong>Channels</strong>: ${(hd.definedChannels ?? []).join(', ') || '-'}</p><p><strong>Gates</strong>: ${(hd.activeGates ?? []).join(', ') || '-'}</p>`)}
  ${section('3. Meta', codeBlock(hd.meta ?? {}))}
  ${section('4. Config Fingerprint', codeBlock(hd.config ?? {}))}
  ${section('5. Raw Input & UTC Audit', codeBlock({ input, utcAudit }))}
  ${section('6. Notes', '<p>- 출생시간 모름 모드일 경우 일부 항목은 후보/범위 기반 해석이 필요합니다.</p><p>- API 공급자/엔진 버전 변경 시 결과가 달라질 수 있습니다.</p>')}
</body>
</html>`;
}
