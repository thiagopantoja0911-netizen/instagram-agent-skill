# Instagram Agent MCP — Hostinger Node.js

Servidor **isolado** que roda os seis algoritmos Python originais do Instagram Agent dentro do processo Node.js 22 com Pyodide (WebAssembly), evitando Python como serviço separado ou VPS. Todos os algoritmos originais permanecem no diretório `skills/`; `build.mjs` copia seus bytes para `vendor/` durante a build. Isso preserva a implementação, não é uma reescrita heurística.

## Estado da implantação

- Site reservado: `https://instagram-mcp.secretssystem.online`.
- Host: Hostinger, Node.js 22, aplicativo Express independente.
- Branch de **implantação estável**: `deploy/instagram-hostinger`. Branch de desenvolvimento: `chatgpt-plugin`.
- Build npm e publicação concluídos pela Hostinger; SSL ativo e HTTPS ligado; CDN desligado.
- **A autenticação OAuth ainda não foi configurada. O endpoint `/mcp` permanece bloqueado (503).** Não anunciar o servidor como acessível por clientes ChatGPT.
- Nenhuma configuração do MCP de auditoria de `mcp.secretssystem.online` foi alterada.
- O teste público de `/health` ainda deve ser confirmado externamente após a propagação do DNS; uma build concluída não é prova de health.

## Testes

O GitHub Actions executa `.github/workflows/hostinger-node-parity.yml` em Node.js 22 e Python 3.12:
- `npm install && npm run build && npm test`: comparação das respostas de seis ferramentas via Pyodide contra os seis programas originais Python.
- Verificação de lote de hooks, validação de entradas, limite de payload e recusa de requests não autenticadas/Origem proibida.
- `cmp` compara os scripts originais com os arquivos copiados para o pacote.

Testes de equivalência cobrem as entradas testadas, não demonstram correção universal nem garantem tempo de resposta em carga.

## Configurar a autenticação

Variáveis de ambiente necessárias na Hostinger, **sem inserir segredos no repositório nem neste chat**:

| Nome | Uso |
| --- | --- |
| `INSTAGRAM_MCP_PUBLIC_URL` | `https://instagram-mcp.secretssystem.online/mcp` |
| `INSTAGRAM_MCP_OIDC_ISSUER` | Emissor OAuth/OIDC real |
| `INSTAGRAM_MCP_OIDC_JWKS_URL` | JWKS público HTTPS do emissor |
| `INSTAGRAM_MCP_OIDC_AUDIENCE` | Audiência exata emitida nos access tokens |
| `INSTAGRAM_MCP_ALLOWED_SUBJECTS` | Lista restrita de IDs `sub` autorizados (não e-mails) |
| `INSTAGRAM_MCP_OIDC_SCOPE` | Escopo do token, por padrão `instagram:analyze` |
| `INSTAGRAM_MCP_ALLOWED_ORIGINS` | Origens confiáveis; padrão `https://chatgpt.com` |

O código valida assinatura RS256/ES256, `iss`, `aud`, prazo de validade pelo SDK JWT, `sub` permitido e escopo. Sem configuração completa, rejeita clientes. A aplicação fornece `/.well-known/oauth-protected-resource` quando habilitada; a interface de consentimento, o issuer e a autorização de cliente MCP precisam ser fornecidos por um provedor real.

**Atenção ao Supabase OAuth 2.1:** alterar `Site URL` em um projeto Supabase compartilhado pode quebrar fluxos de login existentes. Antes de usar um projeto, revisar o uso do Auth e o local da página de consentimento. Não habilitar dinâmica de clientes, redefinir URLs nem modificar chaves de assinatura em um projeto compartilhado sem avaliação específica.

## Fluxo de atualização

1. Desenvolver e validar na branch `chatgpt-plugin`.
2. Executar testes de equivalência e segurança no GitHub Actions.
3. Revisar diferenças. Só então avançar o commit validado para `deploy/instagram-hostinger`.
4. O GitHub/Hostinger atualiza somente o subdomínio dedicado.
5. Confirmar `/health`, requisição anônima bloqueada e ferramentas autorizadas pelo ChatGPT após OAuth.

O plano atual da Hostinger tem limites de processamento e execução por request; medir uso de memória WebAssembly e latência depois de habilitar acesso. Não há login no Instagram, scraping nem publicação automática.
