# Três referências adicionais — 10 de novembro de 2026

**Origem:** três MP4 enviados nesta conversa pelo usuário. Todos permanecem externos ao plugin. Os intervalos abaixo são aproximadamente delimitados pela amostragem a 1–2 quadros/s e por mudanças medidas a 8 quadros/s. Eventos marcados em microatlas foram inspecionados a até 30–60 quadros/s ao redor do ponto de mudança. Nenhuma anotação constitui identificação de músicas. Os picos de RMS são **candidatos a eventos**, não classificação auditiva garantida.

## Referência R11 — conceito de campanha Nubank / Nuke Criativo

- 10,542 s; vertical 1080×1920, 30 fps, HEVC; AAC estéreo 44,1 kHz; medição integrada aproximada **-15,7 LUFS**.
- **Observado:** fundo lilás claro com marca quadrada `nu` no centro, passagem para roxo escuro; cartão de interface branco/roxo gira e escala; UI de conta com `Olá, Rafael`, Pix, Pagar, Caixinhas, Transferir; o conteúdo de `Caixinha Nubank` vai para uma área branca; múltiplos cartões roxos e botões de investimento; frase em pill rosa; logotipo `nu` sobre branco; encerramento com assinatura `NUKE Criativo`.
- **Planos aproximados:** 0,0–0,6 marca/abertura minimalista; 0,6–1,6 cartão cresce e roda; 1,6–2,25 UI amplia e vira transição circular; 2,25–3,2 título de produto em branco; 3,2–5,8 grade de investimentos com pan/punch-in; 5,8–6,9 pill de promessa/zoom; 6,9–7,6 marca sobre branco; 7,6–10,54 assinatura do criador e dissipação.
- **Microestudo:** na vizinhança de **0,750 s**, objeto vai de cartão pequeno a telefone ampliado com inclinação, brilho de borda e retorno a eixo; entre **1,525 e 1,825 s**, o telefone preenche a imagem até deixar o detalhamento interno da UI legível; **2,125–2,325 s**, o radial branco absorve o aplicativo; **3,250 s** ocorre grande troca entre áreas claras e roxas.
- **Sistema extraído:** `neon-product` + `screen-punch-in` + `motif-match-cut` + `pill-cta` + `brand-end-card`. Não reproduzir o logo Nubank ou UI verdadeira em um vídeo nosso sem motivo e autorização; escolher produto/interação neutralizada.
- **Bounding boxes estimadas:** telefone vertical no momento 0,95–1,4 s ocupa cerca de x=0,28–0,80 e y=0,20–0,84 da tela; os cartões de categorias em 4–5 s ocupam conjunto x≈0–1 e faixa y≈0,32–0,82. **Estimativas do atlas**, não geometria recuperada do projeto-fonte.
- **Eventos de mudança de imagem (8 fps):** ≈0,75; 1,625; 2,125; 3,25; 4,25; 4,875; 5,125; 5,375; 6,875 s. Mudanças e rastros de desfocagem são observáveis; easing exato não é recuperável.
- **Eventos sonoros candidatos:** 0,04; 1,58; 2,08; 2,28; 3,16; 3,84; 4,44; 4,96; 5,28; 6,62; 7,74; 7,86 s. Eventos de energia medidos, não identificação específica de impactos/clicks.
- **Risco de fidelidade:** logo, telefone, UI financeira, imagens de produto, blur/bloom de vídeo e voz/música originais não foram isolados em assets editáveis.

## Referência R12 — widget animation / ASMR

- 16,810 s; vertical 1080×1920, 60 fps, HEVC; AAC estéreo 44,1 kHz; loudness integrado aproximado **-17,0 LUFS**.
- **Observado:** fundo branco-cinza com leve vinheta; células de cartões redondos pretos/brancos surgem em mosaico; calendário de `Daily Activity` em preto, pontos verdes e vermelhos, seleção de datas; widget branco de bateria laranja aumenta a porcentagem; relógio analógico animado; cartão automotivo Mercedes-Benz preto/verde com progresso 0–100% e carro; cartão de mapa, trajeto e indicadores; cartões de próxima viagem e chamada `Mom`; reagrupamento para mosaico completo; corte para cartão preto com monograma branco.
- **Planos aproximados:** 0–1,5 encaixe do mosaico; 1,5–3 calendário; 3–4,5 bateria; 4,5–6,5 relógio e %; 6,5–8,8 carregamento automotivo; 8,8–10,7 mapa e rota; 10,7–13,2 chamada, próximo voo e reflow; 13,2–15,6 afastamento mostrando grade; 15,6–16,81 marca sobre preto.
- **Microestudo:** **0,175–0,575 s** seis componentes mudam posição/tamanho em sequência e criam o gradeado; **1,40–1,70 s** os pontos do calendário aparecem no mesmo painel, escalonados e antes da leitura completa; **2,80–3,20 s** o cartão de bateria se revela por deslocamento lateral; **4,15–4,45 s** a porcentagem da bateria muda de ~55% para 57%, barras correspondentes reagem; **7,525–7,825 s** barra verde do carro cresce enquanto o carro entra; **10,525–10,825 s** cartão de chamada desliza ocupando um espaço anteriormente preto.
- **Sistema extraído:** `stateful-ui-widget` **(nova primitiva)**, `ui-orbit`, `soft-card`, `dark-card`, `screen-punch-in` e `motif-match-cut`. A essência é **mudança de estado dentro da mesma cena**, não troca de slides.
- **Elementos medidos visualmente (aproximação):** raio de cantos de cartões de 3%–8% da menor dimensão do painel; contraste preto/branco grande; verde limão em células/indicador, laranja em barras; preenchimento de barra em torno do y=0,5–0,7 em alguns planos. Marcas, nomes de voo, localização e car silhouette são específicas e não devem ser copiadas automaticamente.
- **Eventos visuais candidatos (8 fps):** 0,375; 1,5; 3,0; 4,25; 5,875; 7,625; 8,875; 10,625; 10,875; 11,625; 13,125; 15,625 s.
- **Eventos sonoros candidatos:** 0,02; 0,2; 0,34; 0,46; 2,82; 4,42; 5,02; 6,18; 6,32; 6,44; 6,6; 9,02; 10,6; 10,74; 11,66; 14,26; 15,58 s. Alguns candidatos alinham visualmente aos rearranjos; tipo exato de som não foi classificado.
- **Risco de fidelidade:** sem source files dos widgets, fontes específicas, imagem original do carro e efeitos sonoros separados; sombra fina e realismo visual exigem validação quadro a quadro.

## Referência R13 — edição de campanha Reload e bastidores

- 71,749 s; vertical 576×1024, 30 fps, H.264; AAC estéreo 44,1 kHz; loudness integrado aproximado **-21,8 LUFS**.
- **Observado:** começa em uma demonstração/estudo de caso com letras grandes pretas e verdes, preço mostrado de `R$1.200`, selos e produto preto Reload; fundo esbranquiçado e trilha sinuosa verde; três miniaturas de filmes e indicador `REC`; footage real de mesa com post-its/teclado; After Effects com timeline; workstation de edição; comparação com clipes de ação e texto `12 dias, de pura edição e animações`; uma peça branca/lilás-roxo com mensagens, frasco do produto, diagrama circular, números/depoimentos e final com URL e logotipo.
- **Planos aproximados:** 0–4 narrativa de projeto/produto; 4–8 comparação de três edições e REC; 8–12 bastidores práticos com notas; 12–19 interface do After Effects; 19–26 timeline de edição no monitor; 26–29 clipes de exemplo e texto de 12 dias; 29–32 timeline; 32–39 peça final: tipografia, ícones e gráfico; 39–48 product hero e promessa; 48–55 círculo de aplicações e gráficos; 55–63 testemunhos/ícones em cards; 63–68 ícones Foco / disposição e CTA; 68–71,75 link e logo final.
- **Microestudo:** **0,55–0,95 s**, `R$1.200` se estabiliza após blur/inclinação e o objeto flutua em camada superior; **3,15–3,45 s** trilha verde se articula ao redor do frasco; **8,17–8,57 s** salto entre ícone de áudio e vídeo real dos post-its; **11,78–12,08 s** filmagem é reduzida a miniatura/recorte enquanto fundo branco e signo `Ae` assumem a imagem; **31,9–32,2 s** há mudança quase total entre footage e gráfica branca.
- **Sistema extraído:** `kinetic-copy`, `parallax-collage`, `screen-punch-in`, `neon-product` (tratamento colorido do produto), `beat-cut-sequence`, `voice-anchored-kinetic` e camadas de **prova do processo** (rascunho → software → resultado).
- **Elementos estimados:** início com título à esquerda em x≈0,1–0,8; frasco Reload hero em x≈0,60–0,95 no trecho 3–4s; miniaturas 4–5s em fileira central, com cantos redondos; Ae e timeline 12–19s são screenshots reais; pacote final roxo em fundo branco de alta margem em 32–71s. Sem fonte exata/valores RGB fornecidos.
- **Mudanças visuais fortes (8 fps):** ≈0,75; 3,25; 8,375; 11,875; 13,125; 19,125; 19,875; 25,875; 29,125; 31,125; 32,125 s, seguidas por movimentos tipográficos mais sutis.
- **Eventos de áudio candidatos:** 0,02; 8,06; 10,74; 12,02; 13,86; 19,62; 24,4; 24,9; 32,1; 33,08; 37,6; 48,06; 52,6; 57,02; 66,72; 69,68 s.
- **Risco de fidelidade:** footage real, trilhas, marcas e personas de campanha pertencem à referência; reconstrução com assets neutros não é réplica fiel. O vídeo tem estrutura longa de case/portfólio; para Reel de 20–25s, extrair o **idioma de motion**, não comprimir todos os 71s.

## Padrões recorrentes confirmados e não confirmados

### Observados nos vídeos

1. **Ação dentro dos widgets** (R12), e não apenas entrada/saída de cards.
2. **Motivos contínuos atravessando planos**: escala/rotação de telefone (R11), grade/reflow (R12), linha curva (R13).
3. **Mudança de hierarquia com ritmo**: alternância entre fundo claro, foreground forte, título mínimo e product/UI detail.
4. **Microinércia visual**: elemento continua se movendo levemente depois do impacto, com settle visível (amostra de quadros).
5. **Áudio presente nas três fontes**, com números de loudness distintos e transientes detectados próximos de alguns eventos visuais.

### Propostas de implementação, NÃO fatos sobre os autores

- Ancorar cada camada no tempo medido da narração, com ledger de palavras/ênfases.
- Criar biblioteca de tap/tick/swish/soft-hit de curta duração, sempre ligados a ações reais.
- Usar estados funcionais `antes → ação → depois` nos widgets, com SVG/HTML editável, sombras animadas e 3D/perspective quando adequado.
- Usar câmera/paralaxe com continuidade de escala de um plano para o outro e CTA indireta, pausada e curta.

## Novos presets e leitura prioritária

- `stateful-ui-widget`: enriquecimento do `ui-orbit` com estados funcionais.
- `voice-anchored-kinetic`: novo workflow de alinhamento da locução ao visual.
- `motif-match-cut`: transição por identidade geométrica, não flash genérico.
- `micro-sfx-cue-track`: novo workflow de som granular e timing.

Ler **obrigatoriamente** `microinteractions-audio.md` antes de construir novos Reels com a linguagem deste corpus. O ledger bruto do detector fica em `reference-event-ledgers.json`.
