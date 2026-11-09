/** Bundle unchanged Python source and rule assets for Node hosting. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const FILES = [
  'skills/ig-reel/hookscore.py', 'skills/ig-reel/beats.py',
  'skills/ig-reel/hooks.json', 'skills/ig-caption/caption.py',
  'skills/ig-human/humanize.py', 'skills/ig-human/detect.py',
  'skills/ig-human/slop.json', 'skills/ig-viral/swipe.py',
];
for (const name of FILES) {
  const source = await readFile(resolve(ROOT, name));
  const target = resolve(HERE, 'vendor', name);
  await mkdir(dirname(target), {recursive: true});
  await writeFile(target, source);
}
console.log('Bundled all 6 unchanged Python scripts and 2 rule sets for Node hosting.');
