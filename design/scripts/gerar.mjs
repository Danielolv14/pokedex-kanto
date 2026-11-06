// Gera os HTMLs que vão para o Figma (html_to_figma, um frame por .screen).
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { raiz, ler, modo, pokemons, porId, treinadores, total } from './lib.mjs';
import * as T from './telas.mjs';
import { moodboard, folhaTokens, lerTokens } from './referencia.mjs';

const estilos = async (wf) =>
  (await Promise.all(['assets/fonts/embutidas.css', 'src/tokens.css', 'src/pokedex.css', 'src/tela-secundaria.css', 'src/referencia.css', 'src/wireframe.css'].map(ler))).join('\n') +
  (wf ? '' : '');

const quadro = (nome, w, h, html) =>
  `<section class="screen${modo.wf ? ' wf' : ''}" data-name="${nome}" style="width:${w}px;height:${h}px">${modo.wf ? `<div class="wf-tag">LOW-FI · ${nome}</div>` : ''}${html}</section>`;

const charFire = pokemons.filter((p) => p.name.toLowerCase().includes('char') && p.types.some((t) => t.name === 'Fire'));
const ash = treinadores[0];
const somaAsh = ash.equipe.reduce((a, { p, n }) => a + total(p) * n, 0).toLocaleString('pt-BR');
const [venu, chari, blast] = [porId.get(3), porId.get(6), porId.get(9)];

const ESTADOS = [
  ['01 Tela principal', 'principal', (v) => T.telaResumo(pokemons, v), 'pokedex', ['151 POKÉMON', 'MOSTRANDO 001-007'], [['SELECIONADO', '---'], ['FAVORITOS', '3']]],
  ['02 Busca + filtro', 'busca', (v) => T.telaResumo(charFire, v, { titulo: 'RESULTADO DA BUSCA', info: 'BUSCA "CHAR" · TIPO FIRE · 3 DE 151' }), 'pokedex', ['3 ENCONTRADOS', 'BUSCA: CHAR'], [['FILTRO', 'FIRE'], ['ORDEM', 'Nº CRESCENTE']]],
  ['03 Nenhum resultado', 'vazio', () => T.telaSemSinal(), 'pokedex', ['0 ENCONTRADOS', 'TENTE OUTRA BUSCA'], [['SELECIONADO', '---'], ['RESULTADOS', '0']]],
  ['04 Detalhes', 'detalhes', (v) => T.telaDetalhes(venu, v), 'pokedex', ['Nº 003', 'VENUSAUR'], [['Nº', '003 / 151'], ['TOTAL', String(total(venu))]]],
  ['05 Treinadores', 'treinadores', (v) => T.telaTreinador(ash, v), 'treinadores', ['12 TREINADORES', 'ASH · 9 INSÍGNIAS'], [['EQUIPE', '6 POKÉMON'], ['TOTAL', somaAsh]]],
  ['06 Comparar', 'comparar', (v) => T.telaComparar(chari, blast, v), 'comparar', ['A: CHARIZARD', 'B: BLASTOISE'], [['A · TOTAL', String(total(chari))], ['B · TOTAL', String(total(blast))]]],
];

function desktop(fechado) {
  const lista = ESTADOS.map(([nome, lcd, s2, ativo, gd, mini]) =>
    quadro(`Desktop / ${nome}`, 1440, 900, T.cabecalhoApp(100, 18, 1240) + T.aparelhoDesktop({ lcd: T.LCD[lcd]('desk'), s2: s2('desk'), ativo, gd, mini })));
  return fechado ? [quadro('Desktop / 00 Abertura (fechada)', 1440, 900, T.cabecalhoApp(100, 18, 1240) + T.aparelhoDesktopFechado()), ...lista] : lista;
}

function tablet() {
  return ESTADOS.map(([nome, lcd, s2, ativo, gd, mini]) =>
    quadro(`Tablet / ${nome}`, 768, 1024, T.aparelhoTablet({ lcd: T.LCD[lcd]('tab'), s2: s2('tab'), ativo, gd, mini })));
}

function mobile(fechado) {
  const corpo = (nome, lcd, ativo, gd) => quadro(`Mobile / ${nome}`, 390, 844, T.aparelhoMobile({ lcd, ativo, gd }));
  const tampa = (nome, s2, ativo, num, mini) => quadro(`Mobile / ${nome}`, 390, 844, T.tampaMobile({ s2, ativo, num, mini }));
  const lista = [
    corpo('01 Tela principal', T.LCD_MOB.principal(), 'pokedex', ['151 POKÉMON', 'Nº 001 A 005']),
    corpo('02 Busca + filtro', T.LCD_MOB.busca(), 'pokedex', ['3 DE 151', 'CHAR · FIRE']),
    corpo('03 Nenhum resultado', T.LCD_MOB.vazio(), 'pokedex', ['0 DE 151', 'LIMPE A BUSCA']),
    tampa('04 Detalhes', T.telaDetalhes(venu, 'mob'), 'pokedex', '003 / 151', [['TOTAL', String(total(venu))], ['FAVORITO', 'NÃO']]),
    corpo('05 Treinadores', T.LCD_MOB.treinadores(), 'treinadores', ['12 TREINAD.', 'ASH ABERTO']),
    tampa('06 Comparar', T.telaComparar(chari, blast, 'mob'), 'comparar', '006 × 009', [['A · TOTAL', String(total(chari))], ['B · TOTAL', String(total(blast))]]),
  ];
  return fechado ? [quadro('Mobile / 00 Abertura (fechada)', 390, 844, T.aparelhoMobileFechado()), ...lista] : lista;
}

const pagina = async (titulo, quadros) =>
  `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${titulo}</title><style>${await estilos()}</style></head><body>${quadros.join('\n')}</body></html>`;

const nomes = (html) => [...html.matchAll(/data-name="([^"]+)"/g)].map((m) => m[1]);

await mkdir(join(raiz, 'out'), { recursive: true });
const tokens = await lerTokens();
const saidas = {};

modo.wf = false;
saidas.referencia = await pagina('Pokédex · Referência', [moodboard(), folhaTokens(tokens)]);
saidas.hifi = await pagina('Pokédex · Hi-fi', [...desktop(true), ...tablet(), ...mobile(true)]);
modo.wf = true;
saidas.wireframes = await pagina('Pokédex · Wireframes', [...desktop(false), ...tablet(), ...mobile(false)]);
modo.wf = false;

const indice = {};
for (const [nome, html] of Object.entries(saidas)) {
  await writeFile(join(raiz, 'out', `${nome}.html`), html);
  indice[nome] = nomes(html);
  console.log(`${nome}.html: ${indice[nome].length} quadros, ${(html.length / 1024 / 1024).toFixed(2)} MB`);
}
await writeFile(join(raiz, 'out', 'quadros.json'), JSON.stringify(indice, null, 2));
await writeFile(join(raiz, 'out', 'tokens.json'), JSON.stringify(tokens, null, 2));
