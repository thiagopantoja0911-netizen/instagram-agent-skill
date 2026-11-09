/** Isolated Instagram MCP Streamable HTTP server for Hostinger Node.js 22.
 * Authentication fails closed. Do not touch the current Secrets audit MCP.
 */
import { createMcpExpressApp } from '@modelcontextprotocol/express';
import { toNodeHandler } from '@modelcontextprotocol/node';
import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import express from 'express';
import { URL } from 'node:url';
import * as z from 'zod/v4';
import { invokeTool } from './engine.mjs';

const DEFAULT_PUBLIC_URL = 'https://instagram-mcp.secretssystem.online/mcp';
const publicUrl = process.env.INSTAGRAM_MCP_PUBLIC_URL || DEFAULT_PUBLIC_URL;
const issuer = process.env.INSTAGRAM_MCP_OIDC_ISSUER || '';
const jwksUrl = process.env.INSTAGRAM_MCP_OIDC_JWKS_URL || '';
const audience = process.env.INSTAGRAM_MCP_OIDC_AUDIENCE || '';
const scope = process.env.INSTAGRAM_MCP_OIDC_SCOPE || 'instagram:analyze';
const allowedSubjects = new Set((process.env.INSTAGRAM_MCP_ALLOWED_SUBJECTS || '').split(',').map(x => x.trim()).filter(Boolean));
const allowedOrigins = new Set((process.env.INSTAGRAM_MCP_ALLOWED_ORIGINS || 'https://chatgpt.com').split(',').map(x => x.trim()).filter(Boolean));

function isHttps(raw, endWithMcp = false) {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password &&
      !url.search && !url.hash && (!endWithMcp || url.pathname === '/mcp');
  } catch { return false; }
}
const configured = isHttps(publicUrl, true) && isHttps(issuer) && isHttps(jwksUrl) &&
  typeof audience === 'string' && audience.length > 0 && allowedSubjects.size > 0 &&
  /^[-a-zA-Z0-9:_./]+$/.test(scope);
const jwks = configured ? createRemoteJWKSet(new URL(jwksUrl), {timeoutDuration: 5000}) : null;
let publicHostname = 'instagram-mcp.secretssystem.online';
try { publicHostname = new URL(publicUrl).hostname; } catch {}

const sdkAllowedOrigins = [...allowedOrigins].map(origin => {
  try { return new URL(origin).hostname || origin; } catch { return origin; }
});
const app = createMcpExpressApp({
  host: '0.0.0.0',
  allowedHosts: [publicHostname, 'localhost', '127.0.0.1', '[::1]'],
  allowedOrigins: sdkAllowedOrigins,
});
app.disable('x-powered-by');
app.use(express.json({limit: '256kb', type: 'application/json'}));

async function authenticate(req) {
  if (!configured) return {status: 503, error: 'MCP_AUTH_NOT_CONFIGURED'};
  const header = req.get('authorization') || '';
  const match = /^Bearer ([A-Za-z0-9._~+\/-]+=*)$/i.exec(header);
  if (!match || match[1].length > 8192) return {status: 401, error: 'BEARER_REQUIRED'};
  try {
    const result = await jwtVerify(match[1], jwks, {
      issuer, audience, algorithms: ['RS256', 'ES256'],
    });
    const payload = result.payload;
    const scopes = typeof payload.scope === 'string'
      ? payload.scope.split(/\s+/).filter(Boolean)
      : Array.isArray(payload.scp) ? payload.scp : [];
    if (!scopes.includes(scope) || !allowedSubjects.has(payload.sub)) {
      return {status: 403, error: 'MCP_FORBIDDEN'};
    }
    return {status: 200};
  } catch { return {status: 401, error: 'INVALID_TOKEN'}; }
}

const TOOLS = [
  ['score_hooks', 'Avalie 1 a 40 ganchos de Reels usando o algoritmo Python original.',
    z.object({hooks: z.array(z.string().min(1)).min(1).max(40)})],
  ['build_beats', 'Monte os tempos estimados de um roteiro de Reel pelo algoritmo original.',
    z.object({script: z.string().min(1), target_seconds: z.number().positive().default(30), wpm: z.number().positive().default(165)})],
  ['lint_caption', 'Revise uma legenda e seus requisitos usando o algoritmo Python original.',
    z.object({caption: z.string(), keywords: z.array(z.string()).default([])})],
  ['humanize_text', 'Normalize texto e retorne relatório das mudanças com o algoritmo Python original.',
    z.object({text: z.string()})],
  ['detect_human_score', 'Avalie heurísticas de estilo humano. Não é um detector externo de IA.',
    z.object({text: z.string()})],
  ['analyze_swipe_file', 'Classifique TSVs de Reels enviados pelo usuário; não realiza scraping.',
    z.object({tsv: z.string().min(1)})],
];
const handler = createMcpHandler(() => {
  const server = new McpServer({name: 'instagram-agent', version: '1.2.0'});
  for (const [name, description, inputSchema] of TOOLS) {
    server.registerTool(name, {description, inputSchema}, async input => {
      try {
        const output = await invokeTool(name, input);
        return {content: [{type: 'text', text: JSON.stringify(output)}]};
      } catch {
        // Never disclose Python tracebacks, filesystem paths or submitted text.
        return {isError: true, content: [{type: 'text', text: 'Erro na execução ou validação da ferramenta.'}]};
      }
    });
  }
  return server;
});
const nodeHandler = toNodeHandler(handler);

app.get('/health', (_req, res) => res.set('Cache-Control', 'no-store').json({
  service: 'instagram-agent', ready: configured, auth: configured ? 'oidc-required' : 'locked',
}));
app.get('/.well-known/oauth-protected-resource', (_req, res) => {
  if (!configured) return res.status(503).json({error: 'MCP_AUTH_NOT_CONFIGURED'});
  return res.set('Cache-Control', 'no-store').json({
    resource: publicUrl, authorization_servers: [issuer],
    bearer_methods_supported: ['header'], scopes_supported: [scope],
  });
});
app.all('/mcp', async (req, res) => {
  const origin = req.get('origin');
  if (origin && !allowedOrigins.has(origin)) return res.status(403).json({error: 'ORIGIN_NOT_ALLOWED'});
  if (configured && req.get('host')?.split(':')[0] !== new URL(publicUrl).hostname) {
    return res.status(421).json({error: 'HOST_NOT_ALLOWED'});
  }
  const auth = await authenticate(req);
  if (auth.status !== 200) {
    if (configured && auth.status === 401) {
      res.set('WWW-Authenticate', `Bearer resource_metadata="${new URL('/.well-known/oauth-protected-resource', publicUrl).href}"`);
    }
    return res.set('Cache-Control', 'no-store').status(auth.status).json({error: auth.error});
  }
  res.set('Cache-Control', 'no-store');
  return nodeHandler(req, res, req.body);
});
app.use((_req, res) => res.status(404).json({error: 'NOT_FOUND'}));
if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT || 3000);
  const listener = app.listen(port, '0.0.0.0', () => console.info(`Instagram MCP listening on port ${port}; auth=${configured ? 'oidc' : 'locked'}`));
  const shutdown = () => {
    listener.close(async () => {
      try { await handler.close(); } finally { process.exit(0); }
    });
    setTimeout(() => process.exit(1), 8000).unref();
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}
export { app, configured };
