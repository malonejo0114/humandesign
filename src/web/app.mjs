import { renderBodyGraphSvg } from './renderer.mjs';
import { requestBasicReportWithRetry } from './report-client.mjs';

const form = document.getElementById('input-form');
const output = document.getElementById('graph-output');
const badge = document.getElementById('time-unknown-badge');
const status = document.getElementById('status');
const metricsEl = document.getElementById('metrics');
const downloadBtn = document.getElementById('download-report');
const unlockBtn = document.getElementById('unlock-btn');
const refreshMetricsBtn = document.getElementById('refresh-metrics');
const zoomInBtn = document.getElementById('zoom-in');
const zoomResetBtn = document.getElementById('zoom-reset');
const rangeSlider = document.getElementById('range-slider');
const chips = document.getElementById('candidate-chips');
const sheet = document.getElementById('sheet');
const sheetTitle = document.getElementById('sheet-title');
const sheetBody = document.getElementById('sheet-body');
const closeSheetBtn = document.getElementById('close-sheet');

const typeEl = document.getElementById('type-value');
const strategyEl = document.getElementById('strategy-value');
const authorityEl = document.getElementById('authority-value');

let latestPayload = null;
let zoom = 1;
let unlocked = false;

const strategyMap = {
  mg: '반응 후 실행',
  ge: '반응하기',
  ma: '알리고 시작',
  pr: '초대 기다리기',
  re: '월주기 관찰'
};

const candidateSets = [
  { label: '오전 후보', centers: ['head', 'ajna'], channels: ['61-24'], gates: [61, 24] },
  { label: '정오 후보', centers: ['head', 'ajna', 'sacral'], channels: ['61-24', '34-20'], gates: [61, 24, 34, 20] },
  { label: '오후 후보', centers: ['throat', 'identity', 'solarPlexus'], channels: ['43-23'], gates: [43, 23] }
];

function openSheet(title, body) {
  sheetTitle.textContent = title;
  sheetBody.textContent = body;
  sheet.setAttribute('aria-hidden', 'false');
  document.body.classList.add('sheet-open');
}

function closeSheet() {
  sheet.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('sheet-open');
}

function render(hd) {
  output.innerHTML = renderBodyGraphSvg(hd);
  const svg = output.querySelector('svg');
  if (svg) {
    svg.style.transform = `scale(${zoom})`;
    svg.style.transformOrigin = 'center top';
  }
}

function renderSummary(payload) {
  const meta = payload.hd.meta ?? {};
  typeEl.textContent = meta.type ?? 'unknown';
  strategyEl.textContent = strategyMap[meta.type] ?? '전략 확인 필요';
  authorityEl.textContent = meta.authority ?? 'unknown';
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

function renderCandidateChips(selectedIndex = 1) {
  chips.innerHTML = '';
  candidateSets.forEach((candidate, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `chip ${index === selectedIndex ? 'selected' : ''}`;
    btn.role = 'option';
    btn.ariaSelected = String(index === selectedIndex);
    btn.textContent = candidate.label;
    btn.addEventListener('click', () => {
      rangeSlider.value = String(index);
      applyRangeCandidate(index);
    });
    chips.appendChild(btn);
  });
}

function applyRangeCandidate(index) {
  renderCandidateChips(index);

  if (!latestPayload) return;

  const selected = candidateSets[index];
  const next = {
    ...latestPayload.hd,
    definedCenters: selected.centers,
    definedChannels: selected.channels,
    activeGates: selected.gates
  };

  render(next);
  openSheet('Range 후보 적용', `${selected.label} 차트로 전환되었습니다.`);
}

async function refreshMetrics() {
  const response = await fetch('/api/metrics');
  if (!response.ok) {
    metricsEl.textContent = 'metrics 조회 실패';
    return;
  }
  const metrics = await response.json();
  metricsEl.textContent = JSON.stringify(metrics, null, 2);
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
    renderCandidateChips(Number(rangeSlider.value));
    status.textContent = `입력→UTC→차트 렌더 완료 (${payload.cacheHit ? 'cache HIT' : 'cache MISS'})`;
    await refreshMetrics();
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
    await refreshMetrics();
  } catch (error) {
    status.textContent = `리포트 생성 실패: ${error instanceof Error ? error.message : 'unknown'}`;
  }
});

unlockBtn.addEventListener('click', () => {
  unlocked = true;
  downloadBtn.disabled = false;
  openSheet('유료 리포트 언락', 'PDF 다운로드가 활성화되었습니다.');
});

zoomInBtn.addEventListener('click', () => {
  zoom = Math.min(1.8, zoom + 0.2);
  if (latestPayload) render(latestPayload.hd);
});

zoomResetBtn.addEventListener('click', () => {
  zoom = 1;
  if (latestPayload) render(latestPayload.hd);
});

rangeSlider.addEventListener('input', () => {
  applyRangeCandidate(Number(rangeSlider.value));
});

output.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  if (target.id.startsWith('gate-')) {
    openSheet('게이트 설명', `${target.id} 활성 상태를 확인하세요.`);
    return;
  }

  if (target.id.startsWith('channel--')) {
    target.classList.add('flash');
    setTimeout(() => target.classList.remove('flash'), 150);
    openSheet('채널 설명', `${target.id} 연결 센터를 강조했습니다.`);
  }
});

closeSheetBtn.addEventListener('click', closeSheet);
sheet.addEventListener('click', (event) => {
  if (event.target === sheet) closeSheet();
});

refreshMetricsBtn.addEventListener('click', refreshMetrics);
renderCandidateChips(1);
refreshMetrics();
