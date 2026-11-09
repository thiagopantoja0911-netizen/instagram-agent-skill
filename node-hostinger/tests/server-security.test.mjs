import {test} from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {request} from 'node:http';

process.env.NODE_ENV = 'test';
for (const key of Object.keys(process.env)) {
  if (key.startsWith('INSTAGRAM_MCP_')) delete process.env[key];
}
const {app, configured} = await import('../server.mjs');

test('unauthenticated server stays locked without OAuth configuration', async () => {
  assert.equal(configured, false);
  const listener = app.listen(0, '127.0.0.1');
  await once(listener, 'listening');
  try {
    const origin = `http://127.0.0.1:${listener.address().port}`;
    const health = await fetch(origin + '/health');
    const state = await health.json();
    assert.equal(state.auth, 'locked');
    assert.equal(state.ready, false);

    const publicHealth = await fetch(origin + '/health', {
      headers: {host: 'instagram-mcp.secretssystem.online'},
    });
    assert.equal(publicHealth.status, 200);
    const publicState = await publicHealth.json();
    assert.equal(publicState.auth, 'locked');
    assert.equal(publicState.ready, false);

    // Node fetch/undici can normalize or override the Host header. Use the
    // low-level HTTP client so this test really sends an untrusted hostname.
    const invalidHostStatus = await new Promise((resolve, reject) => {
      const requestWithHost = request({
        hostname: '127.0.0.1',
        port: listener.address().port,
        path: '/health',
        method: 'GET',
        headers: {Host: 'attacker.example'},
      }, response => {
        response.resume();
        resolve(response.statusCode);
      });
      requestWithHost.on('error', reject);
      requestWithHost.end();
    });
    assert.equal(invalidHostStatus, 403);
    const anonymous = await fetch(origin + '/mcp', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({jsonrpc: '2.0', method: 'tools/list', id: 1, params: {}}),
    });
    assert.equal(anonymous.status, 503);
    const rejectedOrigin = await fetch(origin + '/mcp', {
      method: 'POST',
      headers: {'content-type': 'application/json', 'Origin': 'https://attacker.example'},
      body: JSON.stringify({jsonrpc: '2.0', method: 'tools/list', id: 2, params: {}}),
    });
    assert.equal(rejectedOrigin.status, 403);
  } finally {
    if (listener.listening) await new Promise((resolve, reject) => listener.close(err => err ? reject(err) : resolve()));
  }
});
