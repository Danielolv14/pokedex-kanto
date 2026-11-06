// Baixa fontes (latin, woff2) e sprites usados nos mockups do Figma.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const pasta = (p) => join(raiz, 'assets', p);
const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const ARTES = [1, 3, 4, 6, 7, 9, 25, 65, 94, 130, 143, 149, 150];

const existe = (f) => access(f).then(() => true, () => false);

async function baixar(url, destino) {
  if (await existe(destino)) return;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  await writeFile(destino, Buffer.from(await r.arrayBuffer()));
}

async function fontes() {
  const css = await readFile(pasta('fonts/fonts.css'), 'utf8');
  const blocos = [...css.matchAll(/\/\* latin \*\/\s*@font-face\s*{([^}]*)}/g)].map((m) => m[1]);
  const vistos = new Map();
  for (const b of blocos) {
    const familia = b.match(/font-family:\s*'([^']+)'/)[1];
    const url = b.match(/url\((https:[^)]+)\)/)[1];
    if (!vistos.has(url)) vistos.set(url, familia);
  }
  let saida = '';
  for (const [url, familia] of vistos) {
    const arquivo = pasta(`fonts/${familia.replace(/\s+/g, '')}.woff2`);
    await baixar(url, arquivo);
    const peso = familia === 'Inter' ? '100 900' : '400';
    const b64 = (await readFile(arquivo)).toString('base64');
    saida += `@font-face{font-family:'${familia}';font-style:normal;font-weight:${peso};font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2');}\n`;
  }
  await writeFile(pasta('fonts/embutidas.css'), saida);
  console.log('fontes:', [...vistos.values()].join(', '));
}

async function sprites() {
  await mkdir(pasta('sprites'), { recursive: true });
  await mkdir(pasta('art'), { recursive: true });
  const ids = Array.from({ length: 151 }, (_, i) => i + 1);
  for (let i = 0; i < ids.length; i += 16) {
    await Promise.all(ids.slice(i, i + 16).map((id) => baixar(`${SPRITES}/${id}.png`, pasta(`sprites/${id}.png`))));
  }
  await Promise.all(ARTES.map((id) => baixar(`${SPRITES}/other/official-artwork/${id}.png`, pasta(`art/${id}.png`))));
  console.log('sprites: 151, artes:', ARTES.length);
}

await fontes();
await sprites();
