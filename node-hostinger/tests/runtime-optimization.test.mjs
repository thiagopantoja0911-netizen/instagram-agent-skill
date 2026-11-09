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

test('bounded worker transport supports all six algorithms', async () => {
  const tests = [
    ['score_hooks', {hooks: ['I lost $18,000 because of one contract.']}, 'score'],
    ['build_beats', {script: 'Here is what changed in our business.\\nReview before signing.\\n'}, 'total_seconds'],
    ['lint_caption', {caption: 'Check the clause. #contracts'}, 'verdict'],
    ['humanize_text', {text: "In today's fast-paced world—check this clause."}, 'report'],
    ['detect_human_score', {text: 'I lost $18,000 because of one contract.'}, 'human_score'],
    ['analyze_swipe_file', {tsv: 'account\\tfollowers\\tmedian\\tviews\\thook\\n@a\\t12000\\t1000\\t12000\\tnobody tells you what matters\\n@b\\t9000\\t2000\\t5000\\tmy client lost three invoices\\n'}, 'reels'],
  ];
  for (const [tool, args, key] of tests) {
    const result = await invokeToolBounded(tool, args);
    assert.ok(Object.hasOwn(result, key), `Missing ${key} in ${tool}`);
  }
});

test('invalid input and unknown tools are rejected without loading code', async () => {
  await assert.rejects(invokeToolBounded('unknown', {}), /UNKNOWN_TOOL/);
  await assert.rejects(invokeToolBounded('humanize_text', {text:'x'.repeat(200_001)}), /INPUT_LIMIT_EXCEEDED/);
});
