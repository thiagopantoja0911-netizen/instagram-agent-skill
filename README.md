# Aulas Instagram Motion Studio v0.2.0 — pacote unificado

Este plugin combina **integralmente** os arquivos-fonte do Instagram Agent v1.2.0 (13 habilidades originais, `ig-setup`, seis scripts Python, três arquivos JSON de regras e o template de voz) com a biblioteca **Aulas Motion Reference v0.3.7** (13 referências), mais `ig-motion-director` e `ig-motion-quality-gate`.

## Fluxo
Intenção do conteúdo → 3 ganchos → pontuação real (quando scripts executados) → roteiro falado → storyboard com ação física → assets e timecodes da voz → renderização via Videos Secrets conectado → auditoria de MP4 → aprovação humana → documentação.

## O que funciona
Os scripts Python são os mesmos da fonte Instagram Agent e podem ser executados em um ambiente Python autorizado. As 17 skills são portáveis. O corpus preserva observações e falhas V8/V9.3. Não há necessidade de instalar os plugins antigos para **ler e usar o pacote de skills e scripts**.

## O que NÃO está ativado
Não existe aqui um `mcp.json` remoto autorizado: o MCP Hostinger do Instagram Agent necessita OAuth/OIDC antes de funcionar no ChatGPT. A simples inclusão dos seis scripts no ZIP não os torna ferramentas MCP executáveis automaticamente no ChatGPT. Não existe login em Instagram, insights de conta, agendamento ou publicação automática. O Connector 2 para renderização é uma integração separada; não está embutido neste plugin.

## Validação
`python3 tests/studio_integracao.py` confere a integridade dos 17 fluxos, scripts, JSON e referências. `python3 tests/smoke.py` executa as verificações originais. A versão gerada por GitHub Actions somente deve ser publicada no Plugin Creator após esses testes.

## Licença e origem
O Instagram Agent original pertence a Jake Schincariol, fornecido sob **MIT**; `LICENSE` foi mantido, com os créditos e os arquivos originais. Aulas Motion Reference: Aulas. Plugins originais permanecem instalados até a aprovação da migração.
