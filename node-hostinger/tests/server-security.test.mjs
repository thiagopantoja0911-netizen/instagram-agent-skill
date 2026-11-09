import {test} from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
for (const key of Object.keys(process.env)) {
  if (key.startsWith('INSTAGRAM_MCP_')) delete process.env[key];
}
const {app, configured} = await import('../server.mjs');

test('unauthenticated server stays locked without OAuth configuration', async () => {
  assert.equal(configured, false);
  const listener = app.listen(0, '127.0.0.1');
  try {
    const origin = `http://127.0.0.1:${listener.address().port}`;
    const health = await fetch(origin + '/health');
    const state = await health.json();
    assert.equal(state.auth, 'locked');
    assert.equal(state.ready, false);
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
    await new Promise((resolve, reject) => listener.close(err => err ? reject(err) : resolve()));
  }
});
