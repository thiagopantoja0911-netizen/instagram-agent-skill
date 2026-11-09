# Implantação segura — Instagram Agent MCP

**Estado atual:** o código do servidor remoto e os testes existem. Não há endpoint hospedado nem OAuth configurado. O plugin privado pode ser usado para skills, mas suas ferramentas MCP continuam desconectadas até um endpoint protegido ser implantado e vinculado.

## Arquitetura

ChatGPT (cliente MCP) -> HTTPS /mcp -> AuthSettings OAuth 2.1 -> RFC 7662 introspecção -> seis ferramentas Python originais.

O arquivo `server/remote_app.py` é um recurso MCP autenticado, **não** um provedor de login. Antes da implantação, configurar um provedor OAuth 2.1 externo que ofereça fluxo de autorização ao cliente MCP e RFC 7662 introspecção para este servidor. Deve emitir tokens com audiência igual à URL /mcp, escopo apropriado, client_id, iss e exp. Nenhum token deve ser colocado no GitHub.

## Variáveis obrigatórias (todas são segredos/configuração do host, não do Git)

| Variável | Significado |
| --- | --- |
| `MCP_PUBLIC_RESOURCE_URL` | `https://SEU-DOMINIO/mcp`, URL exata de acesso |
| `MCP_OAUTH_ISSUER_URL` | issuer HTTPS do provedor OAuth |
| `MCP_OAUTH_INTROSPECTION_URL` | endpoint HTTPS RFC 7662 |
| `MCP_OAUTH_CLIENT_ID` | ID autorizado a introspectar tokens |
| `MCP_OAUTH_CLIENT_SECRET` | segredo de introspecção — armazenar exclusivamente no cofre do host |
| `MCP_ALLOWED_ORIGINS` | origens HTTPS explicitamente permitidas, separadas por vírgula |
| `MCP_REQUIRED_SCOPE` | escopo exigido (padrão `instagram:analyze`) |

A implementação exige que o provedor retorne `active=true`, `iss` correto, `aud` correspondente à URL pública, `exp` no futuro, `client_id` e `scope` autorizado. Falhas de rede ou verificação rejeitam o token.

## Execução local

```bash
python3 -m pip install -r server/requirements.txt
python3 tests/smoke.py
python3 tests/mcp_integration.py
python3 tests/remote_security.py
```

Para o desenvolvimento com cliente MCP local, usar:
```bash
python3 server/instagram_agent_mcp.py
```
Esse modo é `stdio` e não depende de autenticação HTTP (limite de segurança é o próprio processo).

## Hospedagem por contêiner (quando houver OAuth e domínio)

```bash
docker build -f server/Dockerfile -t instagram-agent-mcp .
```

O contêiner escuta na porta 8000 **somente após** todas as variáveis de segurança serem fornecidas. Implantar em uma plataforma de contêineres com HTTPS e secret manager. O domínio público deve coincidir com a URL MCP configurada. É obrigatório proteger logs e segredos, validar CORS/Origin e configurar limites de requisição.

Usar `docker run --env-file ...` apenas com arquivo de ambiente local protegido e nunca anexado ao Git, nem incluir segredos no comando colado em conversas.

## Conexão com ChatGPT

1. Confirmar o login e autorização OAuth 2.1 com a conta que utilizará o plugin.
2. Verificar `401` em chamada sem token e `200` somente com token válido e escopo correto.
3. Executar `tools/list` e chamadas reais às seis ferramentas com autorização.
4. Incluir a configuração MCP no plugin **somente depois** de o endpoint existir e ser verificado.
5. Realizar uma nova release privada; validar chamada de ferramenta em uma conversa do ChatGPT, não só no CI.

## Vercel

A conta Vercel está disponível, mas os projetos atuais não estão associados ao Instagram Agent. Não alteramos ou publicamos neles. A Vercel oferece suporte a MCP, mas funções serverless e aplicação ASGI exigem configuração de roteamento, autenticação e testes de compatibilidade. O contêiner é o artefato de implantação portátil preparado primeiro; escolher o host depois de verificar a infraestrutura OAuth.

## Segurança operacional

Não expor uma versão sem OAuth, não usar tokens estáticos de demonstração, não registrar tokens ou textos privados em logs, e não conectar uma conta Instagram automaticamente. O serviço só processa conteúdo fornecido pelo cliente autorizado. Não faz publicações nem scraping.
