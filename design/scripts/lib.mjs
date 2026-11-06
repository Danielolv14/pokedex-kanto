// Dados, ícones e peças do aparelho usados pelo gerador dos mockups.
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ler = (p) => readFile(join(raiz, p), 'utf8');

/* ---------------- dados ---------------- */
const dados = JSON.parse(await ler('pokedex-data.json'));
export const TYPELESS = dados.types.find((t) => t.id === 0);
export const pokemons = dados.pokemon.map((p) => ({ ...p, types: p.types.length ? p.types : [TYPELESS] }));
export const porId = new Map(pokemons.map((p) => [p.id, p]));
export const total = (p) => Object.values(p.stats).reduce((a, b) => a + b, 0);
export const tiposUsados = dados.types
  .map((t) => ({ ...t, count: pokemons.filter((p) => p.types.some((x) => x.id === t.id)).length }))
  .filter((t) => t.count > 0);

export const CORES_TIPO = {
  Typeless: '#68a090', Normal: '#a8a878', Fire: '#f08030', Water: '#6890f0', Grass: '#78c850',
  Electric: '#f8d030', Ice: '#98d8d8', Fighting: '#c03028', Poison: '#a040a0', Ground: '#e0c068',
  Flying: '#a890f0', Psychic: '#f85888', Bug: '#a8b820', Rock: '#b8a038', Ghost: '#705898',
  Dark: '#705848', Dragon: '#7038f8', Steel: '#b8b8d0',
};
export const TODOS_TIPOS = dados.types;

export const STATS = [
  { key: 'hp', curto: 'HP', longo: 'HP', cor: '#ff5959' },
  { key: 'attack', curto: 'ATQ', longo: 'ATAQUE', cor: '#f5ac78' },
  { key: 'defense', curto: 'DEF', longo: 'DEFESA', cor: '#fae078' },
  { key: 'specialAttack', curto: 'AT.E', longo: 'AT. ESP', cor: '#9db7f5' },
  { key: 'specialDefense', curto: 'DF.E', longo: 'DEF. ESP', cor: '#a7db8d' },
  { key: 'speed', curto: 'VEL', longo: 'VELOC.', cor: '#fa92b2' },
];

const agrupar = (ids) => {
  const m = new Map();
  ids.forEach((id) => m.set(id, (m.get(id) || 0) + 1));
  return [...m].map(([id, n]) => ({ p: porId.get(id), n }));
};
const tipoDominante = (equipe) => {
  const c = new Map();
  equipe.forEach(({ p, n }) => p.types.forEach((t) => c.set(t.name, (c.get(t.name) || 0) + n)));
  return [...c].sort((a, b) => b[1] - a[1])[0][0];
};
export const treinadores = dados.trainers.map((t) => {
  const equipe = agrupar(t.pokemonIds);
  return { ...t, equipe, tipo: tipoDominante(equipe), iniciais: t.name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2) };
});
export const treinadoresDe = (id) => treinadores.filter((t) => t.pokemonIds.includes(id)).map((t) => t.name);

/* ---------------- modo (hi-fi ou wireframe) ---------------- */
export const modo = { wf: false };
const HIFI = { shell: '#dc0a2d', light: '#f44a63', deep: '#6e0015', ink: '#5a0012', bezel: '#dedede', bezelDark: '#a9a9a9', bezelLight: '#f7f7f7', outline: 'none' };
const WF = { shell: '#ffffff', light: '#ffffff', deep: '#dadada', ink: '#8a8a8a', bezel: '#f2f2f2', bezelDark: '#8a8a8a', bezelLight: '#ffffff', outline: '#8a8a8a' };
export const C = () => (modo.wf ? WF : HIFI);

/* ---------------- texto e cor ---------------- */
export const pad3 = (n) => String(n).padStart(3, '0');
export const up = (s) => s.toUpperCase();
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contraste = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
export const tinta = (hex) => (contraste(lum(hex), 1) >= contraste(lum(hex), lum('#1a1a1a')) ? '#ffffff' : '#1a1a1a');

/* ---------------- imagens ---------------- */
const SPR = new Map();
const ART = new Map();
for (const f of await readdir(join(raiz, 'assets/sprites'))) SPR.set(+f.split('.')[0], `data:image/png;base64,${(await readFile(join(raiz, 'assets/sprites', f))).toString('base64')}`);
for (const f of await readdir(join(raiz, 'assets/art'))) ART.set(+f.split('.')[0], `data:image/png;base64,${(await readFile(join(raiz, 'assets/art', f))).toString('base64')}`);

export const ph = (w, h) =>
  `<div class="ph" style="width:${w}px;height:${h}px"><svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" fill="none" stroke="#9a9a9a" stroke-width="1.5"/><path d="M0 0 L${w} ${h} M${w} 0 L0 ${h}" stroke="#c4c4c4" stroke-width="1"/></svg></div>`;
export const sprite = (id, s) => {
  if (modo.wf) return ph(s, s);
  const z = Math.round(s * 1.5);
  const m = Math.round((z - s) / 2);
  return `<span class="spr" style="width:${s}px;height:${s}px"><img src="${SPR.get(id)}" width="${z}" height="${z}" alt="" style="margin:-${m}px"></span>`;
};
export const arte = (id, s) => (modo.wf ? ph(s, s) : `<img src="${ART.get(id)}" width="${s}" height="${s}" alt="">`);

/* ---------------- ícones (desenhados em grade 16, sem escala de viewBox) ---------------- */
const sc = (d, k) => d.replace(/-?\d*\.?\d+/g, (n) => +(parseFloat(n) * k).toFixed(2));
const ICONES = {
  search: (k, c) => `<circle cx="${7 * k}" cy="${7 * k}" r="${4.6 * k}" stroke="${c}" stroke-width="${2 * k}"/><path d="${sc('M10.4 10.4 L14.2 14.2', k)}" stroke="${c}" stroke-width="${2.2 * k}" stroke-linecap="square"/>`,
  chev: (k, c) => `<path d="${sc('M3.5 6 L8 10.5 L12.5 6', k)}" stroke="${c}" stroke-width="${2 * k}" fill="none"/>`,
  star: (k, c) => `<path d="${sc('M8 1.2 L10.1 5.6 L14.9 6.2 L11.4 9.5 L12.3 14.3 L8 12 L3.7 14.3 L4.6 9.5 L1.1 6.2 L5.9 5.6 Z', k)}" fill="${c}"/>`,
  starO: (k, c) => `<path d="${sc('M8 1.2 L10.1 5.6 L14.9 6.2 L11.4 9.5 L12.3 14.3 L8 12 L3.7 14.3 L4.6 9.5 L1.1 6.2 L5.9 5.6 Z', k)}" stroke="${c}" stroke-width="${1.4 * k}" fill="none"/>`,
  dice: (k, c) => `<rect x="${2 * k}" y="${2 * k}" width="${12 * k}" height="${12 * k}" rx="${2.5 * k}" stroke="${c}" stroke-width="${1.6 * k}"/>${[[5.3, 5.3], [10.7, 5.3], [8, 8], [5.3, 10.7], [10.7, 10.7]].map(([x, y]) => `<circle cx="${x * k}" cy="${y * k}" r="${1.25 * k}" fill="${c}"/>`).join('')}`,
  list: (k, c) => `${[3, 7, 11].map((y) => `<rect x="${2 * k}" y="${y * k}" width="${2 * k}" height="${2 * k}" fill="${c}"/>`).join('')}<path d="${sc('M6 4 H14 M6 8 H14 M6 12 H14', k)}" stroke="${c}" stroke-width="${1.8 * k}"/>`,
  person: (k, c) => `<circle cx="${8 * k}" cy="${5 * k}" r="${3 * k}" stroke="${c}" stroke-width="${1.8 * k}"/><path d="${sc('M2.5 14.5 C2.5 11 5 9.5 8 9.5 C11 9.5 13.5 11 13.5 14.5', k)}" stroke="${c}" stroke-width="${1.8 * k}"/>`,
  vs: (k, c) => `<path d="${sc('M2 2 L9.5 9.5 M14 2 L6.5 9.5 M3 9 L7 13 M13 9 L9 13 M4.5 11.5 L2 14 M11.5 11.5 L14 14', k)}" stroke="${c}" stroke-width="${1.8 * k}"/>`,
  left: (k, c) => `<path d="${sc('M11 3 L5 8 L11 13 Z', k)}" fill="${c}"/>`,
  right: (k, c) => `<path d="${sc('M5 3 L11 8 L5 13 Z', k)}" fill="${c}"/>`,
  up: (k, c) => `<path d="${sc('M3 11 L8 5 L13 11 Z', k)}" fill="${c}"/>`,
  down: (k, c) => `<path d="${sc('M3 5 L8 11 L13 5 Z', k)}" fill="${c}"/>`,
  plus: (k, c) => `<path d="${sc('M8 3 V13 M3 8 H13', k)}" stroke="${c}" stroke-width="${2.2 * k}"/>`,
  x: (k, c) => `<path d="${sc('M4 4 L12 12 M12 4 L4 12', k)}" stroke="${c}" stroke-width="${2 * k}"/>`,
  sun: (k, c) => `<circle cx="${8 * k}" cy="${8 * k}" r="${3 * k}" stroke="${c}" stroke-width="${1.8 * k}"/><path d="${sc('M8 1 V2.8 M8 13.2 V15 M1 8 H2.8 M13.2 8 H15 M3 3 L4.3 4.3 M11.7 11.7 L13 13 M13 3 L11.7 4.3 M4.3 11.7 L3 13', k)}" stroke="${c}" stroke-width="${1.6 * k}"/>`,
  moon: (k, c) => `<path d="${sc('M13.5 10.5 C11 13.5 6 13 3.8 10 C1.8 7.2 2.5 3.2 5.5 1.5 C4.5 4.5 5.8 8 8.5 9.5 C10 10.4 12 10.8 13.5 10.5 Z', k)}" fill="${c}"/>`,
  sound: (k, c) => `<path d="${sc('M2 6 H5 L9 2.5 V13.5 L5 10 H2 Z', k)}" fill="${c}"/><path d="${sc('M11 5.5 C12 6.5 12 9.5 11 10.5 M12.8 3.8 C14.8 5.8 14.8 10.2 12.8 12.2', k)}" stroke="${c}" stroke-width="${1.5 * k}"/>`,
  sort: (k, c) => `<path d="${sc('M5 2 V13 M2 10 L5 13 L8 10 M11 14 V3 M8 6 L11 3 L14 6', k)}" stroke="${c}" stroke-width="${1.6 * k}"/>`,
  filter: (k, c) => `<path d="${sc('M2 3 H14 L9.5 8.5 V13 L6.5 14.5 V8.5 Z', k)}" stroke="${c}" stroke-width="${1.6 * k}" stroke-linejoin="round"/>`,
  play: (k, c) => `<path d="${sc('M5 3 L12 8 L5 13 Z', k)}" fill="${c}"/>`,
  eraser: (k, c) => `<path d="${sc('M3 10 L9 4 L13 8 L8 13 H5 Z M6.5 6.5 L10.5 10.5 M8 13 H14', k)}" stroke="${c}" stroke-width="${1.5 * k}" stroke-linejoin="round"/>`,
  ball: (k, c) => `<circle cx="${8 * k}" cy="${8 * k}" r="${6.5 * k}" stroke="${c}" stroke-width="${1.6 * k}"/><path d="${sc('M1.5 8 H5.6 M10.4 8 H14.5', k)}" stroke="${c}" stroke-width="${1.6 * k}"/><circle cx="${8 * k}" cy="${8 * k}" r="${2.2 * k}" stroke="${c}" stroke-width="${1.6 * k}"/>`,
};
export const icon = (nome, s = 16, cor = '#13311f') =>
  `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" fill="none" xmlns="http://www.w3.org/2000/svg">${ICONES[nome](s / 16, cor)}</svg>`;

export const pokeball = (s = 28) => {
  const k = s / 28;
  const vermelho = modo.wf ? '#cfcfcf' : '#dc0a2d';
  const linha = modo.wf ? '#555555' : '#1b2130';
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg"><circle cx="${14 * k}" cy="${14 * k}" r="${12 * k}" fill="#ffffff" stroke="${linha}" stroke-width="${2.4 * k}"/><path d="${sc('M2 14 C2 7.4 7.4 2 14 2 C20.6 2 26 7.4 26 14 Z', k)}" fill="${vermelho}" stroke="${linha}" stroke-width="${2.4 * k}"/><circle cx="${14 * k}" cy="${14 * k}" r="${4.2 * k}" fill="#ffffff" stroke="${linha}" stroke-width="${2.4 * k}"/></svg>`;
};

/* ---------------- chips e barras ---------------- */
export const chip = (t, lg = false) => {
  const cor = CORES_TIPO[t.name];
  return `<span class="chip${lg ? ' lg' : ''}" style="background:${cor};color:${tinta(cor)}">${up(t.name)}</span>`;
};
export const segs = (v, n, w, h, cor) => {
  const on = Math.max(1, Math.round((v / 255) * n));
  return `<span class="segs">${Array.from({ length: n }, (_, i) => `<i${i < on ? ' class="on"' : ''} style="width:${w}px;height:${h}px${i < on ? `;background:${cor}` : ''}"></i>`).join('')}</span>`;
};


/* ---------------- carcaça (SVG em pixels, sem escala de viewBox) ---------------- */
let seq = 0;
const novoId = () => `p${++seq}`;
const PLASTICO = { topo: '#ec2843', meio: '#dc0a2d', base: '#b5021f', parede: ['#9a001c', '#4a000d'] };

// Peça de plástico com volume: parede embaixo, luz vindo do alto à esquerda e borda chanfrada.
function casca({ w, h, face, parede, t = 12, dentro = () => '', fora = () => '' }) {
  const c = C();
  const svg = (corpo) => `<svg class="abs" style="left:0;top:0" width="${w}" height="${h + t}" viewBox="0 0 ${w} ${h + t}" xmlns="http://www.w3.org/2000/svg">${corpo}</svg>`;
  if (modo.wf) return svg(`<path d="${parede}" fill="${c.deep}"/><path d="${face}" fill="${c.shell}" stroke="${c.outline}" stroke-width="2"/>${dentro('')}`);
  const k = novoId();
  const p = PLASTICO;
  return svg(`<defs>
<linearGradient id="${k}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.topo}"/><stop offset=".42" stop-color="${p.meio}"/><stop offset="1" stop-color="${p.base}"/></linearGradient>
<linearGradient id="${k}l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".16" stop-color="#fff" stop-opacity="0"/><stop offset=".84" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
<radialGradient id="${k}s" cx=".24" cy=".08" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="${k}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".12" stop-color="#fff" stop-opacity=".18"/><stop offset=".85" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
<linearGradient id="${k}w" gradientUnits="userSpaceOnUse" x1="0" y1="${h - 6}" x2="0" y2="${h + t}"><stop offset="0" stop-color="${p.parede[0]}"/><stop offset="1" stop-color="${p.parede[1]}"/></linearGradient>
<radialGradient id="${k}m" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#c9cdd3"/><stop offset="1" stop-color="#6f757d"/></radialGradient>
<clipPath id="${k}c"><path d="${face}"/></clipPath>
</defs>
<path d="${parede}" fill="url(#${k}w)"/>
<path d="${face}" fill="url(#${k}f)"/>
<g clip-path="url(#${k}c)"><path d="${face}" fill="url(#${k}l)"/><path d="${face}" fill="url(#${k}s)"/>${dentro(k)}<path d="${face}" fill="none" stroke="url(#${k}b)" stroke-width="5"/></g>
${fora(k)}`);
}

// Sulco moldado: sombra em cima, fundo escuro e luz na borda de baixo.
const sulcoSvg = (linha) => (modo.wf
  ? `<path d="${linha(0)}" stroke="${C().ink}" stroke-width="3" fill="none"/>`
  : `<path d="${linha(-1.5)}" stroke="#7a0016" stroke-opacity=".35" stroke-width="3" fill="none"/><path d="${linha(0)}" stroke="#4f000e" stroke-width="2.4" fill="none"/><path d="${linha(2.2)}" stroke="#ff9aa7" stroke-opacity=".55" stroke-width="1.4" fill="none"/>`);

const parafuso = (k, x, y, r) => {
  const a = +(r * 0.55).toFixed(1);
  return `<circle cx="${x}" cy="${y + 1}" r="${r + 1.5}" fill="#4a000d" opacity=".55"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${k}m)" stroke="#5e0012" stroke-width=".8"/><path d="M${x - a} ${y - a} L${x + a} ${y + a} M${x + a} ${y - a} L${x - a} ${y + a}" stroke="#4b5057" stroke-width="1.3"/>`;
};
const parafusos = (pontos, r) => (k) => (r && !modo.wf ? pontos.map(([x, y]) => parafuso(k, x, y, r)).join('') : '');

const pathCorpo = ({ w, h, hi, diag, step, r }, dy = 0) =>
  `M${r} ${dy} H${hi} L${diag} ${step + dy} H${w - 8} Q${w} ${step + dy} ${w} ${step + 8 + dy} V${h - 8 + dy} Q${w} ${h + dy} ${w - 8} ${h + dy} H${r} Q0 ${h + dy} 0 ${h - r + dy} V${r + dy} Q0 ${dy} ${r} ${dy} Z`;

export function svgCorpo(g) {
  const { w, h, hi, diag, step, sulco } = g;
  const t = 12;
  const linha = (dy) => `M0 ${sulco + dy} H${hi} L${diag} ${sulco + step + dy} H${w}`;
  const r = w < 200 ? 0 : Math.max(4, Math.round(w / 110));
  const m = Math.round(r * 2.8);
  return casca({ w, h, t, face: pathCorpo(g), parede: pathCorpo(g, t), dentro: () => sulcoSvg(linha),
    fora: parafusos([[m, h - m], [w - m, h - m], [w - m, step + m]], r) });
}

const pathTampa = ({ w, h, low, diag, step, r }, dy = 0) =>
  `M8 ${step + dy} H${low} L${diag} ${dy} H${w - r} Q${w} ${dy} ${w} ${r + dy} V${h - r + dy} Q${w} ${h + dy} ${w - r} ${h + dy} H8 Q0 ${h + dy} 0 ${h - 8 + dy} V${step + 8 + dy} Q0 ${step + dy} 8 ${step + dy} Z`;

export function svgTampa(g) {
  const { w, h } = g;
  const r = w < 200 ? 0 : Math.max(4, Math.round(w / 100));
  const m = Math.round(r * 2.8);
  return casca({ w, h, face: pathTampa(g), parede: pathTampa(g, 12), fora: parafusos([[m, h - m], [w - m, h - m]], r) });
}

export function svgPlaca({ w, h, r = 24, chanfro = 40 }) {
  const d = (dy) => `M${r} ${dy} H${w - r} Q${w} ${dy} ${w} ${r + dy} V${h - chanfro + dy} L${w - chanfro} ${h + dy} H${r} Q0 ${h + dy} 0 ${h - r + dy} V${r + dy} Q0 ${dy} ${r} ${dy} Z`;
  return casca({ w, h, face: d(0), parede: d(12) });
}

// Moldura cinza em relevo: sombra projetada, espessura e borda iluminada.
export function svgMoldura(x, y, w, h, chanfro = 40) {
  const c = C();
  const r = 10;
  const d = (dy) => `M${r} ${1 + dy} H${w - r} Q${w - 1} ${1 + dy} ${w - 1} ${r + dy} V${h - r + dy} Q${w - 1} ${h - 1 + dy} ${w - r} ${h - 1 + dy} H${chanfro} L1 ${h - chanfro + dy} V${r + dy} Q1 ${1 + dy} ${r} ${1 + dy} Z`;
  const abre = (H) => `<svg class="abs" style="left:${x}px;top:${y}px" width="${w}" height="${H}" viewBox="0 0 ${w} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  if (modo.wf) return `${abre(h + 4)}<path d="${d(4)}" fill="#d6d6d6" opacity="0.6"/><path d="${d(0)}" fill="${c.bezel}" stroke="${c.bezelDark}" stroke-width="2"/></svg>`;
  const k = novoId();
  return `${abre(h + 14)}<defs>
<linearGradient id="${k}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbfbfb"/><stop offset=".5" stop-color="#e2e2e2"/><stop offset="1" stop-color="#cbcbcb"/></linearGradient>
<linearGradient id="${k}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".1" stop-color="#fff" stop-opacity=".3"/><stop offset=".9" stop-color="#000" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
<filter id="${k}x" x="-5%" y="-5%" width="110%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>
<clipPath id="${k}c"><path d="${d(0)}"/></clipPath>
</defs>
<path d="${d(8)}" fill="#3d000b" opacity=".45" filter="url(#${k}x)"/>
<path d="${d(4)}" fill="#8f8f8f"/>
<path d="${d(0)}" fill="url(#${k}f)"/>
<g clip-path="url(#${k}c)"><path d="${d(0)}" fill="none" stroke="url(#${k}b)" stroke-width="4"/></g>
</svg>`;
}

// Capa fechada: painel e emblema rebaixados, trava e frestinha no encaixe com o corpo.
export function svgCapa(g, emblema) {
  const { w, h, hi, diag, step, r, sulco } = g;
  const face = (dy) => `M0 ${sulco + dy} H${hi} L${diag} ${sulco + step + dy} H${w} V${h - 8 + dy} Q${w} ${h + dy} ${w - 8} ${h + dy} H${r} Q0 ${h + dy} 0 ${h - r + dy} Z`;
  const i = 14;
  const painel = (dy) => `M${i} ${sulco + i + dy} H${hi - 6} L${diag - 6} ${sulco + step + i + dy} H${w - i} V${h - i - 6 + dy} Q${w - i} ${h - i + dy} ${w - i - 6} ${h - i + dy} H${r} Q${i} ${h - i + dy} ${i} ${h - r + dy} Z`;
  const bola = (dy, cor, op) => (emblema
    ? `<g stroke="${cor}" stroke-width="5" fill="none" opacity="${op}"><circle cx="${w / 2}" cy="${emblema.cy + dy}" r="${emblema.r}"/><path d="M${w / 2 - emblema.r} ${emblema.cy + dy} H${w / 2 - emblema.r * 0.32} M${w / 2 + emblema.r * 0.32} ${emblema.cy + dy} H${w / 2 + emblema.r}"/><circle cx="${w / 2}" cy="${emblema.cy + dy}" r="${emblema.r * 0.3}"/></g>`
    : '');
  const ty = Math.round(h * 0.52);
  const trava = emblema ? `<rect x="${w - 13}" y="${ty}" width="9" height="70" rx="4" fill="#4f000e"/><rect x="${w - 11}" y="${ty + 3}" width="2" height="64" rx="1" fill="#ff9aa7" opacity=".5"/>` : '';
  if (modo.wf) {
    const c = C();
    return `<svg class="abs" style="left:0;top:0" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><path d="${face(0)}" fill="${c.shell}" stroke="${c.ink}" stroke-width="3"/><path d="${painel(0)}" fill="none" stroke="${c.ink}" stroke-width="2" opacity="0.45"/>${bola(0, c.ink, 0.4)}</svg>`;
  }
  return casca({ w, h, face: face(0), parede: face(12),
    dentro: () => `<path d="${painel(1.6)}" fill="none" stroke="#ff9aa7" stroke-width="2" opacity=".45"/><path d="${painel(0)}" fill="none" stroke="#5a0010" stroke-width="2" opacity=".55"/>${bola(1.8, '#ff9aa7', 0.45)}${bola(0, '#5a0010', 0.6)}${trava}`,
    fora: () => `<path d="M0 ${sulco - 1} H${hi} L${diag} ${sulco + step - 1} H${w}" stroke="#3d000b" stroke-width="2" opacity=".6" fill="none"/>` });
}

/* ---------------- peças ---------------- */
export const lente = (x, y, d) => {
  const b = Math.round(d * 0.82);
  const l = Math.round(d * 0.68);
  const ob = Math.round((d - b) / 2);
  const ol = Math.round((d - l) / 2);
  return `<div class="lens-ring" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px"></div><div class="lens-bezel" style="left:${x + ob}px;top:${y + ob}px;width:${b}px;height:${b}px"></div><div class="lens" style="left:${x + ol}px;top:${y + ol}px;width:${l}px;height:${l}px"><i class="g1"></i><i class="g2"></i><i class="g3"></i></div>`;
};
export const leds = (x, y, d, gap, ligados = true) =>
  ['red', 'yellow', 'green'].map((cor, i) => `<div class="led ${ligados ? cor : 'off'}" style="left:${x + i * (d + gap)}px;top:${y}px;width:${d}px;height:${d}px"></div>`).join('');

// Cruz direcional em relevo, encaixada num rebaixo redondo, com setas moldadas.
export const dpad = (x, y, s) => {
  const t = s / 3;
  const rr = Math.round(t * 0.22);
  const a = t, b = 2 * t, c = 3 * t;
  const cruz = (dy) => {
    const Y = (v) => +(v + dy).toFixed(1);
    return `M${a + rr} ${Y(0)} H${b - rr} Q${b} ${Y(0)} ${b} ${Y(rr)} V${Y(a)} H${c - rr} Q${c} ${Y(a)} ${c} ${Y(a + rr)} V${Y(b - rr)} Q${c} ${Y(b)} ${c - rr} ${Y(b)} H${b} V${Y(c - rr)} Q${b} ${Y(c)} ${b - rr} ${Y(c)} H${a + rr} Q${a} ${Y(c)} ${a} ${Y(c - rr)} V${Y(b)} H${rr} Q0 ${Y(b)} 0 ${Y(b - rr)} V${Y(a + rr)} Q0 ${Y(a)} ${rr} ${Y(a)} H${a} V${Y(rr)} Q${a} ${Y(0)} ${a + rr} ${Y(0)} Z`;
  };
  const q = +(t * 0.2).toFixed(1);
  const tri = (cx, cy, dir, dy) => {
    const p = {
      up: [[cx - q, cy + q * 0.6], [cx + q, cy + q * 0.6], [cx, cy - q * 0.7]],
      down: [[cx - q, cy - q * 0.6], [cx + q, cy - q * 0.6], [cx, cy + q * 0.7]],
      left: [[cx + q * 0.6, cy - q], [cx + q * 0.6, cy + q], [cx - q * 0.7, cy]],
      right: [[cx - q * 0.6, cy - q], [cx - q * 0.6, cy + q], [cx + q * 0.7, cy]],
    }[dir];
    return `M${p.map(([px, py]) => `${+px.toFixed(1)} ${+(py + dy).toFixed(1)}`).join(' L')} Z`;
  };
  const setas = (dy) => [[1.5 * t, 0.48 * t, 'up'], [1.5 * t, 2.52 * t, 'down'], [0.48 * t, 1.5 * t, 'left'], [2.52 * t, 1.5 * t, 'right']].map(([cx, cy, d]) => tri(cx, cy, d, dy)).join(' ');
  const poco = Math.round(s * 0.08);
  const abre = `<svg class="abs" style="left:${x - 6}px;top:${y - 4}px" width="${s + 12}" height="${s + 20}" viewBox="0 0 ${s + 12} ${s + 20}" xmlns="http://www.w3.org/2000/svg">`;
  if (modo.wf) return `${abre}<g transform="translate(6 4)"><path d="${cruz(0)}" fill="#ffffff" stroke="#8a8a8a" stroke-width="1.5"/><path d="${setas(0)}" fill="#8a8a8a"/></g></svg>`;
  const k = novoId();
  return `<div class="dpad-well" style="left:${x - poco}px;top:${y - poco}px;width:${s + 2 * poco}px;height:${s + 2 * poco}px"></div>${abre}<defs>
<linearGradient id="${k}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f5861"/><stop offset=".5" stop-color="#2c3238"/><stop offset="1" stop-color="#1a1d21"/></linearGradient>
<linearGradient id="${k}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".2" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
<radialGradient id="${k}d" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#101215"/><stop offset=".7" stop-color="#22272c"/><stop offset="1" stop-color="#3d444c"/></radialGradient>
<filter id="${k}x" x="-10%" y="-10%" width="120%" height="130%"><feGaussianBlur stdDeviation="3"/></filter>
<clipPath id="${k}c"><path d="${cruz(0)}"/></clipPath>
</defs><g transform="translate(6 4)">
<path d="${cruz(9)}" fill="#1a0004" opacity=".55" filter="url(#${k}x)"/>
<path d="${cruz(5)}" fill="#07080a"/>
<path d="${cruz(0)}" fill="url(#${k}f)"/>
<g clip-path="url(#${k}c)"><path d="${cruz(0)}" fill="none" stroke="url(#${k}b)" stroke-width="4"/></g>
<circle cx="${1.5 * t}" cy="${1.5 * t}" r="${+(t * 0.34).toFixed(1)}" fill="url(#${k}d)"/>
<circle cx="${1.5 * t}" cy="${1.5 * t + 1}" r="${+(t * 0.34).toFixed(1)}" fill="none" stroke="#ffffff" stroke-opacity=".12" stroke-width="1.2"/>
<path d="${setas(1.2)}" fill="#ffffff" fill-opacity=".16"/>
<path d="${setas(0)}" fill="#0e1012"/>
</g></svg>`;
};

// Tecla com encaixe rebaixado, parede, sombra e LED; a ativa fica afundada com o LED aceso.
export const tecla = (x, y, w, h, rotulo, ic, on = false, fonte = 10) =>
  `<div class="key-well" style="left:${x - 3}px;top:${y - 3}px;width:${w + 6}px;height:${h + 10}px"></div><div class="key${on ? ' on' : ''}" style="left:${x}px;top:${y + (on ? 3 : 0)}px;width:${w}px;height:${h}px;font-size:${fonte}px"><i class="key-led"></i>${ic ? icon(ic, h > 36 ? 13 : 11, '#ffffff') : ''}<span>${rotulo}</span></div>`;

export const TECLAS = [
  ['POKÉDEX', 'list', 'pokedex'], ['TREINAD.', 'person', 'treinadores'], ['COMPARAR', 'vs', 'comparar'], ['FAVORIT.', 'star', 'favoritos'], ['ALEATÓR.', 'dice', 'aleatorio'],
  ['ANT.', 'left'], ['PRÓX.', 'right'], ['MARCAR', 'starO'], ['+ VS', 'plus'], ['LIMPAR', 'eraser'],
];

// Chave deslizante (tema e som): trilho rebaixado, botão com frisos e legendas nas pontas.
export const interruptor = (x, y, { rotulo, esq, dir, on = true, w = 52, h = 22, L = 40 }) => {
  const kw = Math.round(w * 0.5);
  const temLegenda = esq !== undefined;
  const ty = temLegenda ? y + 13 : y;
  const legenda = temLegenda
    ? `<div class="switch-legend" style="left:${x + L}px;top:${y}px;width:${w}px"><span${on ? '' : ' class="on"'}>${esq}</span><span${on ? ' class="on"' : ''}>${dir}</span></div>`
    : '';
  return `${legenda}<div class="switch-label" style="left:${x}px;top:${ty}px;width:${L - 6}px;height:${h}px">${rotulo}</div><div class="switch-track" style="left:${x + L}px;top:${ty}px;width:${w}px;height:${h}px"><div class="switch-knob" style="left:${on ? w - kw - 3 : 3}px;top:3px;width:${kw}px;height:${h - 6}px"><i></i><i></i><i></i></div></div>`;
};

export const verdeDisplay = (x, y, w, h, l1, l2, fonte = 22) =>
  `<div class="green-display" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><b style="font-size:${fonte}px">${l1}</b><span>${l2}</span></div>`;
export const miniDisplay = (x, y, w, h, rot, val) =>
  `<div class="mini-display" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><small>${rot}</small><b>${val}</b></div>`;
export const dobradica = (x, y, w, h, vertical = true) =>
  `<div class="hinge ${vertical ? 'v' : 'h'}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><i></i><i></i><i></i></div>`;
export const rotulo = (x, y, w, txt) => `<div class="ctrl-label" style="left:${x}px;top:${y}px;width:${w}px">${txt}</div>`;
export const alto = (x, y, w) => `<div class="speaker" style="left:${x}px;top:${y}px;width:${w}px"><i></i><i></i><i></i><i></i></div>`;
export const bola = (cls, x, y, d) => `<div class="${cls}" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px"></div>`;
export const botaoRedondo = (x, y, d) => {
  const p = Math.round(d * 0.1);
  return `<div class="round-well" style="left:${x - p}px;top:${y - p}px;width:${d + 2 * p}px;height:${d + 2 * p + 3}px"></div><div class="round-btn" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px"></div>`;
};
export const pilula = (cor, x, y, w, h) =>
  `<div class="pill-well" style="left:${x - 3}px;top:${y - 3}px;width:${w + 6}px;height:${h + 8}px"></div><div class="pill ${cor}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`;
