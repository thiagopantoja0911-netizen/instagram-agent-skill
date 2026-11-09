# Compatibilidade ChatGPT / Codex

Este pacote contém integralmente as 13 habilidades, os 6 scripts Python originais, os arquivos JSON, os templates e a licença MIT presentes no projeto de origem. A branch main não é modificada.

## Execução

- Use as instruções de cada `skills/ig-*/SKILL.md` para planejar e redigir.
- Comandos `/ig-*` são atalhos da plataforma Claude; no ChatGPT, acione a habilidade pelo nome, automaticamente ou por menção.
- Um plugin baseado somente em skills **não garante execução** de `python3`. Se não houver Python real ou MCP conectado, não invente valores de hookscore, beats, caption, humanize, detect ou swipe.
- Os seis scripts continuam nas mesmas pastas. Consulte `server/README.md` para preparar um MCP de execução autenticado. Até configurar e conectar o servidor, trate qualquer análise sem execução como qualitativa.
- Nunca invente números, resultados de clientes ou tendências. Nunca publique no Instagram nem envie DMs por conta própria. Respeite a aprovação do usuário.

## Persistência

Caminhos como `~/.claude/instagram/voice.md`, `plan.md`, `log.md` e `swipe.md` não estão automaticamente disponíveis no ChatGPT. Utilize arquivos fornecidos ou conectores autorizados; não afirme que dados foram salvos sem comprovação. Não há armazenamento multiusuário instalado nesta versão. Use `templates/voice.md` para configurar a identidade.

## Condições para equivalência funcional completa

Conectar um MCP remoto HTTPS autenticado para executar os seis scripts; implementar armazenamento por usuário e fluxo de consentimento; criar renderizador real para os carrosséis; testar ponta a ponta nas interfaces desejadas. O plugin pode ser instalado antes disso, mas não deve ser anunciado como funcionalmente idêntico em todos os ambientes.

## Créditos

Autor original: Jake Schincariol; origem https://github.com/Jakeschincariol/instagram-agent-skill; licença MIT preservada em LICENSE.
