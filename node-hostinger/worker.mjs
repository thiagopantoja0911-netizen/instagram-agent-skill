/**
 * Disposable interpreter worker. Pyodide loads only after a real authenticated
 * tool invocation, so /health and unauthenticated requests use no WASM memory.
 *
 * This runs the original Python programs via engine.mjs. The worker is never
 * started at boot and can be terminated after inactivity to reclaim memory.
 */
import { parentPort } from 'node:worker_threads';
import { invokeTool } from './engine.mjs';

if (!parentPort) throw new Error('Worker port missing');

parentPort.on('message', async message => {
  const { id, name, args } = message;
  try {
    const result = await invokeTool(name, args);
    parentPort.postMessage({ id, ok: true, result });
  } catch {
    // Don't send submitted text, paths, or Python stack traces to callers.
    parentPort.postMessage({ id, ok: false, error: 'TOOL_EXECUTION_FAILED' });
  }
});
