# humandesign

Sprint 0/1 bootstrap for Human Design MVP.

## Local dev

```bash
pnpm install
pnpm dev
```

- Web + API demo: `http://127.0.0.1:4173`
- Utility sample runner: `pnpm dev:api`

## Demo flow

- UI 레이아웃은 모바일 고정 폭(360px)으로 동작
- 모바일 시안 초안은 A안(상단 고정 네비 + 히어로 차트 + 카드 스택) 기반으로 반영

1. 생년월일/출생시간 입력 후 `렌더 업데이트` 클릭
2. 서버가 `Asia/Seoul -> UTC` 변환 후 차트 JSON 반환
3. UI가 JSON 기반 SVG를 토글 렌더 (동일 입력은 캐시 HIT)
4. 게이트/채널 탭 시 바텀시트 툴팁 노출
5. `Basic 리포트 다운로드` 클릭 시 HTML 리포트 다운로드 (실패 시 1회 재시도)
6. `Metrics 새로고침` 버튼으로 chart/report 요청수, cache hit, 실패수, 평균 응답시간 확인

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
