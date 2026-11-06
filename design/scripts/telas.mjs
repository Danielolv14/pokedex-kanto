// Conteúdo das telas (LCD e tela da tampa) e montagem do aparelho em cada largura.
import {
  modo, pokemons, porId, total, tiposUsados, treinadores, treinadoresDe, CORES_TIPO, STATS, TECLAS,
  pad3, up, tinta, sprite, arte, icon, pokeball, chip, segs,
  svgCorpo, svgTampa, svgPlaca, svgMoldura, svgCapa, lente, leds, dpad, tecla, interruptor, botaoRedondo,
  verdeDisplay, miniDisplay, dobradica, rotulo, alto, bola, pilula,
} from './lib.mjs';

const INK = () => (modo.wf ? '#555555' : '#13311f');
const DIM = () => (modo.wf ? '#8a8a8a' : '#4e7a5b');
const HI = () => (modo.wf ? '#222222' : '#e4f4e1');
const FOS = () => (modo.wf ? '#555555' : '#8cffb0');
const rgba = (hex, a) => `rgba(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',')},${a})`;
const milhar = (n) => n.toLocaleString('pt-BR');
const FAVORITOS = [1, 6, 25];

/* ================= LCD ================= */
const status = (esq, dir) =>
  `<div class="lcd-status"><span>${icon('play', 8, INK())}${esq}</span><span>${dir}<span class="battery"><i></i><i></i><i></i></span></span></div>`;

const busca = (q, ph = 'BUSCAR NOME OU Nº...') =>
  `<div class="search">${icon('search', 14, INK())}${q ? `<span>${q}</span><i class="caret"></i><span class="clear">${icon('x', 10, DIM())}</span>` : `<span class="ph">${ph}</span>`}</div>`;

const btnTipo = (tipo) => {
  const cor = tipo ? HI() : INK();
  return `<div class="lcd-btn${tipo ? ' on' : ''}">${icon('filter', 12, cor)}${tipo ? `<i class="dot" style="background:${CORES_TIPO[tipo]}"></i>${up(tipo)}` : 'TIPO: TODOS'}${icon('chev', 10, cor)}</div>`;
};
const btnOrdem = (txt = 'Nº') => `<div class="lcd-btn">${icon('sort', 12, INK())}${txt}${icon('chev', 10, INK())}</div>`;
const barra = (q, tipo, ordem, wrap = false, ph) =>
  `<div class="lcd-toolbar${wrap ? ' wrap' : ''}">${busca(q, ph)}${wrap ? '<span style="width:100%;height:0"></span>' : ''}${btnTipo(tipo)}${btnOrdem(ordem)}</div>`;

const COLS = {
  desk: { cols: '34px 40px 1fr 104px 180px', cell: 30 },
  tab: { cols: '40px 40px 1fr 124px 222px', cell: 37 },
};
const cabecalho = (v) =>
  `<div class="list-head" style="grid-template-columns:${v.cols};--cell:${v.cell}px"><span class="num">Nº</span><span></span><span>NOME</span><span>TIPO</span><span class="statcells">${STATS.map((s) => `<span>${s.curto}</span>`).join('')}</span></div>`;

const linha = (p, v, { sel, hover, tag } = {}) => {
  const fav = FAVORITOS.includes(p.id);
  return `<div class="row${sel ? ' sel' : ''}${hover ? ' hover' : ''}" style="grid-template-columns:${v.cols};--cell:${v.cell}px">
<span class="id">${sel ? '<i class="cursor"></i>' : ''}${pad3(p.id)}</span>${sprite(p.id, 40)}
<span class="name">${up(p.name)}${fav ? icon('star', 12, modo.wf ? '#8a8a8a' : sel ? '#ffd23f' : '#c79400') : ''}${tag ? `<span class="tag-ab">${tag}</span>` : ''}</span>
<span class="types">${p.types.map((t) => chip(t)).join('')}</span>
<span class="statcells">${STATS.map((s) => `<span class="stat">${p.stats[s.key]}</span>`).join('')}</span></div>`;
};

const card = (p, sel = false) =>
  `<div class="card${sel ? ' sel' : ''}">${sprite(p.id, 48)}<div class="body"><div class="top"><span class="id">${pad3(p.id)}</span><span class="name">${up(p.name)}</span><span class="types">${p.types.map((t) => chip(t)).join('')}</span></div><div class="cstats">${STATS.map((s) => `<span><em>${s.curto}</em>${p.stats[s.key]}</span>`).join('')}</div></div></div>`;

const lista = (itens, topo = 0, altura = 0.05) =>
  `<div class="list">${itens.join('')}<div class="scrollbar"><i style="top:${topo * 100}%;height:${altura * 100}%"></i></div></div>`;

const opcoesTipo = (sel) =>
  [`<div class="type-opt${sel ? '' : ' on'}" style="background:${modo.wf ? '#fff' : '#e4f4e1'};color:#13311f">TODOS<em>151</em></div>`]
    .concat(tiposUsados.map((t) => {
      const cor = CORES_TIPO[t.name];
      return `<div class="type-opt${sel === t.name ? ' on' : ''}" style="background:${cor};color:${tinta(cor)}">${up(t.name)}<em>${t.count}</em></div>`;
    }))
    .join('');
const acoesFiltro = () =>
  `<div class="popover-actions"><div class="lcd-btn">${icon('eraser', 12, INK())}LIMPAR</div><div class="lcd-btn on">${icon('play', 10, HI())}APLICAR</div></div>`;
const popoverTipos = (sel, x, y, w) =>
  `<div class="popover" style="left:${x}px;top:${y}px;width:${w}px"><div class="popover-title"><span>FILTRAR POR TIPO</span><span>17 TIPOS</span></div><div class="type-grid" style="grid-template-columns:repeat(3,1fr)">${opcoesTipo(sel)}</div>${acoesFiltro()}</div>`;
const folhaTipos = (sel) =>
  `<div class="sheet-lcd"><span class="grip"></span><div class="popover-title"><span>FILTRAR POR TIPO</span><span>17 TIPOS</span></div><div class="type-grid" style="grid-template-columns:repeat(3,1fr)">${opcoesTipo(sel)}</div>${acoesFiltro()}</div>`;

const vazio = (q) =>
  `<div class="empty">${icon('ball', 48, INK())}<b>NENHUM POKÉMON<br>ENCONTRADO</b><p>Nada para "${q}".<br>Tente outro nome ou número.</p><div class="lcd-btn on">${icon('eraser', 12, HI())}LIMPAR BUSCA</div></div>`;

const avatar = (t, d) => {
  const cor = CORES_TIPO[t.tipo];
  return `<span class="avatar" style="width:${d}px;height:${d}px;background:${cor};color:${tinta(cor)};font-size:${Math.round(d / 3.4)}px">${t.iniciais}</span>`;
};
const insignias = (n) =>
  `<span class="badges">${Array.from({ length: Math.max(8, n) }, (_, i) => `<i${i < n ? ' class="on"' : ''}></i>`).join('')}<em>${n}</em></span>`;
const equipeSprites = (t, s = 32) => `<span class="team">${t.equipe.map(({ p, n }) => sprite(p.id, s) + (n > 1 ? `<span class="mult">×${n}</span>` : '')).join('')}</span>`;

const TCOLS = { desk: '36px 108px 1fr 196px', tab: '40px 130px 1fr 230px' };
const cabecalhoTreinador = (cols) =>
  `<div class="list-head" style="grid-template-columns:${cols}"><span></span><span>NOME</span><span>INSÍGNIAS</span><span>EQUIPE</span></div>`;
const linhaTreinador = (t, cols, sel) =>
  `<div class="trainer-row${sel ? ' sel' : ''}" style="grid-template-columns:${cols}">${avatar(t, 36)}<span class="trainer-name">${up(t.name)}</span>${insignias(t.badges)}${equipeSprites(t)}</div>`;

const tcard = (t, aberto) =>
  `<div class="tcard${aberto ? ' open' : ''}"><div class="tcard-head">${avatar(t, 34)}<div class="meta"><span class="trainer-name">${up(t.name)}</span>${insignias(t.badges)}</div>${icon(aberto ? 'up' : 'down', 14, INK())}</div>${
    aberto ? `<div class="tcard-team">${t.equipe.map(({ p, n }) => `<div class="tmini">${sprite(p.id, 30)}${up(p.name)}${n > 1 ? ` ×${n}` : ''}<em>${total(p)}</em></div>`).join('')}</div>` : `${equipeSprites(t, 28)}`
  }</div>`;

/* ================= tela da tampa ================= */
const cabecaS2 = (num, nome, estrela = true) =>
  `<div class="s2-head">${num ? `<span class="s2-num">${num}</span>` : ''}<span class="s2-name">${nome}</span><span class="spacer"></span>${estrela ? `<span class="s2-star">${icon('star', 10, modo.wf ? '#8a8a8a' : '#ffd23f')}FAVORITO</span>` : ''}</div>`;

const VAR_S2 = {
  desk: { art: 186, img: 166, lbl: 58, segN: 20, segW: 6, segH: 12, gap: 9 },
  tab: { art: 130, img: 116, lbl: 58, segN: 18, segW: 6, segH: 11, gap: 3 },
  mob: { artW: 282, artH: 150, img: 140, lbl: 62, segN: 22, segW: 7, segH: 12, gap: 5 },
};

const caixaArte = (p, w, h, img) => {
  const cor = CORES_TIPO[p.types[0].name];
  const fundo = modo.wf ? '#f0f0f0' : `radial-gradient(circle at 50% 55%, ${rgba(cor, 0.45)} 0%, ${rgba(cor, 0)} 65%)`;
  return `<div class="art-box" style="width:${w}px;height:${h}px;background:${fundo}"><span class="art-tag"><i></i>ANIM</span>${arte(p.id, img)}</div>`;
};
const blocoStats = (p, v) =>
  `<div class="stats" style="gap:${v.gap}px">${STATS.map((s) => `<div class="stat-row"><span class="lbl" style="width:${v.lbl}px">${s.longo}</span><span class="val" style="width:30px">${p.stats[s.key]}</span>${segs(p.stats[s.key], v.segN, v.segW, v.segH, modo.wf ? '#9a9a9a' : s.cor)}</div>`).join('')}</div>`;
const rodapeTreinadores = (p, extra = '') => {
  const trs = treinadoresDe(p.id);
  return `<div class="s2-foot">${extra}TREINADORES:${trs.length ? trs.map((n) => `<span class="tchip">${up(n)}</span>`).join('') : ' NENHUM'}</div>`;
};

export function telaDetalhes(p, tipo) {
  const v = VAR_S2[tipo];
  const tipos = `<div class="s2-types">${p.types.map((t) => chip(t, true)).join('')}</div>`;
  const media = tipo === 'mob' ? '' : `<span>MÉDIA ${Math.round(total(p) / 6)}</span>`;
  const tot = `<div class="s2-total"><span>TOTAL</span><b>${total(p)}</b>${media}</div>`;
  const cab = cabecaS2(`Nº ${pad3(p.id)}`, up(p.name));
  if (tipo === 'mob') {
    return `${cab}${caixaArte(p, v.artW, v.artH, v.img)}<div class="s2-head">${tipos}<span class="spacer"></span>${tot}</div><span class="s2-label">STATUS BASE</span>${blocoStats(p, v)}${rodapeTreinadores(p)}`;
  }
  if (tipo === 'tab') {
    return `${cab}<div class="s2-cols"><div class="s2-col">${caixaArte(p, v.art, v.art, v.img)}${tipos}</div><div class="s2-col">${blocoStats(p, v)}${tot}</div></div>${rodapeTreinadores(p)}`;
  }
  return `${cab}<div class="s2-cols"><div class="s2-col">${caixaArte(p, v.art, v.art, v.img)}${tipos}</div><div class="s2-col"><span class="s2-label">STATUS BASE</span>${blocoStats(p, v)}${tot}</div></div>${rodapeTreinadores(p)}`;
}

export function telaResumo(lista, tipo, { titulo = 'RESUMO DA POKÉDEX', info } = {}) {
  const usados = tiposUsados
    .map((t) => ({ ...t, n: lista.filter((p) => p.types.some((x) => x.id === t.id)).length }))
    .filter((t) => t.n > 0)
    .sort((a, b) => b.n - a.n);
  const max = Math.max(...usados.map((t) => t.n));
  const larg = tipo === 'tab' ? 36 : 50;
  const barraTipo = (t) =>
    `<div class="type-bar">${chip(t)}<span class="fill" style="width:${Math.max(3, Math.round((t.n / max) * larg))}px;background:${modo.wf ? '#9a9a9a' : CORES_TIPO[t.name]}"></span><em>${t.n}</em></div>`;
  const meio = Math.ceil(usados.length / 2);
  const colunas = usados.length > 4 ? [usados.slice(0, meio), usados.slice(meio)] : [usados];
  const fortes = [...lista].sort((a, b) => total(b) - total(a)).slice(0, 3);
  const spr = tipo === 'tab' ? 30 : 36;
  const top = `<div class="top-list">${fortes.map((p) => `<div class="top-item">${sprite(p.id, spr)}<span style="display:flex;flex-direction:column;gap:2px">${up(p.name)}<em style="margin-left:0">${total(p)}</em></span></div>`).join('')}</div>`;
  const fatos = info ?? `${lista.length} POKÉMON · ${usados.length} TIPOS · 12 TREINADORES`;
  return `${cabecaS2('', titulo, false)}
<div class="s2-cols" style="gap:${tipo === 'tab' ? 12 : 16}px"><div class="s2-col"><span class="s2-label">POKÉMON POR TIPO</span><div style="display:flex;gap:12px">${colunas.map((c) => `<div class="type-bars">${c.map(barraTipo).join('')}</div>`).join('')}</div></div>
<div class="s2-col"><span class="s2-label">MAIS FORTES</span>${top}</div></div>
<div class="s2-foot">${fatos}</div>
<div class="hint">${icon('up', 8, FOS())}${icon('down', 8, FOS())}OU CLIQUE NUM POKÉMON PARA VER OS DETALHES</div>`;
}

export function telaTreinador(t, tipo) {
  const soma = t.equipe.reduce((a, { p, n }) => a + total(p) * n, 0);
  const qtd = t.equipe.reduce((a, { n }) => a + n, 0);
  const cabeca = `<div class="trainer-big">${avatar(t, tipo === 'tab' ? 36 : 44)}<div style="display:flex;flex-direction:column;gap:6px"><span class="s2-num">TREINADOR</span><span class="s2-name">${up(t.name)}</span></div><span class="spacer" style="flex:1"></span>${insignias(t.badges)}</div>`;
  const cartao = ({ p, n }) =>
    `<div class="team-card">${sprite(p.id, tipo === 'tab' ? 36 : 40)}<div class="tc-body"><span class="tc-name">${up(p.name)}${n > 1 ? ` ×${n}` : ''}</span><span class="tc-sub">${tipo === 'tab' ? '' : p.types.map((x) => chip(x)).join('')}<em>${total(p)}</em></span></div></div>`;
  const cols = tipo === 'tab' ? 3 : 2;
  return `${cabeca}<span class="s2-label">EQUIPE · ${qtd} POKÉMON</span><div class="team-grid" style="grid-template-columns:repeat(${cols},1fr)">${t.equipe.map(cartao).join('')}</div><div class="s2-foot">TOTAL DA EQUIPE <span class="tchip">${milhar(soma)}</span>CLIQUE NUM POKÉMON PARA VER OS DETALHES</div>`;
}

export function telaComparar(a, b, tipo) {
  const cfg = { desk: { art: 84, bar: 150, lbl: 64, lado: 'row' }, tab: { art: 56, bar: 118, lbl: 60, lado: 'row' }, mob: { art: 100, bar: 74, lbl: 56, lado: 'col' } }[tipo];
  const lado = (p, cls) => {
    const info = `<div class="cmp-side ${cls}"><span class="cmp-name">${up(p.name)}</span><span class="s2-types">${p.types.map((t) => chip(t)).join('')}</span></div>`;
    const img = `<div class="art-box" style="width:${cfg.art}px;height:${cfg.art}px">${arte(p.id, cfg.art - 8)}</div>`;
    if (cfg.lado === 'col') return `<div class="cmp-side ${cls}" style="gap:8px">${img}${info}</div>`;
    return `<div style="display:flex;align-items:center;gap:10px">${cls === 'b' ? info + img : img + info}</div>`;
  };
  const fill = (v, max) => Math.max(2, Math.round(Math.min(1, v / max) * cfg.bar));
  const linhaCmp = (rot, va, vb, max, cor) => {
    const ganhaA = va > vb;
    const ganhaB = vb > va;
    const c = modo.wf ? '#9a9a9a' : cor;
    return `<div class="cmp-row${rot === 'TOTAL' ? ' total' : ''}"><span class="v${ganhaA ? ' win' : ''}" style="width:30px;text-align:right">${va}</span><span class="bar a" style="width:${cfg.bar}px"><i style="width:${fill(va, max)}px;background:${c};opacity:${ganhaA || va === vb ? 1 : 0.45}"></i></span><span class="lbl" style="width:${cfg.lbl}px">${rot}</span><span class="bar" style="width:${cfg.bar}px"><i style="width:${fill(vb, max)}px;background:${c};opacity:${ganhaB || va === vb ? 1 : 0.45}"></i></span><span class="v${ganhaB ? ' win' : ''}" style="width:30px">${vb}</span></div>`;
  };
  const linhas = STATS.map((s) => linhaCmp(s.longo, a.stats[s.key], b.stats[s.key], 180, s.cor)).join('') + linhaCmp('TOTAL', total(a), total(b), 720, '#ffd23f');
  const vence = total(a) === total(b) ? 'EMPATE' : `${up(total(a) > total(b) ? a.name : b.name)} VENCE NO TOTAL`;
  return `<div class="cmp-top">${lado(a, 'a')}<span class="vs">VS</span>${lado(b, 'b')}</div><div class="cmp-rows" style="gap:${tipo === 'tab' ? 3 : 5}px">${linhas}</div><div class="s2-foot">${icon('star', 10, modo.wf ? '#8a8a8a' : '#ffd23f')}${vence}</div>`;
}

export const telaSemSinal = () =>
  `<div class="signal">${icon('ball', 40, FOS())}<b>SEM SINAL</b><span>Nenhum Pokémon para mostrar.<br>Ajuste a busca ou os filtros.</span></div>`;

/* ================= conteúdos de LCD por estado ================= */
const faixa = (de, ate) => pokemons.slice(de - 1, ate);

export const LCD = {
  principal: (v) => `${status('POKÉDEX', '151/151')}${barra('', null, 'Nº')}${cabecalho(COLS[v])}${lista(faixa(1, 7).map((p) => linha(p, COLS[v], { hover: p.id === 4 })), 0, 0.05)}`,
  busca: (v) => {
    const res = pokemons.filter((p) => p.name.toLowerCase().includes('char') && p.types.some((t) => t.name === 'Fire'));
    const largura = v === 'tab' ? 330 : 316;
    return `${status('POKÉDEX', `${res.length}/151`)}${barra('char', 'Fire', 'Nº')}${cabecalho(COLS[v])}${lista(res.map((p) => linha(p, COLS[v])), 0, 1)}${popoverTipos('Fire', v === 'tab' ? 280 : 200, 66, largura)}`;
  },
  vazio: (v) => `${status('POKÉDEX', '0/151')}${barra('mewthree', null, 'Nº')}${vazio('mewthree')}`,
  detalhes: (v) => `${status('POKÉDEX', '151/151')}${barra('', null, 'Nº')}${cabecalho(COLS[v])}${lista(faixa(1, 7).map((p) => linha(p, COLS[v], { sel: p.id === 3 })), 0, 0.05)}`,
  treinadores: (v) => `${status('TREINADORES', '12')}<div class="lcd-toolbar">${busca('', 'BUSCAR TREINADOR...')}${btnOrdem('INSÍGNIAS')}</div>${cabecalhoTreinador(TCOLS[v])}${lista(treinadores.slice(0, 7).map((t, i) => linhaTreinador(t, TCOLS[v], i === 0)), 0, 0.5)}`,
  comparar: (v) => `${status('COMPARAR', 'A × B')}${barra('', null, 'Nº')}${cabecalho(COLS[v])}${lista(faixa(4, 10).map((p) => linha(p, COLS[v], { tag: p.id === 6 ? 'A' : p.id === 9 ? 'B' : '' })), 0.02, 0.05)}`,
};

export const LCD_MOB = {
  principal: () => `${status('POKÉDEX', '151/151')}${barra('', null, 'Nº', true)}${lista(faixa(1, 5).map((p) => card(p)), 0, 0.04)}`,
  busca: () => {
    const res = pokemons.filter((p) => p.name.toLowerCase().includes('char') && p.types.some((t) => t.name === 'Fire'));
    return `${status('POKÉDEX', `${res.length}/151`)}${barra('char', 'Fire', 'Nº', true)}${lista(res.map((p) => card(p)), 0, 1)}${folhaTipos('Fire')}`;
  },
  vazio: () => `${status('POKÉDEX', '0/151')}${barra('mewthree', null, 'Nº', true)}${vazio('mewthree')}`,
  treinadores: () => `${status('TREINADORES', '12')}<div class="lcd-toolbar">${busca('', 'BUSCAR TREINADOR...')}${btnOrdem('INSÍG.')}</div>${lista(treinadores.slice(0, 4).map((t, i) => tcard(t, i === 0)), 0, 0.3)}`,
};

/* ================= aparelho por largura ================= */
const teclasTampa = (x0, y0, w, h, gx, gy, ativo, fonte, colunas = 5) =>
  TECLAS.map(([rot, ic, id], i) => {
    const col = colunas === 5 ? i % 5 : i < 5 ? 0 : 1;
    const lin = colunas === 5 ? (i < 5 ? 0 : 1) : i % 5;
    return tecla(x0 + col * (w + gx), y0 + lin * (h + gy), w, h, rot, ic, id === ativo, fonte);
  }).join('');

export function cabecalhoApp(x, y, w) {
  return `<div class="app-header" style="left:${x}px;top:${y}px;width:${w}px;height:44px"><div class="brand">${pokeball(32)}<div style="display:flex;flex-direction:column;gap:6px"><span class="brand-name">POKÉDEX</span><span class="brand-sub">KANTO · 151 POKÉMON · 12 TREINADORES</span></div></div><div class="kbd-hint"><kbd>↑</kbd><kbd>↓</kbd>navegar<kbd>←</kbd><kbd>→</kbd>página<kbd>/</kbd>buscar<kbd>R</kbd>aleatório</div></div>`;
}

const LEG = '#ffe9ec';
const chaves = (x, y, gap = 100) =>
  interruptor(x, y, { rotulo: 'TEMA', esq: icon('moon', 9, LEG), dir: icon('sun', 9, LEG) }) +
  interruptor(x + gap, y, { rotulo: 'SOM', esq: 'OFF', dir: 'ON' });
const chavesMob = (x, y) =>
  interruptor(x, y, { rotulo: icon('sun', 13, LEG), w: 44, h: 20, L: 20 }) +
  interruptor(x, y + 30, { rotulo: icon('sound', 13, LEG), w: 44, h: 20, L: 20 });

const CORPO_D = { w: 640, h: 790, hi: 340, diag: 400, step: 48, r: 26, sulco: 104 };
const TAMPA_D = { w: 560, h: 686, low: 160, diag: 220, step: 48, r: 24 };

export function aparelhoDesktop({ lcd, s2, ativo, gd, mini }) {
  const corpo = `<div class="abs" style="left:0;top:0;width:640px;height:800px">${svgCorpo(CORPO_D)}
${lente(28, 8, 92)}${leds(140, 18, 16, 12)}
<div class="engraved" style="left:424px;top:62px;font-size:14px">POKÉDEX</div>${chaves(424, 90)}
${svgMoldura(32, 176, 576, 444, 44)}${bola('bezel-dot', 303, 187, 10)}${bola('bezel-dot', 327, 187, 10)}
<div class="lcd" style="left:56px;top:204px;width:528px;height:372px">${lcd}</div>
${bola('bezel-btn', 96, 588, 20)}${alto(500, 588, 72)}
${botaoRedondo(40, 640, 60)}${rotulo(26, 710, 88, 'ALEATÓRIO')}
${pilula('red', 132, 646, 70, 14)}${pilula('blue', 216, 646, 70, 14)}${rotulo(132, 666, 70, 'BUSCAR')}${rotulo(216, 666, 70, 'TIPOS')}
${verdeDisplay(132, 686, 222, 70, gd[0], gd[1])}
${dpad(452, 636, 120)}${rotulo(452, 764, 120, 'NAVEGAR')}</div>`;
  const tampa = `<div class="abs" style="left:680px;top:104px;width:560px;height:696px">${svgTampa(TAMPA_D)}
<div class="screen2" style="left:36px;top:76px;width:488px;height:356px">${s2}</div>
${teclasTampa(36, 456, 88, 40, 12, 10, ativo, 10)}
<div class="white-bar" style="left:36px;top:568px;width:110px;height:12px"></div><div class="white-bar" style="left:160px;top:568px;width:110px;height:12px"></div>
<div class="led yellow" style="left:500px;top:564px;width:20px;height:20px"></div>
${miniDisplay(36, 600, 236, 56, mini[0][0], mini[0][1])}${miniDisplay(288, 600, 236, 56, mini[1][0], mini[1][1])}</div>`;
  return `<div class="floor-shadow" style="left:150px;top:820px;width:1140px;height:90px"></div>
<div class="abs device" style="left:100px;top:78px;width:1240px;height:800px">${corpo}${dobradica(642, 168, 36, 604)}${tampa}</div>`;
}

export function aparelhoDesktopFechado() {
  const g = CORPO_D;
  return `<div class="floor-shadow" style="left:420px;top:820px;width:600px;height:90px"></div>
<div class="abs device" style="left:396px;top:78px;width:676px;height:800px">${dobradica(624, 170, 40, 600)}
<div class="abs" style="left:0;top:0;width:640px;height:800px">${svgCorpo(g)}${lente(28, 8, 92)}${leds(140, 18, 16, 12, false)}
<div class="engraved" style="left:424px;top:62px;font-size:14px">POKÉDEX</div>${chaves(424, 90)}
${svgCapa(g, { cy: 380, r: 74 })}
<div class="cover-hint" style="left:120px;top:486px;width:400px"><b>POKÉDEX</b><span>TOQUE PARA ABRIR</span>${icon('right', 24, modo.wf ? '#555555' : '#ffd23f')}</div></div></div>`;
}

const CORPO_T = { w: 720, h: 650, hi: 400, diag: 450, step: 44, r: 26, sulco: 100 };
export function aparelhoTablet({ lcd, s2, ativo, gd, mini }) {
  const corpo = `<div class="abs" style="left:0;top:0;width:720px;height:660px">${svgCorpo(CORPO_T)}
${lente(26, 8, 88)}${leds(134, 16, 16, 12)}
<div class="engraved" style="left:470px;top:56px;font-size:12px">POKÉDEX</div>${chaves(470, 80)}
${svgMoldura(24, 160, 672, 402, 40)}${bola('bezel-dot', 343, 170, 10)}${bola('bezel-dot', 367, 170, 10)}
<div class="lcd" style="left:46px;top:188px;width:628px;height:338px">${lcd}</div>
${bola('bezel-btn', 90, 534, 18)}${alto(600, 532, 72)}
${botaoRedondo(34, 576, 50)}${rotulo(18, 632, 82, 'ALEATÓRIO')}
${pilula('red', 112, 582, 62, 12)}${pilula('blue', 186, 582, 62, 12)}${rotulo(112, 600, 62, 'BUSCAR')}${rotulo(186, 600, 62, 'TIPOS')}
${verdeDisplay(262, 576, 210, 62, gd[0], gd[1])}
${rotulo(500, 602, 90, 'NAVEGAR')}${dpad(604, 566, 78)}</div>`;
  const tampa = `<div class="abs" style="left:0;top:686px;width:720px;height:320px">${svgPlaca({ w: 720, h: 306, r: 24, chanfro: 40 })}
<div class="screen2" style="left:24px;top:20px;width:428px;height:268px">${s2}</div>
${teclasTampa(476, 20, 106, 38, 10, 8, ativo, 10, 2)}
${miniDisplay(476, 250, 200, 40, mini[0][0], mini[0][1])}
<div class="led yellow" style="left:688px;top:254px;width:14px;height:14px"></div></div>`;
  return `<div class="abs device" style="left:24px;top:8px;width:720px;height:1006px">${corpo}${dobradica(60, 654, 600, 28, false)}${tampa}</div>`;
}

const CORPO_M = { w: 370, h: 814, hi: 200, diag: 240, step: 34, r: 24, sulco: 90 };

export function aparelhoMobile({ lcd, ativo, gd }) {
  const teclas = TECLAS.slice(0, 5).map(([rot, ic, id], i) => tecla(12 + i * 70, 632, 64, 40, rot, ic, id === ativo, 8)).join('');
  return `<div class="abs device" style="left:10px;top:10px;width:370px;height:824px">${svgCorpo(CORPO_M)}
${lente(16, 8, 74)}${leds(104, 14, 13, 9)}
<div class="engraved" style="left:104px;top:44px;font-size:10px">POKÉDEX</div>
${chavesMob(262, 44)}
${svgMoldura(10, 132, 350, 486, 34)}${bola('bezel-dot', 172, 141, 9)}${bola('bezel-dot', 189, 141, 9)}
<div class="lcd" style="left:24px;top:156px;width:322px;height:428px">${lcd}</div>
${bola('bezel-btn', 60, 592, 16)}${alto(276, 592, 60)}
${teclas}
${botaoRedondo(22, 690, 50)}${rotulo(6, 746, 82, 'ALEATÓRIO')}
${pilula('red', 92, 694, 52, 10)}${pilula('blue', 154, 694, 52, 10)}${rotulo(92, 708, 52, 'BUSCAR')}${rotulo(154, 708, 52, 'TIPOS')}
${verdeDisplay(92, 726, 140, 58, gd[0], gd[1], 19)}
${dpad(252, 686, 102)}${rotulo(252, 794, 102, 'NAVEGAR')}</div>`;
}

const TAMPA_M = { w: 350, h: 814, low: 100, diag: 150, step: 40, r: 24 };
export function tampaMobile({ s2, ativo, num, mini }) {
  return `<div class="abs device" style="left:10px;top:10px;width:370px;height:824px">${dobradica(0, 60, 22, 700)}
<div class="abs" style="left:20px;top:0;width:350px;height:824px">${svgTampa(TAMPA_M)}
${tecla(16, 52, 104, 34, 'VOLTAR', 'left', false, 10)}
${miniDisplay(170, 14, 164, 52, 'Nº', num)}
<div class="screen2" style="left:16px;top:100px;width:318px;height:470px">${s2}</div>
${teclasTampa(16, 588, 58, 40, 6, 8, ativo, 8)}
<div class="white-bar" style="left:16px;top:694px;width:100px;height:10px"></div><div class="white-bar" style="left:126px;top:694px;width:100px;height:10px"></div>
<div class="led yellow" style="left:306px;top:690px;width:18px;height:18px"></div>
${miniDisplay(16, 720, 154, 56, mini[0][0], mini[0][1])}${miniDisplay(180, 720, 154, 56, mini[1][0], mini[1][1])}</div></div>`;
}

const CORPO_MF = { w: 340, h: 780, hi: 190, diag: 228, step: 32, r: 24, sulco: 88 };
export function aparelhoMobileFechado() {
  return `<div class="floor-shadow" style="left:40px;top:780px;width:310px;height:60px"></div>
<div class="abs device" style="left:22px;top:24px;width:362px;height:790px">${dobradica(330, 150, 26, 560)}
<div class="abs" style="left:0;top:0;width:340px;height:790px">${svgCorpo(CORPO_MF)}${lente(16, 8, 72)}${leds(100, 14, 13, 9, false)}
<div class="engraved" style="left:100px;top:44px;font-size:10px">POKÉDEX</div>${chavesMob(250, 40)}
${svgCapa(CORPO_MF, { cy: 360, r: 60 })}
<div class="cover-hint" style="left:40px;top:450px;width:260px"><b>POKÉDEX</b><span>TOQUE PARA ABRIR</span>${icon('right', 22, modo.wf ? '#555555' : '#ffd23f')}</div></div></div>`;
}

export { porId };
