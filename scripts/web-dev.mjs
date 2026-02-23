import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = join(process.cwd(), 'src/web');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8'
};

const server = createServer(async (req, res) => {
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
