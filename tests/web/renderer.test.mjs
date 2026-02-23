import test from 'node:test';
import assert from 'node:assert/strict';
import { renderBodyGraphSvg } from '../../src/web/renderer.mjs';

test('renders required id conventions for centers/channels/gates', () => {
  const svg = renderBodyGraphSvg({
    definedCenters: ['head'],
    definedChannels: ['61-24'],
    activeGates: [61]
  });

  assert.match(svg, /id="center-head"/);
  assert.match(svg, /id="channel--61-24"/);
  assert.match(svg, /id="gate-61"/);
});

test('applies active/inactive classes from json toggles', () => {
  const svg = renderBodyGraphSvg({
    definedCenters: ['head'],
    definedChannels: [],
    activeGates: []
  });

  assert.match(svg, /id="center-head" class="center active"/);
  assert.match(svg, /id="center-ajna" class="center inactive"/);
});
