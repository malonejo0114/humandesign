export const typeLabelMap: Record<string, string> = {
  mg: 'Manifesting Generator',
  ge: 'Generator',
  ma: 'Manifestor',
  pr: 'Projector',
  re: 'Reflector'
};

export const centerMap: Record<string, string> = {
  head: 'head',
  ajna: 'ajna',
  throat: 'throat',
  g: 'identity',
  identity: 'identity',
  heart: 'ego',
  ego: 'ego',
  spleen: 'spleen',
  sacral: 'sacral',
  solar_plexus: 'solarPlexus',
  solar_plexus_center: 'solarPlexus',
  solarPlexus: 'solarPlexus',
  root: 'root'
};

export type HdOutput = {
  definedCenters: string[];
  definedChannels: string[];
  activeGates: number[];
  meta: {
    type: string;
    profile: string;
    authority: string;
    definition: string;
  };
  config: {
    tz: 'Asia/Seoul';
    zodiac: 'tropical';
    node: 'provider_default';
    ephemeris: 'bodygraphinfo';
    engineVersion: string;
    epsilonDeg: number;
    gateWheelVersion: string;
  };
};

export function normalizeCenterKey(key: string): string {
  return centerMap[key] ?? key;
}

export function normalizeTypeCode(typeCode?: string): string {
  if (!typeCode) return 'unknown';
  const normalized = String(typeCode).toLowerCase();
  return typeLabelMap[normalized] ? normalized : 'unknown';
}

export function validateHdOutput(data: HdOutput): HdOutput {
  return data;
}
