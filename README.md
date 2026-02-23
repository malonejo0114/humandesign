# humandesign

Sprint 0/1 bootstrap for Human Design MVP.

## Local dev

```bash
pnpm install
pnpm dev
```

- Web UI demo: `http://127.0.0.1:4173`
- API/utility sample runner: `pnpm dev:api`

## Required env

Copy `.env.example` and set:

- `BODYGRAPH_API_KEY`
- `DATABASE_URL`
- `TZ=Asia/Seoul`

## Checks

```bash
pnpm lint
pnpm test
pnpm test:anchor4
```

> `pnpm test:anchor4` skips automatically when `BODYGRAPH_API_KEY` is not set.
