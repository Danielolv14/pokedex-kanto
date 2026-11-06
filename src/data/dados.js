import dados from './pokedex-data.json';

export const TYPELESS = dados.types.find((t) => t.id === 0);

export const pokemons = dados.pokemon.map((p) => ({
  ...p,
  types: p.types.length ? p.types : [TYPELESS],
}));
export const porId = new Map(pokemons.map((p) => [p.id, p]));
export const TOTAL_POKEMON = pokemons.length;

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

export const STATS = [
  { key: 'hp', curto: 'HP', longo: 'HP', cor: '#ff5959' },
  { key: 'attack', curto: 'ATQ', longo: 'ATAQUE', cor: '#f5ac78' },
  { key: 'defense', curto: 'DEF', longo: 'DEFESA', cor: '#fae078' },
  { key: 'specialAttack', curto: 'AT.E', longo: 'AT. ESP', cor: '#9db7f5' },
  { key: 'specialDefense', curto: 'DF.E', longo: 'DEF. ESP', cor: '#a7db8d' },
  { key: 'speed', curto: 'VEL', longo: 'VELOC.', cor: '#fa92b2' },
];

export const ORDENS = [
  { campo: 'id', rotulo: 'Nº' },
  { campo: 'name', rotulo: 'NOME' },
  { campo: 'total', rotulo: 'TOTAL' },
  ...STATS.map((s) => ({ campo: s.key, rotulo: s.longo })),
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
  return {
    ...t,
    equipe,
    tipo: tipoDominante(equipe),
    iniciais: t.name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2),
    soma: t.pokemonIds.reduce((a, id) => a + total(porId.get(id)), 0),
  };
});

export const treinadoresDe = (id) => treinadores.filter((t) => t.pokemonIds.includes(id));

export const pad3 = (n) => String(n).padStart(3, '0');
export const up = (s) => s.toUpperCase();
export const milhar = (n) => n.toLocaleString('pt-BR');

const lum = (hex) => {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contraste = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
export const tinta = (hex) => (contraste(lum(hex), 1) >= contraste(lum(hex), lum('#1a1a1a')) ? '#ffffff' : '#1a1a1a');

export const rgba = (hex, a) => `rgba(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',')},${a})`;

const normalizar = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export function filtrar(lista, { busca, tipo, ids }) {
  const q = normalizar(busca).replace(/^(#|n[ºo°]\s*)/, '');
  const numerico = /^\d+$/.test(q);
  return lista.filter((p) => {
    if (ids && !ids.has(p.id)) return false;
    if (tipo && !p.types.some((t) => t.name === tipo)) return false;
    if (!q) return true;
    if (numerico) return String(p.id).startsWith(String(Number(q))) || pad3(p.id).startsWith(q);
    return normalizar(p.name).includes(q);
  });
}

export function ordenar(lista, { campo, desc }) {
  const valor = (p) => (campo === 'id' ? p.id : campo === 'name' ? p.name : campo === 'total' ? total(p) : p.stats[campo]);
  const s = [...lista].sort((a, b) => {
    const va = valor(a);
    const vb = valor(b);
    const r = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
    return r || a.id - b.id;
  });
  return desc ? s.reverse() : s;
}
