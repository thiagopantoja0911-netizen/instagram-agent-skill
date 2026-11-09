/** Run the six original Python modules inside Node.js via Pyodide.
 * No Python subprocess or VPS required. The interpreter is serialized to
 * avoid overlapping modification of Python globals and stdin.
 */
import { loadPyodide } from 'pyodide';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const VENDOR = resolve(HERE, 'vendor');
const INPUT_LIMIT = 200_000;
const PROGRAM_FILES = [
  'skills/ig-reel/hookscore.py', 'skills/ig-reel/beats.py',
  'skills/ig-reel/hooks.json', 'skills/ig-caption/caption.py',
  'skills/ig-human/humanize.py', 'skills/ig-human/detect.py',
  'skills/ig-human/slop.json', 'skills/ig-viral/swipe.py',
  'node-hostinger/bridge.py',
];
const TOOL_NAMES = new Set([
  'score_hooks', 'build_beats', 'lint_caption', 'humanize_text',
  'detect_human_score', 'analyze_swipe_file',
]);
let initializePromise;
let chain = Promise.resolve();

async function initialize() {
  const py = await loadPyodide({ stdout: () => {}, stderr: () => {} });
  for (const file of PROGRAM_FILES) {
    const bytes = await readFile(file === 'node-hostinger/bridge.py'
      ? resolve(HERE, 'bridge.py') : resolve(VENDOR, file));
    const target = `/app/${file}`;
    py.FS.mkdirTree(dirname(target));
    py.FS.writeFile(target, bytes);
  }
  py.runPython(`import sys
sys.path.insert(0, '/app/skills/ig-reel')
sys.path.insert(0, '/app/skills/ig-caption')
sys.path.insert(0, '/app/skills/ig-human')
sys.path.insert(0, '/app/skills/ig-viral')
sys.path.insert(0, '/app/node-hostinger')
from bridge import invoke_json`);
  return py;
}

export async function invokeTool(toolName, params) {
  if (!TOOL_NAMES.has(toolName)) throw new Error('Ferramenta não reconhecida.');
  const payload = JSON.stringify(params);
  if (Buffer.byteLength(payload, 'utf8') > INPUT_LIMIT) throw new Error('Entrada excede o limite de 200 KB.');
  initializePromise ??= initialize();
  const operation = chain.then(async () => {
    const py = await initializePromise;
    py.globals.set('_instagram_tool', toolName);
    py.globals.set('_instagram_payload', payload);
    try {
      const output = py.runPython('invoke_json(_instagram_tool, _instagram_payload)');
      return JSON.parse(output);
    } finally {
      py.globals.delete('_instagram_tool');
      py.globals.delete('_instagram_payload');
    }
  });
  chain = operation.then(() => {}, () => {});
  return operation;
}
