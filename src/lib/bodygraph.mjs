import { validateHdOutput } from './schema.mjs';

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
    definedCenters: (payload.centers ?? []).filter((c) => c.defined).map((c) => c.key),
    definedChannels: (payload.channels ?? []).filter((c) => c.defined).map((c) => c.key),
    activeGates: (payload.gates ?? []).filter((g) => g.active).map((g) => g.gate),
    meta: {
      type: payload.type ?? 'unknown',
      profile: payload.profile ?? 'unknown',
      authority: payload.authority ?? 'unknown',
      definition: payload.definition ?? 'unknown'
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
