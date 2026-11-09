import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { invokeTool } from '../engine.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
function reference(file, text, args = []) {
  const result = spawnSync('python3', [resolve(root, file), '-', '--json', ...args], {
    input: text, encoding: 'utf8', cwd: root, maxBuffer: 1024 * 1024,
  });
  assert.ok([0, 1].includes(result.status), `${file}: ${result.stderr}`);
  return JSON.parse(result.stdout);
}
const tsv = 'account\tfollowers\tmedian\tviews\thook\n@a\t12000\t1000\t12000\tnobody tells you what matters\n@b\t9000\t2000\t5000\tmy client lost three invoices\n';
const cases = [
  { name: 'score_hooks', args: {hooks: ['I lost $18,000 because of one missing contract.']}, file: 'skills/ig-reel/hookscore.py', input: 'I lost $18,000 because of one missing contract.' },
  { name: 'build_beats', args: {script: 'I lost $18,000 because of one missing contract.\nCheck before you sign.\n'}, file: 'skills/ig-reel/beats.py', input: 'I lost $18,000 because of one missing contract.\nCheck before you sign.\n', extra: ['--target', '30'] },
  { name: 'lint_caption', args: {caption: 'This contract clause cost $18,000.\nRead it before you sign. #contracts'}, file: 'skills/ig-caption/caption.py', input: 'This contract clause cost $18,000.\nRead it before you sign. #contracts' },
  { name: 'humanize_text', args: {text: "In today's fast-paced world—check this clause."}, file: 'skills/ig-human/humanize.py', input: "In today's fast-paced world—check this clause." },
  { name: 'detect_human_score', args: {text: 'I lost $18,000 because of one missing contract.'}, file: 'skills/ig-human/detect.py', input: 'I lost $18,000 because of one missing contract.' },
  { name: 'analyze_swipe_file', args: {tsv}, file: 'skills/ig-viral/swipe.py', input: tsv },
];
for (const scenario of cases) {
  test(`Node/Pyodide parity with Python CLI: ${scenario.name}`, async () => {
    const got = await invokeTool(scenario.name, scenario.args);
    const expected = reference(scenario.file, scenario.input, scenario.extra);
    assert.deepEqual(got, expected);
  });
}
test('batch hook scoring preserves original list shape', async () => {
  const hooks = ['I lost $18,000 because of one contract.', 'Stop posting three times daily.'];
  const expected = reference('skills/ig-reel/hookscore.py', hooks.join('\n'));
  const got = await invokeTool('score_hooks', {hooks});
  assert.deepEqual(got, expected);
});
test('invalid tool, empty hooks, oversized payload fail closed', async () => {
  await assert.rejects(invokeTool('nonexistent', {}));
  await assert.rejects(invokeTool('score_hooks', {hooks: []}));
  await assert.rejects(invokeTool('humanize_text', {text: 'a'.repeat(200_001)}));
});
