import { test } from 'node:test';
import assert from 'node:assert/strict';

// Short-lived Pyodide workers in tests, production defaults to 25s idle.
process.env.INSTAGRAM_WORKER_IDLE_MS = '250';
const { invokeToolBounded, runtimeStatusForTests } = await import('../runtime.mjs');

const input = {hooks: ['I lost $18,000 because of one missing contract.']};

test('idle Node process does not start Pyodide', () => {
  const state = runtimeStatusForTests();
  assert.equal(state.workerRunning, false);
  assert.equal(state.acceptedRequests, 0);
});

test('one worker computes a real result and is released after inactivity', async () => {
  const result = await invokeToolBounded('score_hooks', input);
  assert.equal(typeof result.score, 'number');
  assert.equal(runtimeStatusForTests().workerRunning, true);
  await new Promise(resolve => setTimeout(resolve, 700));
  assert.equal(runtimeStatusForTests().workerRunning, false);
});

test('bounded runtime rejects extra concurrent jobs and preserves results', async () => {
  const requests = Array.from({length: 4}, () => invokeToolBounded('score_hooks', input));
  await assert.rejects(invokeToolBounded('score_hooks', input), /BUSY/);
  const results = await Promise.all(requests);
  assert.equal(results.length, 4);
  assert.deepEqual(results[0], results[3]);
  assert.equal(runtimeStatusForTests().acceptedRequests, 0);
});

test('invalid input and unknown tools are rejected without loading code', async () => {
  await assert.rejects(invokeToolBounded('unknown', {}), /UNKNOWN_TOOL/);
  await assert.rejects(invokeToolBounded('humanize_text', {text:'x'.repeat(200_001)}), /INPUT_LIMIT_EXCEEDED/);
});
