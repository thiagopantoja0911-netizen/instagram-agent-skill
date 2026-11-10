---
name: ig-motion-quality-gate
description: "Use para revisar scripts e MP4s de Reels motion com critérios de Instagram e de produção audiovisual, medindo regressões, sincronismo, áudio e correspondência com a finalidade do vídeo antes de declarar aprovação."
---

# Aulas Instagram Motion Studio — auditor de qualidade

## Premissa

`completed:100%` significa que um renderizador entregou um arquivo — não que ele ficou bom. Separar QA técnico, QA artístico, QA estratégico e aprovação do usuário.

1. Confirmar arquivo, duração, aspecto, áudio e integridade via FFprobe/FFmpeg quando disponíveis.
2. Inspecionar frames em 0s, primeiro segundo, pontos de transformação e limites de cada beat. Comparar no celular (360px) e tamanho integral com as referências relevantes.
3. Avaliar se o roteiro do Instagram Agent tem payoff visual **real**, gancho no primeiro frame e CTA compatível com `intent` — sem contar views inventadas.
4. Verificar se transições foram feitas pelo movimento do objeto, câmera e continuidade, ou se apenas substituem textos numa moldura. Identificar estados antes/depois de interações, microeventos e materialidade dos assets.
5. Com alinhamento real da voz, medir ≥8 marcos de palavra-ação (quando houver voz e eventos suficientes) e registrar offset em milissegundos; se não houver acesso ao áudio/ASR ou ao MP4, reportar `não verificado`.
6. Medir LUFS e true peak, clipping, pausas e leito musical/sfx até o encerramento; não confundir volume com qualidade de locução.
7. Comparar com a versão *aprovada* do mesmo tipo de vídeo, além das referências externas. Se piorou, **não substituir baseline**. Não declarar nota 10/10 automaticamente.
8. Registrar no cérebro técnico: objetivo, ambiente, vídeo/ID, storyboard, frames, resultados verificados, hipóteses, erros, correções, avaliação do usuário, próximo experimento. Atualizar Notion/Drive somente após ação real de gravação, com links verificados.

## Bloqueios prioritários

- Elemento textual principal em área coberta por interface Instagram; tela em branco no primeiro frame.
- O mesmo cartão aparece em mais de 50% sem mudança de foco/ação em vídeos de exibição de motion.
- 'Transformação' sem ligação causal; objetos de placeholder genéricos substituem a promessa visual.
- Narrador descreve uma ação que aparece >200ms depois da palavra-chave sem intenção narrativa demonstrável.
- Música/som terminam antes do CTA sem motivação; mídia sem trilha válida; quadros ilegíveis.

Consultar `references/intent-quality-rubric.md` e `skills/reference-video-decomposer` para analisar referências. Para métricas Instagram, aplicar `skills/ig-audit` apenas sobre insights reais.

## Resultado

Tabela curta `critérios / evidência / passou? / correção`, seguida da decisão **candidato**, **reprovado** ou **aprovado pelo usuário**. Qualidade criativa continua dependente de revisão humana; não prometer melhora monotônica automática.
