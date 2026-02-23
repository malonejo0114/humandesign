import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { toUtcWithAudit } from '../src/lib/time.mjs';
import { fetchBodyGraph } from '../src/lib/bodygraph.mjs';
import { createBasicReportHtml } from '../src/lib/report.mjs';
import { createChartCacheKey } from '../src/lib/cache-key.mjs';

const root = join(process.cwd(), 'src/web');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const chartCache = new Map();

const sampleHd = {
  definedCenters: ['head', 'ajna', 'sacral', 'solarPlexus'],
  definedChannels: ['61-24', '34-20'],
  activeGates: [61, 24, 34, 20],
  meta: { type: 'mg', profile: '4/6', authority: 'emotional', definition: 'split' },
  config: {
    tz: 'Asia/Seoul',
    zodiac: 'tropical',
    node: 'provider_default',
    ephemeris: 'bodygraphinfo',
    engineVersion: process.env.HD_ENGINE_VERSION ?? '0.1.0',
    epsilonDeg: Number(process.env.HD_EPSILON_DEG ?? '0.0001'),
    gateWheelVersion: process.env.HD_GATE_WHEEL_VERSION ?? 'v1'
  }
};

function sendJson(res, code, body) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

const server = createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/chart') {
    try {
      const body = await readJson(req);
      const localTime = body.localTime || '12:00:00';
      const timezone = body.timezone || 'Asia/Seoul';
      const input = { localDate: body.localDate, localTime, timezone, mode: body.mode };
      const cacheKey = createChartCacheKey(input);

      if (chartCache.has(cacheKey)) {
        sendJson(res, 200, { ...chartCache.get(cacheKey), cacheHit: true });
        return;
      }

      const utcAudit = toUtcWithAudit(input);

      let hd = sampleHd;
      if (process.env.BODYGRAPH_API_KEY) {
        try {
          hd = await fetchBodyGraph(utcAudit.utcIso, process.env.BODYGRAPH_API_KEY);
        } catch {
          hd = sampleHd;
        }
      }

      const payload = { input, utcAudit, hd, cacheHit: false };
      chartCache.set(cacheKey, payload);
      sendJson(res, 200, payload);
      return;
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : 'invalid request' });
      return;
    }
  }

  if (req.method === 'POST' && req.url === '/api/report/basic') {
    try {
      const body = await readJson(req);
      const html = createBasicReportHtml(body);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : 'invalid request' });
      return;
    }
  }

  const path = req.url === '/' ? '/index.html' : req.url;
  const file = join(root, path);
  try {
    const buf = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'text/plain; charset=utf-8' });
    res.end(buf);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

const port = 4173;
server.listen(port, () => {
  console.log(`web dev server running on http://127.0.0.1:${port}`);
});
