# HumanDesign internal output schema (MVP)

## Fixed assumptions

- `tz`: `Asia/Seoul`
- `zodiac`: `tropical`
- `node`: `provider_default` (BodyGraph.info node mode is not configurable in docs)
- `ephemeris`: `bodygraphinfo`

## Canonical JSON

```json
{
  "definedCenters": ["head", "ajna"],
  "definedChannels": ["61-24"],
  "activeGates": [61, 24],
  "meta": {
    "type": "mg",
    "profile": "4/6",
    "authority": "emotional",
    "definition": "split"
  },
  "config": {
    "tz": "Asia/Seoul",
    "zodiac": "tropical",
    "node": "provider_default",
    "ephemeris": "bodygraphinfo",
    "engineVersion": "0.1.0",
    "epsilonDeg": 0.0001,
    "gateWheelVersion": "v1"
  }
}
```

## Mapping rules

### Type code to label

- `mg` → Manifesting Generator
- `ge` → Generator
- `ma` → Manifestor
- `pr` → Projector
- `re` → Reflector

### Center key normalization

- `solar_plexus`, `solar_plexus_center` → `solarPlexus`
- `g` → `identity`
- `heart` → `ego`

## Anchor-4 verification

`tests/fixtures/anchor4.golden.json` is verified by `pnpm test:anchor4`.

- If `BODYGRAPH_API_KEY` is missing, the command exits cleanly (skip mode).
- If golden values are `TBD`, script prints observed values to help seed fixtures.
- If golden values are populated and mismatched, command fails with diff output.

## Fingerprint policy

Persist `config` on `charts` and `reports` rows to trace rendering/output drift caused by engine upgrades.
