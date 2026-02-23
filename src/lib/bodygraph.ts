import { normalizeCenterKey, normalizeTypeCode, type HdOutput, validateHdOutput } from './schema.js';

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

type BodyGraphResponse = {
  type?: string;
  profile?: string;
  authority?: string;
  definition?: string;
  centers?: Array<{ key: string; defined: boolean }>;
  channels?: Array<{ key: string; defined: boolean }>;
  gates?: Array<{ gate: number; active: boolean }>;
};

export async function fetchBodyGraph(datetimeUtcIso: string, apiKey: string): Promise<HdOutput> {
  const url = new URL('https://api.bodygraph.info/');
  url.searchParams.set('datetime', datetimeUtcIso);
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`BodyGraph API failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as BodyGraphResponse;

  return validateHdOutput({
    definedCenters: unique(
      (payload.centers ?? [])
        .filter((c) => c.defined)
        .map((c) => normalizeCenterKey(c.key))
        .filter(Boolean)
    ),
    definedChannels: unique((payload.channels ?? []).filter((c) => c.defined).map((c) => c.key).filter(Boolean)),
    activeGates: unique(
      (payload.gates ?? [])
        .filter((g) => g.active)
        .map((g) => g.gate)
        .filter((gate) => Number.isInteger(gate) && gate >= 1 && gate <= 64)
    ),
    meta: {
      type: normalizeTypeCode(payload.type),
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
