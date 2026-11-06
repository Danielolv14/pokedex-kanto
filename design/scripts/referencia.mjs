// Folhas de referência: decomposição do aparelho (moodboard) e design tokens.
import { ler, porId, sprite, CORES_TIPO, STATS, TODOS_TIPOS, up, tinta, svgCorpo, svgTampa, svgMoldura, svgCapa, lente, leds, dpad, tecla, verdeDisplay, miniDisplay, dobradica, alto, bola, pilula, botaoRedondo, interruptor, rotulo, icon } from './lib.mjs';

export async function lerTokens() {
  const css = await ler('src/tokens.css');
  const bloco = (re) => Object.fromEntries([...(css.match(re)?.[1] ?? '').matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  return { claro: bloco(/:root\s*{([^}]*)}/), escuro: bloco(/\[data-theme='escuro'\]\s*{([^}]*)}/) };
}

const peca = (n, titulo, texto, palco, plastico) =>
  `<div class="part"><div class="part-stage${plastico ? ' casca' : ''}"><span class="part-num">${n}</span>${palco}</div><div class="part-info"><b>${titulo}</b><span>${texto}</span></div></div>`;

export function moodboard() {
  const pika = porId.get(25);
  const corpoMini = { w: 130, h: 170, hi: 70, diag: 84, step: 12, r: 12, sulco: 28 };
  const tampaMini = { w: 110, h: 146, low: 30, diag: 44, step: 12, r: 10 };
  const fechadoMini = { w: 140, h: 180, hi: 76, diag: 92, step: 12, r: 12, sulco: 30 };
  const partes = [
    ['Carcaça', 'Plástico vermelho #DC0A2D com luz vindo do alto, borda chanfrada, espessura escura embaixo, parafusos e um sulco moldado que separa a cabeça. A tampa é o espelho do corpo.',
      `<div class="abs" style="left:30px;top:18px;width:130px;height:180px">${svgCorpo(corpoMini)}</div>${dobradica(166, 50, 12, 136)}<div class="abs" style="left:182px;top:46px;width:110px;height:156px">${svgTampa(tampaMini)}</div>`],
    ['Lente', 'Vidro azul com reflexos, aro cromado e anel branco com espessura. Pulsa quando um Pokémon é sorteado.', lente(96, 46, 120), true],
    ['LEDs', 'Cúpulas de vidro em soquete escuro, com halo quando acesas. Acendem na abertura e piscam a cada navegação.',
      `${leds(94, 56, 28, 20)}${rotulo(94, 94, 124, 'LIGADOS')}${leds(94, 128, 28, 20, false)}${rotulo(94, 166, 124, 'DESLIGADOS')}`, true],
    ['Tela principal (LCD)', 'Moldura cinza em relevo com o canto inferior esquerdo chanfrado. O LCD fica afundado, atrás de um vidro com reflexo, e guarda a busca, o filtro e a lista.',
      `${svgMoldura(16, 14, 281, 192, 30)}${bola('bezel-dot', 145, 22, 8)}${bola('bezel-dot', 160, 22, 8)}<div class="lcd" style="left:34px;top:38px;width:245px;height:130px"><div class="lcd-status"><span>POKÉDEX</span><span>151/151</span></div><div class="list" style="padding-right:8px"><div class="row sel" style="grid-template-columns:34px 32px 1fr;height:36px"><span class="id"><i class="cursor"></i>025</span>${sprite(25, 32)}<span class="name">PIKACHU</span></div><div class="row" style="grid-template-columns:34px 32px 1fr;height:36px"><span class="id">026</span>${sprite(26, 32)}<span class="name">RAICHU</span></div></div></div>${bola('bezel-btn', 70, 178, 14)}${alto(222, 178, 48)}`, true],
    ['Tela da tampa', 'Tela escura com texto em fósforo verde. Mostra o resumo, os detalhes com barras segmentadas, o treinador ou a comparação.',
      `<div class="screen2" style="left:16px;top:16px;width:281px;height:188px;gap:8px"><div class="s2-head"><span class="s2-num">Nº 025</span><span class="s2-name" style="font-size:11px">PIKACHU</span></div><div class="stats">${STATS.slice(0, 4).map((s) => `<div class="stat-row"><span class="lbl" style="width:56px">${s.longo}</span><span class="val" style="width:26px">${pika.stats[s.key]}</span><span class="segs">${Array.from({ length: 16 }, (_, i) => `<i style="width:6px;height:11px${i < Math.round((pika.stats[s.key] / 255) * 16) ? `;background:${s.cor}` : ''}"></i>`).join('')}</span></div>`).join('')}</div></div>`, true],
    ['Cruz direcional', 'Cruz em relevo num rebaixo redondo, com setas moldadas. Cima e baixo: anterior e próximo. Esquerda e direita: pula uma página.', dpad(96, 46, 120), true],
    ['Botões do corpo', 'Cada botão fica num encaixe rebaixado, com volume e sombra. Preto: aleatório. Pílula vermelha: busca. Pílula azul: filtro de tipos.',
      `${botaoRedondo(50, 60, 66)}${pilula('red', 172, 64, 90, 18)}${pilula('blue', 172, 118, 90, 18)}${rotulo(38, 150, 90, 'ALEATÓRIO')}${rotulo(172, 92, 90, 'BUSCAR')}${rotulo(172, 146, 90, 'TIPOS')}`, true],
    ['Teclas azuis', 'Teclas com encaixe, borda iluminada, parede e LED. A 1ª fileira troca o modo e a 2ª tem as ações. A do modo atual fica afundada com o LED verde aceso.',
      `${tecla(36, 76, 112, 46, 'POKÉDEX', 'list', false, 11)}${tecla(166, 76, 112, 46, 'TREINAD.', 'person', true, 11)}${rotulo(36, 144, 112, 'NORMAL')}${rotulo(166, 144, 112, 'ATIVA')}`, true],
    ['Alto-falante, tema e som', 'Frisos vazados e botão do bip na moldura. No corpo, duas chaves deslizantes: tema (escuro/claro) e som (off/on).',
      `${svgMoldura(14, 30, 180, 150, 30)}${bola('bezel-btn', 52, 134, 20)}${alto(104, 134, 70)}${interruptor(204, 46, { rotulo: 'TEMA', esq: icon('moon', 9, '#ffe9ec'), dir: icon('sun', 9, '#ffe9ec'), w: 48, L: 40 })}${interruptor(204, 110, { rotulo: 'SOM', esq: 'OFF', dir: 'ON', on: false, w: 48, L: 40 })}`, true],
    ['Dobradiça', 'Cilindro em três gomos. Vertical no desktop e no mobile; horizontal no tablet, que abre como concha.',
      `${dobradica(70, 30, 40, 160)}${dobradica(140, 96, 146, 30, false)}`],
    ['Displays', 'Vidro afundado com moldura preta. Verde: contagem e seleção. Escuros da tampa: número e total, com brilho de fósforo.',
      `${verdeDisplay(26, 36, 260, 70, 'Nº 025', 'PIKACHU')}${miniDisplay(26, 126, 260, 56, 'TOTAL', '320')}`, true],
    ['Tampa fechada', 'Estado inicial com os LEDs apagados. Ao tocar, a tampa abre, os LEDs acendem e a tela liga.',
      `<div class="abs" style="left:86px;top:16px;width:140px;height:190px">${svgCorpo(fechadoMini)}${lente(8, 4, 40)}${leds(56, 10, 9, 6, false)}${svgCapa(fechadoMini)}</div>`],
  ];
  return `<section class="screen sheet" data-name="Referência / Decomposição do aparelho" style="width:1440px">
<h1>Pokédex Kanto · decomposição do aparelho<small>Peças da Pokédex clássica (Gen 1) redesenhadas em CSS e SVG próprios, sem imagem pronta do aparelho. Cada peça vira um componente do app.</small></h1>
<div class="part-grid">${partes.map(([t, d, p, c], i) => peca(i + 1, t, d, p, c)).join('')}</div></section>`;
}

const amostra = (nome, cor) => `<div class="swatch"><i style="background:${cor}"></i><div><b>${nome}</b><span>${cor.toUpperCase()}</span></div></div>`;
const grade = (itens, cols) => `<div class="swatches" style="grid-template-columns:repeat(${cols},1fr)">${itens.join('')}</div>`;

export function folhaTokens(tk) {
  const c = tk.claro;
  const e = tk.escuro;
  const aparelho = ['shell', 'shell-light', 'shell-dark', 'shell-deep', 'shell-ink', 'lens', 'lens-light', 'lens-dark', 'lens-rim', 'lens-ring', 'led-red', 'led-yellow', 'led-green', 'led-off', 'bezel', 'bezel-light', 'bezel-dark', 'key', 'key-light', 'key-dark', 'pad', 'pad-light', 'pill-red', 'pill-blue', 'display', 'display-ink', 'badge', 'accent'];
  const telas = ['lcd', 'lcd-2', 'lcd-hi', 'lcd-ink', 'lcd-dim', 'bg', 'bg-2', 'text', 'text-dim'];
  const tampa = ['screen', 'screen-2', 'screen-line', 'phosphor', 'phosphor-dim'];
  const fontes = [
    ['--font-pixel · 16', "font-family:'Press Start 2P';font-size:16px", 'POKÉDEX'],
    ['--font-pixel · 9 / 7', "font-family:'Press Start 2P';font-size:9px", 'Nº 003 · STATUS BASE'],
    ['--font-lcd · 28', "font-family:'VT323';font-size:28px", 'VENUSAUR 525'],
    ['--font-lcd · 20', "font-family:'VT323';font-size:20px", 'Buscar nome ou Nº... 080 082 083'],
    ['--font-ui · 32 / 800', "font-family:'Inter';font-size:32px;font-weight:800", 'Pokédex Kanto'],
    ['--font-ui · 13 / 600', "font-family:'Inter';font-size:13px;font-weight:600", 'Tema claro · Som ligado'],
  ];
  const espacos = Object.entries(c).filter(([k]) => k.startsWith('space-'));
  const raios = Object.entries(c).filter(([k]) => k.startsWith('radius-'));
  const sombras = [['shadow-device', 'box-shadow:0 30px 60px rgba(20,10,15,.35);background:#dc0a2d'], ['shadow-key', 'box-shadow:0 3px 0 #123c70;background:#2e7bd6'], ['shadow-lcd', 'box-shadow:inset 0 3px 8px rgba(0,0,0,.35);background:#c4e3c2'], ['shadow-bevel', 'box-shadow:inset 0 2px 0 rgba(255,255,255,.35),inset 0 -3px 0 rgba(0,0,0,.25);background:#dc0a2d']];
  return `<section class="screen sheet" data-name="Referência / Design tokens" style="width:1440px">
<h1>Design tokens<small>Os mesmos valores viram variáveis do Figma (coleções Cores, Tipos e Medidas) e o arquivo tokens.css do app.</small></h1>
<h2>APARELHO</h2>${grade(aparelho.map((k) => amostra(k, c[k])), 10)}
<h2>TELAS · TEMA CLARO (PADRÃO)</h2>${grade(telas.map((k) => amostra(k, c[k])), 9)}
<h2>TELAS · TEMA ESCURO</h2>${grade(telas.map((k) => amostra(k, e[k])), 9)}
<h2>TELA DA TAMPA (IGUAL NOS DOIS TEMAS)</h2>${grade(tampa.map((k) => amostra(k, c[k])), 9)}
<h2>TIPOS · OS 18 DO JSON (PALETA OFICIAL)</h2>${grade(TODOS_TIPOS.map((t) => `<div class="swatch"><i style="background:${CORES_TIPO[t.name]};display:flex;align-items:center;justify-content:center"><span class="chip lg" style="background:${CORES_TIPO[t.name]};color:${tinta(CORES_TIPO[t.name])}">${up(t.name)}</span></i><div><b>type-${t.name.toLowerCase()}</b><span>${CORES_TIPO[t.name].toUpperCase()}</span></div></div>`), 9)}
<h2>STATUS (BARRAS)</h2>${grade(STATS.map((s) => amostra(`stat · ${s.longo}`, s.cor)), 9)}
<div class="token-row">
<div class="token-card" style="flex:1.6"><h2>TIPOGRAFIA</h2>${fontes.map(([k, st, txt]) => `<div class="type-spec"><code>${k}</code><span style="${st}">${txt}</span></div>`).join('')}</div>
<div class="token-card" style="flex:1"><h2>ESPAÇAMENTO</h2>${espacos.map(([k, v]) => `<div class="space-spec"><code>${k}</code><i style="width:${parseInt(v) * 3}px"></i>${v}</div>`).join('')}</div>
</div>
<div class="token-row">
<div class="token-card" style="flex:1"><h2>RAIOS</h2><div class="spec-line">${raios.map(([k, v]) => `<div class="radius-spec"><i style="border-radius:${v === '999px' ? '32px' : v}"></i>${k} · ${v}</div>`).join('')}</div></div>
<div class="token-card" style="flex:1"><h2>SOMBRAS</h2><div class="spec-line">${sombras.map(([k, st]) => `<div class="shadow-spec"><i style="${st}"></i>${k}</div>`).join('')}</div></div>
</div></section>`;
}

