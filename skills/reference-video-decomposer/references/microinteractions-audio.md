# Aulas motion: microinterações e coreografia sonora — v0.3

**Status:** sistema proposto de implementação inspirado nas observações em `2026-11-three-reference-analysis.md`. Os números abaixo são **parâmetros de partida**, não medições exatas de um criador ou prova de causalidade entre áudio e imagem.

## O que mudou em relação a slides animados

- **ANTES**: um título gigante e um background por 2–4 s; o projeto narra a sua própria transição e muda de slide.
- **AGORA**: a câmera se move dentro do mesmo mundo, cada elemento reage independentemente, há uma função visual para o objeto (interface, produto, mapa, relógio, barra, chip, dado), e a informação muda com o movimento.
- Um vídeo não será considerado motion premium só porque contém zoom, blur, glow e 12 cuts. Exigir estado funcional, profundidade, hierarquia, ritmo de repouso e áudio causal.

## Novas primitivas do corpus

### `stateful-ui-widget`

Um mesmo widget possui estado inicial, ação, valor atualizado e repouso: cartão encaixa, botão responde, número incrementa, barra carrega e sombra se ajusta. Cada subparte tem sua trilha de animação; o widget não deve entrar como uma única imagem estática. Campos: `state0`, `trigger`, `value0`, `value1`, `entryFrames`, `overshoot`, `settleFrames`, `subparts`, `soundCue`.

### `voice-anchored-kinetic`

Texto reage a **tempos reais de locução**, não a partes arbitrárias de uma linha do tempo. Marcar `speech_start`, `word_or_phrase_anchor`, `stress`, `pause_start`, `speech_end`; gerar quadro do primeiro impacto no próprio marco de ênfase, com o som (quando houver) 0–2 quadros depois. Evitar letreiro integral enquanto a narradora ainda descreve outra coisa.

### `motif-match-cut`

A forma ou trajetória de um elemento no plano A torna-se o objeto do plano B (quadrado → card, pill → barra, linha → rota, halo → visor, cursor → seleção). O movimento atravessa o corte em vez de reiniciar do zero. Campos: `sourceBox`, `targetBox`, `anchor`, `velocity`, `transform`, `occlusion`, `frameOverlap`.

### `micro-sfx-cue-track`

Trilha discreta de efeitos pequenos ligados a um gesto verificável: `tick` para seleção, `tap` para clique, `swish` para deslocamento, `impact` para chegada de objeto, `rise` para pré-revelação, `soft_resolve` para repouso. Preservar a locução inteligível. Não confundir transientes do áudio de referência com identificação confirmada de um efeito; marcações extraídas por RMS são apenas candidatos.

## Envelope temporal proposto (30 fps / 60 fps)

| Ação | Janela de partida | Animação proposta | Som proposto |
|---|---:|---|---|
| Toque em botão | 0.10–0.22 s | 1–2 px de compressão / 1–2 quadros de overshoot | `tap` no contato |
| Cartão se encaixa | 0.22–0.55 s | XY + escala + rotação + sombra, com repouso | `swish` no movimento, `tick` ao assentamento |
| Barra de valor | 0.5–1.3 s | preenchimento real + contador, valor legível ao fim | microtiques somente nos marcos relevantes |
| Alteração de calendário | 0.12–0.35 s por item | escala + preenchimento/cor + stagger | 1–3 ticks; não sonorizar todo dia |
| Product hero | 0.65–1.3 s | paralaxe, rotação 3D, halo e brilho discretos | riser → impacto leve na revelação |
| Match-cut geométrico | 0.15–0.45 s | mesma forma e direção até trocar o contexto | um whoosh no mesmo movimento |
| CTA indireta | 1.5–2.5 s | reduzir densidade, detalhe de hover/seta, sem gritaria | cauda curta/resolução |

Densidade sugerida: 3–7 eventos animados discretos por segundo nas sequências de demonstração; pausas intencionais para leitura nos momentos de significado. **Não** criar animação incessante sem propósito.

## Regras de áudio e sincronização

1. Criar primeiro o texto de locução e gerar/gravar o **áudio definitivo**. Não montar cenas por durações uniformes antes de saber a fala.
2. Produzir alinhamento de frases ou palavras com tempos reais. Quando não houver transcrição cronometrada, marcar manualmente os inícios de fala, silêncios e ênfases; registrar a incerteza em segundos.
3. Criar ledger `t_audio | palavra/ação | frame_visual | pico_sound | delay | confiança` e efetivamente seguir os tempos; para 30 fps, um quadro ~33,3 ms. Não inventar precisão de palavra quando só há um corte a 8 fps.
4. Efeitos sonoros **locais** em `assets/audio` (licenciados/produzidos para o projeto), no formato e duração corretos; evitar URL de áudio temporária dentro de HTML final. Arquivos externos de referência não podem ser redistribuídos por padrão.
5. Abrir cada classe de som numa trilha separada com `id`, `data-start`, `data-duration` e volume. Efeitos sustentados devem terminar com fade, não cortar abruptamente.
6. Priorizar clareza da narração; ducking da cama sob a voz se houver música e evitar sfx em cada sílaba. Não mascarar consoantes com clicks.
7. Verificar áudio renderizado com medição integrada, pico e inspeção de 10 pares de marcos som–quadro. **Referências medidas não são alvo de loudness automaticamente.**

## Novo controle de qualidade obrigatório

- [ ] Há pelo menos 3 tipos de informação visual funcionais, não só texto em cartões.
- [ ] A mesma cena mostra estado antes/durante/depois da interação.
- [ ] Há entrada, pico, overshoot, settle e saída onde o movimento exige.
- [ ] 90% da tipografia principal é legível na área segura de Reels.
- [ ] Microações estão ancoradas na locução e em sons com timestamps conhecidos.
- [ ] Pelo menos 8 eventos som/quadro conferidos após o render, com erro anotado em milissegundos.
- [ ] MP4 final verificado (imagem, narração, sfx e clipping) antes de prometer qualidade.
- [ ] Comparação em timestamps idênticos com a referência (foco em trajetória e sequência, não cópia de marca).

## Princípio editorial para vender indiretamente

O vídeo entrega uma pequena demonstração real. A pessoa **vê** a capacidade em ação, compreende possibilidades (Reels, interface, produto, microanimação, aulas, marcas) e encontra apenas um convite leve para conhecer os bastidores na bio. Não abrir com promoção, preço ou promessa absoluta.
