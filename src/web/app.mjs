import { renderBodyGraphSvg, demoHdJson } from './renderer.mjs';

const form = document.getElementById('input-form');
const output = document.getElementById('graph-output');
const badge = document.getElementById('time-unknown-badge');
const status = document.getElementById('status');

function render(data) {
  output.innerHTML = renderBodyGraphSvg(data);
}

render(demoHdJson);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const birthKnown = document.querySelector('input[name="birth-time-mode"]:checked')?.value;
  badge.hidden = birthKnown !== 'unknown';

  status.textContent = '입력 검증 통과 (MVP 데모 렌더).';

  const modified = {
    ...demoHdJson,
    definedCenters: birthKnown === 'unknown' ? ['head', 'ajna'] : demoHdJson.definedCenters,
    definedChannels: birthKnown === 'unknown' ? ['61-24'] : demoHdJson.definedChannels,
    activeGates: birthKnown === 'unknown' ? [61, 24] : demoHdJson.activeGates
  };

  render(modified);
});
