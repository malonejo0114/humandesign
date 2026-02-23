const centers = ['head', 'ajna', 'throat', 'identity', 'ego', 'spleen', 'sacral', 'solarPlexus', 'root'];

const channels = ['61-24', '43-23', '34-20'];

const gates = [61, 24, 43, 23, 34, 20];

function activeClass(active) {
  return active ? 'active' : 'inactive';
}

export function renderBodyGraphSvg(hd) {
  const centerSet = new Set(hd.definedCenters ?? []);
  const channelSet = new Set(hd.definedChannels ?? []);
  const gateSet = new Set(hd.activeGates ?? []);

  const centerRects = centers
    .map((center, i) => {
      const x = 20 + (i % 3) * 110;
      const y = 20 + Math.floor(i / 3) * 90;
      return `<rect id="center-${center}" class="center ${activeClass(centerSet.has(center))}" x="${x}" y="${y}" width="80" height="56" rx="8" />`;
    })
    .join('\n');

  const channelLines = channels
    .map((channel, i) => {
      const y = 320 + i * 24;
      return `<line id="channel--${channel}" class="channel ${activeClass(channelSet.has(channel))}" x1="24" y1="${y}" x2="340" y2="${y}" />`;
    })
    .join('\n');

  const gateNodes = gates
    .map((gate, i) => {
      const x = 28 + i * 52;
      return `<circle id="gate-${gate}" class="gate ${activeClass(gateSet.has(gate))}" cx="${x}" cy="420" r="12" />`;
    })
    .join('\n');

  return `<svg viewBox="0 0 380 460" role="img" aria-label="Human Design BodyGraph">
  <g>${centerRects}</g>
  <g>${channelLines}</g>
  <g>${gateNodes}</g>
</svg>`;
}

export const demoHdJson = {
  definedCenters: ['head', 'ajna', 'sacral', 'solarPlexus'],
  definedChannels: ['61-24', '34-20'],
  activeGates: [61, 24, 34, 20],
  meta: { type: 'mg', profile: '4/6', authority: 'emotional', definition: 'split' }
};
