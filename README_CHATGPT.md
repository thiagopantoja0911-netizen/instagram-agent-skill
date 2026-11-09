# Portabilidade para o ChatGPT

Esta branch contém um manifesto portátil de plugin em `plugin.json` e uma skill adicional de onboarding `ig-setup`.

**Preservação:** todos os 13 `SKILL.md` originais, os seis `.py`, os três `.json` de regras, `templates/voice.md` e a licença MIT continuam presentes, assim como o marketplace Claude. Nenhuma alteração foi feita na branch `main`.

**Execução dos 6 algoritmos:** `server/instagram_agent_mcp.py` disponibiliza seis ferramentas MCP sem reescrever a lógica. Só funcionam depois de instalar a dependência Python e executar/conectar o servidor. O manifesto não declara um endpoint remoto inexistente.

**Limites desta versão:** não há autenticação remota, nem armazenamento persistente por usuário, nem renderizador de carrosséis implantado. No ChatGPT baseado apenas em skills, a geração de texto pode funcionar mas scores não devem ser inventados.

**Instalação:** o CI empacota um ZIP com `plugin.json` na raiz, as skills e todos os arquivos originais. Esse arquivo pode ser submetido no Plugin Creator ou importado segundo permissões da conta; instalar o ZIP não é equivalente a conectar automaticamente o MCP.

**Créditos:** fork do projeto de Jake Schincariol, https://github.com/Jakeschincariol/instagram-agent-skill, sob licença MIT.

## Evolução MCP e implantação

A integração de protocolo foi testada usando `tests/mcp_integration.py` e o cliente oficial MCP v2. Todas as seis ferramentas respondem pelo protocolo; `tests/smoke.py` também cobre os executáveis Python originais.

`server/remote_app.py` fornece entrada ASGI com autenticação OAuth 2.1 obrigatória e verificação de tokens por introspecção RFC 7662; `tests/remote_security.py` testa bloqueio por falta de configuração, rejeição anônima e regras de token. O contêiner em `server/Dockerfile` permite implantar em provedor compatível.

**Importante:** o OAuth remoto ainda depende de um emissor configurado e de um domínio real. Não existe endpoint publicado ou vinculado ao ChatGPT neste momento. Consulte `server/DEPLOYMENT.md` antes de hospedar, e jamais exponha uma versão sem autenticação.
