# Portabilidade para o ChatGPT

Esta branch contém um manifesto portátil de plugin em `plugin.json` e uma skill adicional de onboarding `ig-setup`.

**Preservação:** todos os 13 `SKILL.md` originais, os seis `.py`, os três `.json` de regras, `templates/voice.md` e a licença MIT continuam presentes, assim como o marketplace Claude. Nenhuma alteração foi feita na branch `main`.

**Execução dos 6 algoritmos:** `server/instagram_agent_mcp.py` disponibiliza seis ferramentas MCP sem reescrever a lógica. Só funcionam depois de instalar a dependência Python e executar/conectar o servidor. O manifesto não declara um endpoint remoto inexistente.

**Limites desta versão:** não há autenticação remota, nem armazenamento persistente por usuário, nem renderizador de carrosséis implantado. No ChatGPT baseado apenas em skills, a geração de texto pode funcionar mas scores não devem ser inventados.

**Instalação:** o CI empacota um ZIP com `plugin.json` na raiz, as skills e todos os arquivos originais. Esse arquivo pode ser submetido no Plugin Creator ou importado segundo permissões da conta; instalar o ZIP não é equivalente a conectar automaticamente o MCP.

**Créditos:** fork do projeto de Jake Schincariol, https://github.com/Jakeschincariol/instagram-agent-skill, sob licença MIT.
