# Instagram Agent MCP

O backend fornece seis ferramentas MCP que chamam os seis arquivos Python **originais** com `--json`. Um exit code 1 de um linter significa avaliação baixa, não falha de execução, por isso o JSON ainda é retornado.

```bash
python3 -m pip install -r server/requirements.txt
python3 server/instagram_agent_mcp.py
```

A execução acima usa MCP stdio (local). Para desenvolvimento HTTP **apenas em loopback**:

```bash
INSTAGRAM_AGENT_TRANSPORT=streamable-http python3 server/instagram_agent_mcp.py
```

O transporte HTTP requer conexão por cliente MCP com `http://127.0.0.1:8000/mcp` e não funciona automaticamente no ChatGPT web ou mobile. **Não há serviço remoto hospedado.**

Antes de criar `mcp.json` de produção, implantar o serviço protegido com HTTPS, autenticação/identidade, isolamento de dados, limites de requisições, configuração de hosts/Origens e testes. Não publicar tokens, dados de conta ou endpoints fictícios. Nenhum dado do usuário é armazenado aqui; não há autorização para publicações nem scraping.

Skills ficam utilizáveis para redação mesmo sem o backend, mas não podem alegar pontuações calculadas sem execução real.

## Servidor remoto protegido

O código da camada de hospedagem está em `server/remote_app.py`. Ele usa OAuth 2.1 com introspecção e falha na inicialização quando a configuração não está presente. Para o guia de configuração do domínio, provedor de identidade, HTTPS e Docker, leia `server/DEPLOYMENT.md`. O Dockerfile foi adicionado à branch `chatgpt-plugin`.

Execute os testes:
```bash
python3 tests/mcp_integration.py
python3 tests/remote_security.py
```

Nenhuma infraestrutura pública foi implantada automaticamente. Não conecte o plugin a uma URL que não passou pela validação HTTPS/OAuth.
