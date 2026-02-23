import { readFile } from 'node:fs/promises';

const apiKey = process.env.BODYGRAPH_API_KEY;
if (!apiKey) {
  console.log('Skipping Anchor-4 check: BODYGRAPH_API_KEY is not set.');
  process.exit(0);
}

const goldenRaw = await readFile(new URL('../tests/fixtures/anchor4.golden.json', import.meta.url), 'utf8');
const cases = JSON.parse(goldenRaw);

const toKey = (activation) => `${activation.gate}.${activation.line}`;

function extractAnchor4(payload) {
  const activations = payload?.incarnation_cross?.activations ?? [];
  const personalitySun = activations.find((a) => a.personality && a.planet === 'sun');
  const personalityEarth = activations.find((a) => a.personality && a.planet === 'earth');
  const designSun = activations.find((a) => !a.personality && a.planet === 'sun');
  const designEarth = activations.find((a) => !a.personality && a.planet === 'earth');

  if (!personalitySun || !personalityEarth || !designSun || !designEarth) {
    throw new Error('incarnation_cross.activations missing one or more required entries.');
  }

  return {
    personalitySun: toKey(personalitySun),
    personalityEarth: toKey(personalityEarth),
    designSun: toKey(designSun),
    designEarth: toKey(designEarth)
  };
}

let failures = 0;
for (const entry of cases) {
  const url = new URL('https://api.bodygraph.info/');
  url.searchParams.set('datetime', entry.inputUtc);
  url.searchParams.set('key', apiKey);

  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    console.error(`✗ ${entry.inputUtc}: API ${response.status} ${response.statusText}`);
    failures += 1;
    continue;
  }

  const payload = await response.json();
  const actual = extractAnchor4(payload);
  const expected = entry.anchor4;

  const isTbd = Object.values(expected).some((value) => value === 'TBD');
  if (isTbd) {
    console.log(`ℹ ${entry.inputUtc} -> ${JSON.stringify(actual)} (golden is TBD)`);
    continue;
  }

  if (
    expected.personalitySun !== actual.personalitySun ||
    expected.personalityEarth !== actual.personalityEarth ||
    expected.designSun !== actual.designSun ||
    expected.designEarth !== actual.designEarth
  ) {
    console.error(`✗ ${entry.inputUtc}`);
    console.error(`  expected: ${JSON.stringify(expected)}`);
    console.error(`  actual:   ${JSON.stringify(actual)}`);
    failures += 1;
    continue;
  }

  console.log(`✓ ${entry.inputUtc}`);
}

if (failures > 0) {
  process.exit(1);
}
