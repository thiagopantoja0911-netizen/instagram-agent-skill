---
name: ig-motion-director
description: "Use quando o usuário quiser unir estratégia Instagram e produção motion: criar Reel, gancho, roteiro, beat sheet, storyboard, narração feminina, direção artística e plano de renderização adequado ao objetivo."
---

# Aulas Instagram Motion Studio — direção integrada

## Função

Orquestra o **Instagram Agent** (13 skills originais mais o onboarding `ig-setup` de estratégia/roteiros/engajamento) e **Aulas Motion Reference** (13 referências de vídeos, análise de frames, primitivas HyperFrames e reprovações V8/V9). As habilidades e scripts originais do Instagram Agent estão agora presentes neste pacote, ao lado do corpus Aulas Motion. Os plugins anteriores permanecem intactos como backups. Este plugin NÃO executa login, coleta Instagram nem cria uma conexão MCP por simplesmente referenciar o plugin de origem.

Antes de escrever, identificar **intenção**, audiência, linguagem do nicho, ação final, plataforma e formato; se não houver dados de perfil, não alegar performance pessoal. Exemplo persistido do projeto Aulas: Reels que demonstram motion com IA, voz feminina PT-BR e **venda indireta** com convite sutil aos bastidores/link da bio. Atualizar esses defaults conforme o pedido, nunca forçar CTA comercial em vídeo de outro intuito.

## Sequência obrigatória

1. **Estratégia Instagram** — aplicar o raciocínio de `skills/ig-reel` (3 ganchos diferentes; linha falada separada da linha de tela; hook no primeiro frame; corpo com payoff; loop possível). Ler `ig-human` para naturalizar texto antes da aprovação. Para performance real, invocar `ig-audit` e/ou `ig-viral` apenas com dados reais, sem inventar métricas ou scores; se `hookscore.py`, `beats.py`, `detect.py` não estiverem executáveis, dizer 'avaliação editorial' em vez de número calculado.
2. **Contrato criativo** — criar `CreativeBrief`: `intent`, `audience`, `format`, `duration`, `style_ref_ids`, `emotional_effect`, `value_proposition`, `indirect_cta`, `restrictions`, `success_criteria`. Usar `references/intent-quality-rubric.md` para selecionar um critério específico ao objetivo.
3. **Plano de cenas** — decompor a narrativa em beats temporizados com ação física observável, valor ao espectador e relação com a fala. Para cada beat: `time_start`, `time_end`, `spoken`, `onscreen`, `visual_world`, `state_before`, `interaction`, `state_after`, `transition_cause`, `camera`, `lighting`, `asset`, `sfx_cue`, `word_anchor`.
4. **Direção visual** — aplicar `skills/reference-video-decomposer`; consultar as referências `video-corpus.md`, `2026-11-three-reference-analysis.md`, `microinteractions-audio.md`, `v8-output-qa-2026-11-10.md` e `v9-output-qa-2026-11-10.md`. Nunca transformar '5 mundos' em 5 conteúdos trocados dentro de um painel estático.
5. **Mídia real antes do código** — storyboard e assets hero que materializam o que a voz promete. Por exemplo: objeto com material, sombra, parallax, câmeras e continuidade; não substituir prova visual com ícones genéricos ou texto que descreve movimento.
6. **Som primeiro** — gerar/obter locução definitiva, transcrever em palavras temporizadas e alinhar os eventos visuais à fala; microsons somente se formato reproduzível for verificado. Não declarar sincronismo aprovado apenas pela programação da timeline.
7. **Gate de aprovação** — começar por 3 segundos ou uma única transformação convincente. Não enviar 4 vídeos antes da aprovação do primeiro. Aplicar `ig-motion-quality-gate` à saída renderizada.
8. **Publicação** — gerar roteiro, assets e MP4 para revisão; Instagram Agent não publica automaticamente nem deve pedir senha. Publicar/enviar DMs apenas com ferramenta conectada e autorização específica.

## Mapa das 13 habilidades originais e onboarding do Instagram Agent

- `ig-reel`: ganchos, script, roteiro visual, beats; `ig-human`: naturalidade da voz e texto.
- `ig-caption`: legenda e hashtags; `ig-carousel`: carrosséis; `ig-story`: Stories; `ig-repurpose`: recortes e reaproveitamento.
- `ig-plan`: planejamento semanal; `ig-viral`: pesquisa de padrões em reels reais; `ig-audit`: avaliar métricas de posts reais.
- `ig-profile`: perfil e bio; `ig-comment`: comentários; `ig-reply`: respostas; `ig-dm`: DMs; `ig-setup`: perfil editorial.

Ao usar uma dessas capacidades, ler a skill homônima da pasta `skills/ig-*` deste próprio pacote; **não afirmar execução dos scripts Python** até obter resultado de executor real. `ig-viral` não autoriza scraping em massa ou login automatizado.

## Gates específicos contra regressão

- Reprovar Reel de demonstração de motion se o mesmo quadro/cartão dominar mais de metade do tempo sem mudança física/câmera/cenário.
- Não aceitar 'virar produto' se só for fade para uma caixa CSS. Exigir continuidade tangível: mesma forma/cor/movimento atravessa o corte.
- Medir atraso de palavras-ação hero em milissegundos no MP4 final, não por timeline presumida. Meta inicial ≤100 ms quando viável.
- Mixagem consistente entre versões, sem último segundo silencioso não intencional.
- Distinguir status: `roteiro`, `storyboard`, `teste renderizado`, `QA passou`, `usuário aprovou`, `publicado`.
- Não considerar melhoria garantida; comparar com baseline do **mesmo tipo e objetivo** e registrar regressões/feedback do usuário.

## Saída preferida

Entregar um resumo do CreativeBrief, **3 ganchos (avaliação editorial sem scores fictícios)**, roteiro de fala e texto de tela com tempo, storyboard com ação visual e interação real, lista de assets, plano de áudio e QA planejado. Quando houver MP4, incluir relatório com observações verificadas e o que não foi analisado.
