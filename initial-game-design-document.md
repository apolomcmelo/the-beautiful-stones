## Título Provisório: 
“A Jornada das Belas Pedras: A Expedição da Pequena Arqueóloga”

## Elevator pitch
Um jogo 2D retro pixel art — plataforma top-down — onde uma jovem arqueóloga portuguesa explora terras inspiradas na Terra-Média dos anões e deserto da Arábia Saudita, para encontrar monumentos megalíticos. Ela tem 3 assistentes felinos e 1 canino com habilidades únicas que ajudam a resolver puzzles, enfrentar perigos e desbloquear segredos. Há humor e homenagens (piadas com amor por especiarias portuguesas, referências aos anões de O Senhor dos Anéis e um toque de arqueologia/aventura desértica).

## Introdução
A protagonista — uma jovem arqueóloga portuguesa, pequena, de cabelo castanho cacheado volumoso, óculos redondos e piercing no lábio — recebe um convite misterioso: os Anões da Terra Média descobriram um novo conjunto de monumentos megalíticos espalhados por regiões inspiradas na Arábia Saudita, e precisam da ajuda de uma especialista humana para decifrá-los.
Mas, antes de viajar, ela precisa enfrentar o seu maior inimigo:
— A BUROCRACIA ESPANHOLA.
O jogo começa com ela presa num interminável “Departamento de Autorizaciones Para Viajes Científicos Internacionales” onde anões burocratas espanhóis exigem papéis absurdos para conceder o visto.
Enquanto isso, seus três gatos — Maron, Fiódor e Orpheu — escapam da mochila e entram com ela na aventura.
Koffe, seu antigo cachorro, aparece como um espírito-anjo que surge em momentos sentimentais para guiá-la.


## Estrutura geral do jogo
### Gênero
Plataforma 2D Top-Down View (retro, pixel art), com exploração, puzzles e combate leve.

### Perspectiva
Top-Down (Vista de Cima, tipo Zelda: A Link to the Pastel ou Stardew Valley).

### Controles (padrão)
#### Teclas
- ← ou A: Mover para a esquerda
- ↑ ou W: Mover para cima
- → ou D: Mover para a direita
- ↓ ou S: Mover para baixo
- Enter/Return: ação/interagir
- P → chamar
- 1, 2, 3, 4: trocar assistente
- Espaço: usar item (ex.: especiaria)
- Esc: menu/inventário.

### Estética
Paleta limitada (dois/ três tons principais por cena) para remeter a jogos antigos; sprites simples mas detalhados para identificar os personagens, animações de 3–6 frames por ação.

### Engine sugerida
Phaser 3 (boa para web + tilemaps).

## Personagens (resumo prático)
### Protagonista
#### Denise, A Arqueóloga - jovem arqueóloga portuguesa
- *Aparência*:
  - Pequena, magra, porém em forma;
  - Cabelos cacheados castanhos-escuros, volumosos;
  - Piercing argola no centro do lábio inferior;
  - Óculos grandes e redondos com armação de metal.
- *Roupa base*: tank-top arqueóloga estilo Tomb Raider adaptada, mas não tão sexy (tons-terra).
- *Habilidades*: escavação leve (interagir em pontos marcados), inspecionar runas/relíquias, trocar roupa (cosmética + buffs).

### Assistentes — os 3 gatos e o cachorro (cada um com uma mecânica)
#### Maron — A Guardiã do Coração.
- Gatinha preta, olhar carinhoso e dependente emocional.  
- Não gosta de ficar longe da arqueóloga.  
- *Mecânica*:
  - Segue a protagonista automaticamente a 1 tile de distância;
  - Quando está próxima oferece *Aura de Conforto*: recuperação lenta de vida/energia e pequenas punições para inimigos que atacam a personagem (repulsão). Deve ficar próxima para funcionar;
  - Sente-se triste se separada por muito tempo (pequeno debuff até reencontro).
- *Uso em puzzle*: ativa plataformas sensíveis à “proximidade emocional” (pulsos que Maron reverbera).

#### Fiódor — O Olho Azul da Serenidade.
- Gatinho branco, com listas douradas claras e olhos azuis brilhantes.  
- Tímido, arredio, mas extremamente perceptivo.  
- *Mecânica*:
  - teleporta para posição designada após minigame, mas precisa de “conforto” (um mini-minigame de carinho — teclar no tempo certo) para realizar ações importantes. Uma vez conquistado, ativa mecanismos delicados a distância (puxa alavancas finas, pressiona teclas altas), ou acende runas azuis por curto tempo.
- *Uso em puzzle*:
  - Atravessa ranhuras estreitas e alcança botões;
  - Ativa sensores de luz;
  - Ilumina caminhos ocultos por segundos.

#### Orpheu — O Cupcake Flambado
- Gato de raça tonkinese chocolate escuro, grande, gordo.
- Não tem noção do próprio tamanho — derruba coisas.
- *Mecânica*:
  - fica parado até ser chamado + anda até posição
  - Força e massa. Empurra blocos pesados, aperta alavancas grandes, consegue abrir maçanetas/portas que requerem torque.
  - Não cabe em espaços pequenos;
  - Sua movimentação é lenta.
  - Pode usar “soco de barriga” para derrubar pilares fracos.
- *Uso em puzzle*:
  - Mover plataformas;
  - Ativar contrapesos.
  - Abrir portas

#### Koffe — O Anjo da Guarda.
- Cão branco de orelhas pretas
- Espírito gentil e protetor
- Koffe não está vivo no mundo físico — ele acompanha a protagonista como um espírito-guia em forma de anjo, sempre em tom transparente e azulado, quase como poeira estelar. Sua presença é calma, serena, e ele transmite uma sensação imediata de paz. Seus olhos brilham com uma luz suave, não intensa, e sua forma é sólida o suficiente para parecer real, mas etérea o bastante para deixar um rastro cintilante quando se move.
- É afetuoso, mas de um jeito tranquilo, quase meditativo, refletindo sua natureza de guardião espiritual.
- *Mecânica*:
  - Aparece somente em momentos críticos: Koffe não fica todo o tempo visível. Ele surge quando a protagonista está com vida baixa, em perigo, ou se aproximando de locais de energia espiritual.
   - Bênção de Koffe: quando presente, gera uma aura angelical que reduz o dano recebido e purifica efeitos negativos (veneno, medo, maldições).
   - Guia Espiritual: Koffe aponta discretamente a direção correta em áreas confusas ou labirínticas. Pode latir de forma suave ou iluminar um caminho.
   - Intocável: por ser um espírito, inimigos não podem atacá-lo nem bloqueá-lo; sua presença serve apenas de suporte.
- *Uso em puzzle*:
  - Pontes de Memória: Koffe pode materializar plataformas espirituais temporárias (brilho azul-esbranquiçado), permitindo alcançar áreas inacessíveis fisicamente.
  - Purificação: quebra barreiras mágicas feitas de energia corrupta — encostando sua aura angelical na barreira, ela se desfaz lentamente.
  - Sincronização de Espírito: há enigmas em que a protagonista e Koffe precisam estar alinhados em posições específicas ao mesmo tempo para ativar runas ou abrir portais antigos.

## Mecânicas principais (para desenvolvimento)
- **Chamar animal** — Botão que alterna entre Maron / Fiódor / Orpheu / Koffe. Cada gato tem cooldown de chamada (para balancear).
- **Carinho (mini-jogo rápido)**: Para Fiódor — pressiona teclas em ritmo; sucesso gera +buff e faz Fiódor ajudar.
- **Proximidade** — Maron precisa ficar num raio para buff; se distância > X segundos, Maron ganha “tristeza” e perde eficiência — força narrativa e mecânica.
- **Itens** — especiarias (colecionáveis):
  - **Canela**: boost temporário de velocidade/ataque (— “Sabor de Portugal”).
  - **Cravo**: aumenta resistência/diminui dano por tempo curto.
  - Coletar combos de especiarias permite cozinhar (craft) um Pastel de Nata (ou “Doce de Força”) que dá um buff permanente leve.
- **Roupas / Skins (troca de equipamento visual + pequenas variações de estatísticas)**:
  - **Arqueóloga Clássica(base)**: balanceada (melhor interação com relíquias).
  - **Roupa de Anã Guerreira**: aumenta defesa, reduz velocidade/jump height — estilo homenagem aos fãs de anões dO Senhor dos Anéis.
  - **Vestido árabe de seda**: aumenta agilidade e furtividade, reduz defesa.
  - **Exploradora de Deserto** (referência às pesquisas na Arábia Saudita)
  - Trocar traje altera animação e pode desbloquear áreas secretas (ex.: Travesia onde só quem usa Traje de Anã ganha respeito em um clã).
- **Combate**
  - Ataque corpo a corpo simples (pequeno golpe);
  - Uso de gatos para habilidades (Fiódor ataca com arranhão tímido, Orpheu com investida).
- **Puzzles megalíticos** baseados em astronomia, runas e peso.
- Inimigos pequenos (larvas de pedra, espíritos de poeira, aranhas de túnel).
- Coleta de:
  - fragmentos arqueológicos
  - especiarias
  - roupas (skins)
  - páginas de diário
- **Salvamento**: checkpoints ao encontrar pequenos menires com runas.

## Progresso / objetivos
### Objetivo básico
Viajar por uma versão fantasiosa da Terra Média misturada com desertos árabes, enfrentar ruínas megalíticas vivas, resolver puzzles, coletar especiarias (canela, cravo, noz-moscada) e derrotar o terrível chefe final:
“El Gran Administrador de Documentos Internacionales — Don Escribán Martínez.”

### Objetivo final
Reunir fragmentos de um mapa megalítico e ativar um círculo de pedras (o megálito principal) para revelar um grande segredo arqueológico. O segredo é um bolo de aniversário.

Cada mundo/nível entrega um fragmento e oferece inimigos/obstáculos temáticos.
Será necessário explorar:
- Ruínas megalíticas
- Túneis anões abandonados
- Cânions do deserto
- Templos subterrâneos
- Campos de menires alinhados com estrelas
Cada área contém:
- Um monumento principal
- Um fragmento do artefato
- Uma especiaria especial (Power-Up permanente)

### Níveis propostos
Curtos, 6–8 fases + boss, que é um espanhol cheio de documentos, representando a burocracia espanhola

1. **O Labirinto da Papelada Espanhola**
   Puzzles com carimbos, filas que se movem sozinhas, e anões irritados com formulários.
   O jogador coleta o “Visto Temporário Condicional” para sair.

2. **O Deserto da Arábia Saudita**
   Tempestades de areia, ruínas enterradas e viagens longas.
   Koffe aparece com mais frequência aqui.

3. **O Vale dos Anões Escavadores**
   Riachos brilhantes, minas cristalinas, e anões obcecados com organização.
   Eles tratam a protagonista como “A Pequena Senhora dos Monólitos”.

4. **As Ruínas Viventes**
   Pedras gigantes que se mexem, runas que choram pólen luminoso e templos que reorganizam seu layout quando ninguém está olhando.

5. **A Câmara Final da Licença de Campo**
   Sala dourada, enorme, onde Don Escribán Martínez aguarda sentado atrás de uma mesa gigante.
   Um chefe com ataques baseados em burocracia:
   — rajadas de carimbos, 
   — papéis voadores, 
   — formulários duplicados,
   — e “golpe de prazo impossível”.
   
## Encontros e inimigos (idéias rápidas)

- **Ratos de Pó**: inimigos fracos, baladeiros.
- **Sentinelas Anões Corrompidos**: inimigos com armadura pesada — empurrar com Orpheu ou usar buffs.
- **Plantas Rúnicas**: só danos se você passar por perto; Fiódor pode acalmar/neutralizar.
- **Golems de Areia** (deserto): resistentes a golpes únicos, vulneráveis a buffs de canela.
- **Chefes**: padrões simples com telegráfos (ataque A, B, C) — projetados para ensinar timing.

## Puzzles — exemplos práticos (scripts curtos)

1. **Alavancas em sequência (Câmara Rúnica)**

  - **Estado**: 3 alavancas; cada alavanca só pode ser acionada por um gato específico.
  - **Fluxo**:
    - *Maron*: ativa alavanca 1 (proximidade).
    - *Fiódor*: pulso remoto temporário — jogador faz mini-game para ganhá-lo => ativa alavanca 2.
    - *Orpheu*: empurra bloco para acionar alavanca 3.
    - Quando todas acionadas, porta se abre.

2. **Porta com maçaneta difícil (porta do anão)**
 - Requer Orpheu: se Orpheu não presente, a animação mostra que é “muito forte”. Orpheu gira a maçaneta (unique animation). Se Orpheu muito longe, necessidade de chamar e posicionar.

## Sistema de diálogo e tom
- Tom: divertido, carinhoso, levemente sarcástico — muitas referências aos anões (beard jokes, love for metal) e à portugalidade (brincadeiras com especiarias, caravelas, descobriimentos). Evitar copiar textos de obras protegidas — apenas homenagear com características (amizade com forjas, amor por pedras runas).
- Exemplo de linha de NPC anão: “Se queres ganhar meu respeito, traga-me uma pedra com mais história que a minha barba! Ou um pastel de nata” (brincalhão)
- Cada gato tem linhas curtas quando convocado (balões de fala): Maron “Miau ♥”, Fiódor “(murmúrio)…”, Orpheu “MROWRF!”, Koffe “(murmúrio canino)…”  (adorável e distinto).

## Diálogos/roteiro — cenas chave (exemplos prontos)
### Cena de Abertura (cutscene curta)
Narrador (texto em tela): “Ela veio de Portugal com mais mapas que descanso. Apaixonada por megálitos, trazia três promessas felinas e um cachorro eternamente em seu coração”
(Player aparece caminhando, câmera lateral mostra Maron, Fiódor, Orpheu dormindo, e o espírito de Koffe. A protagonista se ajoelha, dá um carinho; Maron ronrona e segue.)
Protagonista (balão): “Então? Vamos a isso?. A primeira pedra não vai se escavar sozinha.”
(sons leves, música tema retro)

### Interlúdio — após encontrar o primeiro fragmento
Protagonista: “Este símbolo… parece anão. E… tem um cheirinho de canela? Hah — talvez seja bom guardar para depois.”
Maron (texto curto): “Miau :3”
Fiódor (tímido): “Se… se não for muito tumulto, eu… posso acender a runa.”
Orpheu (com orgulho): “Gòrff!” (animação de bater no peito)

### NPC
1. Anões burocratas:
"Documentación incompleta. Falta o Formulário Azul de Praticidade e Trânsito."
"Acredita mesmo que vai viajar sem três cópias do Certificado de Carimbos Antigos?"
Protagonista:
"Mas… eu só preciso escavar uma pedra."
Anão:
"Então precisa do Certificado Verde, é claro!"

2. Os Anões Escavadores:
"Finalmente! A Pequena Senhora dos Monólitos chegou!"
"Para nós, humanos são gigantes — mas esta parece feita sob medida para túneis anões."

3. Chefe final — Don Escribán Martínez:
"Se queres o carimbo final, tendrás que enfrentar… EL FORMULARIO INFINITO."

## Itens e inventário (prático para implementar)
- **Especiarias**: usadas como melhorias de habilidades (ex. canela, cravo, noz-moscada, cardamomo).
- **Relíquias/fragmentos**: chaves que abrem portões de mundo.
- **Roupas**: lista e desbloqueio por progresso/sidequests.
- Consumíveis: especiarias, “Pastel de Nata” (craft com especiarias).
- **Caderno Arqueológico**: registra pistas e runas.

## HUD / UI
- Canto superior esquerdo: Vida (corações) + barra de energia (para usar skills dos gatos).
- Centro superior: mini-ícone do gato ativo (M, F, O) com cooldown.
- Superior direito: contador de especiarias e fragmentos.
- Botões virtuais (ajuda visual para mobile) ou legendas de tecla no rodapé.

## Sistema de progresso / balanceamento
- Duração alvo: jogo curto-médio — 2–4 horas de jogo com segredos.
- Checkpoints frequentes; vidas não punitivas (respawn no checkpoint).
- Balancing: inimigos básicos 1–2 hits para derrotar; bosses 5–10 hits com padrões.

## Arte e som
- Estilo pixel detalhado: sprites 50x75 de altura para protagonista, gatos 50x50, cachorro 50x50 com transparência
- Animação:
  - idle: 2 quadros
  - walk: 4 quadros
  - ação única: 2 quadros de  impacto
- Música: 8-bit / chiptune com tema principal alegre, fado e variações (deserto, forja, templo).
- SFX: passos, miados, empurrar, som de alavanca. Para Orpheu use um “booom” cômico.

## Scripts de evento (pseudo)
- Ao coletar fragmento:
  - pausar movimento
  - tocar animação de descoberta
  - mostrar texto: “Fragmento obtido — 1/6”
  - se fragmentos == N → desbloquear mapa do mundo
- Ao chamar Fiódor:
  - se trust < 0.5 → iniciar mini-game carinho (3 prompts)
  - se sucesso → fiodor.trust += 0.2; fiodor.cooldown = 20s; dar buff temporário

## Boss final — Espanhol Burocrático (fluxo)

1. Fase 1 — ataques lentos: punhos e stomp. Use ataque.
2. Fase 2 — cria pilares que exigem Orpheu para manter contrapeso.
3. Fase 3 — runas apagadas; Fiódor acende runas em sequência (mini-puzzle em tempo real).
Sequência final: Maron precisa ficar próxima para evitar dano em área enquanto você ativa o núcleo.

## Pequenas ideias de sidequests e humor
- “Procura do Chapéu do Orpheu”: Orpheu perdeu um objeto — resgate em troca de um traje anão.
- Comércio de especiarias: troque canela/cravo por upgrades estéticos.
- Homenagens jocosas: placas que dizem “Aqui jaz um anão que nunca voltou do barbeiro” (curto e leve).

## Roadmap mínimo para implementar (prático)
- Configurar Phaser + tilemap + player physics.
- Criar sprites básicos (player + 3 gatos) e animações.
- Implementar HUD + inventário simples.
- Implementar chamada de gato e lógica de buffs/cooldowns.
- Criar 3 níveis básicos (tutorial, halls, câmara rúnica).
- Iterar puzzles e adicionar especiarias/coleta.
- Polir com som/música + adicionar chefe.

## Cena de encerramento (breve)
Após derrotar o chefe burocrático espanhol, a protagonista recebe, finalmente, o visto real, necessário para ativar o megálito. A arqueóloga, os gatos e o cachorro olham para a pedra que revela um mural: uma cena de anões celebrando com especiarias e um bolo de aniversário, e um texto com letras que lembram runas escrito "Feliz Aniversário!". A personagem ri, Maron pula no colo, Fiódor olha admirado, Orpheu come um troço brilhante (comédia), e Koffe abana o rabo sorrindo com a língua pra fora. Dá um zoom na protagonista que diz "Fooooda-se!"
