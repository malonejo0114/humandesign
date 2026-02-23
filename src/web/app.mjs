import { renderBodyGraphSvg } from './renderer.mjs';
import { requestBasicReportWithRetry } from './report-client.mjs';

const form = document.getElementById('input-form');
const output = document.getElementById('graph-output');
const badge = document.getElementById('time-unknown-badge');
const status = document.getElementById('status');
const summary = document.getElementById('summary');
const downloadBtn = document.getElementById('download-report');

let latestPayload = null;

function render(data) {
  output.innerHTML = renderBodyGraphSvg(data);
}

function renderSummary(payload) {
  const meta = payload.hd.meta ?? {};
  summary.innerHTML = `
    <li>Type: ${meta.type ?? 'unknown'}</li>
    <li>Profile: ${meta.profile ?? 'unknown'}</li>
    <li>Authority: ${meta.authority ?? 'unknown'}</li>
    <li>UTC: ${payload.utcAudit.utcIso}</li>
    <li>입력 모드: ${payload.input.mode ?? 'exact'}</li>
    <li>캐시: ${payload.cacheHit ? 'HIT' : 'MISS'}</li>
  `;
}

async function requestChart(localDate, localTime, mode) {
  const response = await fetch('/api/chart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ localDate, localTime, timezone: 'Asia/Seoul', mode })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? 'request failed');
  }

  return response.json();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const localDate = document.getElementById('birth-date').value;
  const localTime = document.getElementById('birth-time').value || '12:00:00';
  const mode = document.querySelector('input[name="birth-time-mode"]:checked')?.value ?? 'exact';

  badge.hidden = mode !== 'unknown';
  status.textContent = '처리 중...';

  try {
    const payload = await requestChart(localDate, localTime, mode);
    latestPayload = payload;
    render(payload.hd);
    renderSummary(payload);
    status.textContent = '입력→UTC→차트 렌더 완료';
  } catch (error) {
    status.textContent = `오류: ${error instanceof Error ? error.message : 'unknown'}`;
  }
});

downloadBtn.addEventListener('click', async () => {
  if (!latestPayload) {
    status.textContent = '먼저 렌더를 실행하세요.';
    return;
  }

  status.textContent = '리포트 생성 중...';

  try {
    const html = await requestBasicReportWithRetry(latestPayload, { retries: 1 });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hd-basic-report.html';
    a.click();
    URL.revokeObjectURL(url);
    status.textContent = 'Basic 리포트 HTML 다운로드 완료';
  } catch (error) {
    status.textContent = `리포트 생성 실패: ${error instanceof Error ? error.message : 'unknown'}`;
  }
});
