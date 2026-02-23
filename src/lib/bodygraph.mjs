import { normalizeCenterKey, normalizeTypeCode, validateHdOutput } from './schema.mjs';

function unique(items) {
  return [...new Set(items)];
}

export async function fetchBodyGraph(datetimeUtcIso, apiKey) {
  const url = new URL('https://api.bodygraph.info/');
  url.searchParams.set('datetime', datetimeUtcIso);
  url.searchParams.set('key', apiKey);

  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`BodyGraph API failed: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();

  return validateHdOutput({
    definedCenters: unique(
      (payload.centers ?? [])
        .filter((c) => c.defined)
        .map((c) => normalizeCenterKey(String(c.key ?? '')))
        .filter(Boolean)
    ),
    definedChannels: unique(
      (payload.channels ?? [])
        .filter((c) => c.defined)
        .map((c) => String(c.key ?? ''))
        .filter(Boolean)
    ),
    activeGates: unique(
      (payload.gates ?? [])
        .filter((g) => g.active)
        .map((g) => Number(g.gate))
        .filter((gate) => Number.isInteger(gate) && gate >= 1 && gate <= 64)
    ),
    meta: {
      type: normalizeTypeCode(payload.type),
      profile: String(payload.profile ?? 'unknown'),
      authority: String(payload.authority ?? 'unknown'),
      definition: String(payload.definition ?? 'unknown')
    },
    config: {
      tz: 'Asia/Seoul',
      zodiac: 'tropical',
      node: 'provider_default',
      ephemeris: 'bodygraphinfo',
      engineVersion: process.env.HD_ENGINE_VERSION ?? '0.1.0',
      epsilonDeg: Number(process.env.HD_EPSILON_DEG ?? '0.0001'),
      gateWheelVersion: process.env.HD_GATE_WHEEL_VERSION ?? 'v1'
    }
  });
}
