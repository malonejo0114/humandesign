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
  heart: 'ego',
  spleen: 'spleen',
  sacral: 'sacral',
  solar_plexus: 'solarPlexus',
  solar_plexus_center: 'solarPlexus',
  root: 'root'
};

export function validateHdOutput(data) {
  const required = ['definedCenters', 'definedChannels', 'activeGates', 'meta', 'config'];
  for (const key of required) {
    if (!(key in data)) throw new Error(`Missing key: ${key}`);
  }
  return data;
}
