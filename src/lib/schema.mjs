export const typeLabelMap = {
  mg: 'Manifesting Generator',
  ge: 'Generator',
  ma: 'Manifestor',
  pr: 'Projector',
  re: 'Reflector'
};

export const centerMap = {
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

function ensureArray(input, key) {
  if (!Array.isArray(input)) throw new Error(`Invalid payload: ${key} must be an array.`);
}

export function normalizeCenterKey(key) {
  return centerMap[key] ?? key;
}

export function normalizeTypeCode(typeCode) {
  if (!typeCode) return 'unknown';
  const normalized = String(typeCode).toLowerCase();
  return typeLabelMap[normalized] ? normalized : 'unknown';
}

export function validateHdOutput(data) {
  const required = ['definedCenters', 'definedChannels', 'activeGates', 'meta', 'config'];
  for (const key of required) {
    if (!(key in data)) throw new Error(`Missing key: ${key}`);
  }

  ensureArray(data.definedCenters, 'definedCenters');
  ensureArray(data.definedChannels, 'definedChannels');
  ensureArray(data.activeGates, 'activeGates');

  if (typeof data.meta !== 'object' || data.meta === null) throw new Error('Invalid payload: meta is required.');
  if (typeof data.config !== 'object' || data.config === null) throw new Error('Invalid payload: config is required.');

  return data;
}
