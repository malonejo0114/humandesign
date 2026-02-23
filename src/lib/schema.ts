import { z } from 'zod';

export const hdOutputSchema = z.object({
  definedCenters: z.array(z.string()),
  definedChannels: z.array(z.string()),
  activeGates: z.array(z.number()),
  meta: z.object({
    type: z.string(),
    profile: z.string(),
    authority: z.string(),
    definition: z.string()
  }),
  config: z.object({
    tz: z.literal('Asia/Seoul'),
    zodiac: z.literal('tropical'),
    node: z.literal('provider_default'),
    ephemeris: z.literal('bodygraphinfo'),
    engineVersion: z.string(),
    epsilonDeg: z.number(),
    gateWheelVersion: z.string()
  })
});

export type HdOutput = z.infer<typeof hdOutputSchema>;

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
  heart: 'ego',
  spleen: 'spleen',
  sacral: 'sacral',
  solar_plexus: 'solarPlexus',
  solar_plexus_center: 'solarPlexus',
  root: 'root'
};
