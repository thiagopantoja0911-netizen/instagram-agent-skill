/**
 * Bounded, lazy and memory-reclaiming runtime for shared Hostinger Node plans.
 * No interpreter is loaded during server startup. One Python invocation at a
 * time, maximum four accepted requests, and at most one Pyodide worker.
 * Idle worker is terminated to reclaim WASM memory.
 */
import { Worker } from 'node:worker_threads';

const ALLOWED = new Set([
  'score_hooks', 'build_beats', 'lint_caption', 'humanize_text',
  'detect_human_score', 'analyze_swipe_file',
]);
const MAX_INPUT_BYTES = 200_000;
const MAX_PENDING = 4;
const TIMEOUT_MS = 30_000;
// Tests can choose a shorter idle duration; normal default is 25 seconds.
const ms = Number(process.env.INSTAGRAM_WORKER_IDLE_MS);
const IDLE_MS = Number.isFinite(ms) && ms >= 100 && ms <= 60_000 ? ms : 25_000;

let worker = null;
let active = null;
let pending = 0;
let queue = Promise.resolve();
let idleTimer = null;
let sequence = 0;

function clearIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = null;
}

function dropWorker(instance, reason = 'WORKER_UNAVAILABLE') {
  if (worker !== instance) return;
  worker = null;
  clearIdleTimer();
  const request = active;
  active = null;
  if (request) {
    clearTimeout(request.timeout);
    request.reject(new Error(reason));
  }
  void instance.terminate().catch(() => {});
}

function ensureWorker() {
  if (worker) return worker;
  const instance = new Worker(new URL('./worker.mjs', import.meta.url), {
    // Never pass arbitrary Node startup arguments or host credentials to
    // subprocesses. The worker shares the parent process environment.
    execArgv: [],
  });
  instance.on('message', response => {
    if (worker !== instance || !active || response.id !== active.id) return;
    const request = active;
    active = null;
    clearTimeout(request.timeout);
    if (response.ok) request.resolve(response.result);
    else request.reject(new Error('TOOL_EXECUTION_FAILED'));
  });
  instance.on('error', () => dropWorker(instance));
  instance.on('exit', () => dropWorker(instance));
  worker = instance;
  return instance;
}

function scheduleIdle() {
  clearIdleTimer();
  if (pending || active || !worker) return;
  idleTimer = setTimeout(() => {
    const old = worker;
    if (old && !active && pending === 0) dropWorker(old, 'IDLE_RELEASE');
  }, IDLE_MS);
  idleTimer.unref?.();
}

function runSingle(name, args) {
  clearIdleTimer();
  const instance = ensureWorker();
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => {
      if (active?.id === id) dropWorker(instance, 'TOOL_TIMEOUT');
    }, TIMEOUT_MS);
    active = { id, resolve, reject, timeout };
    try {
      instance.postMessage({ id, name, args });
    } catch {
      dropWorker(instance);
    }
  });
}

export async function invokeToolBounded(name, args) {
  if (!ALLOWED.has(name)) throw new Error('UNKNOWN_TOOL');
  const data = JSON.stringify(args);
  if (typeof data !== 'string' || Buffer.byteLength(data, 'utf8') > MAX_INPUT_BYTES) {
    throw new Error('INPUT_LIMIT_EXCEEDED');
  }
  if (pending >= MAX_PENDING) throw new Error('BUSY');
  pending++;
  // FIFO serialization ensures the original Python global state and stdin
  // emulation cannot be accessed concurrently.
  const current = queue.then(() => runSingle(name, args));
  queue = current.catch(() => {});
  try {
    return await current;
  } finally {
    pending--;
    scheduleIdle();
  }
}

export function runtimeStatusForTests() {
  return Object.freeze({workerRunning: !!worker, acceptedRequests: pending});
}
