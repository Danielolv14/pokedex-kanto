// Separa o arquivo da Pokédex em 3 páginas (capa + referência, wireframes, hi-fi),
// alinha os quadros em seções por aparelho e refaz os fluxos do protótipo.
// Pode rodar mais de uma vez: só move o que ainda não está no lugar.

const ROT = ['01 Tela principal', '02 Busca + filtro', '03 Nenhum resultado', '04 Detalhes', '05 Treinadores', '06 Comparar'];
const id = (n) => n + ':2';
const HIFI = {
  D: { 0: id(21), 1: id(22), 2: id(23), 3: id(24), 4: id(25), 5: id(26), 6: id(27) },
  T: { 1: id(28), 2: id(29), 3: id(30), 4: id(31), 5: id(32), 6: id(33) },
  M: { 0: id(34), 1: id(35), 2: id(36), 3: id(37), 4: id(38), 5: id(39), 6: id(40) },
};
const WF = {
  D: { 1: id(3), 2: id(4), 3: id(5), 4: id(6), 5: id(7), 6: id(8) },
  T: { 1: id(9), 2: id(10), 3: id(11), 4: id(12), 5: id(13), 6: id(14) },
  M: { 1: id(15), 2: id(16), 3: id(17), 4: id(18), 5: id(19), 6: id(20) },
};
const DEV = { D: 'Desktop', T: 'Tablet', M: 'Mobile' };
const LARG = { D: '1440', T: '768', M: '390' };
const SEC_HI = { D: '42:660', T: '42:661', M: '42:662' };
const PAD = 120, GAP = 100, VGAP = 200;

const DISS = (d) => ({ type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: d });
const PUSH = (dir) => ({ type: 'PUSH', direction: dir, matchLayers: false, easing: { type: 'EASE_IN_AND_OUT' }, duration: 0.35 });
const reacao = (dest, tr) => ({ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'NODE', destinationId: dest, navigation: 'NAVIGATE', transition: tr, preserveScrollPosition: false }] });
const ALVOS = [
  [(t) => t === 'POKÉDEX', 1],
  [(t) => t === 'TREINAD.', 5],
  [(t) => t === 'COMPARAR' || t === '+ VS', 6],
  [(t) => t === 'LIMPAR' || t === 'LIMPAR BUSCA' || t === 'VOLTAR', 1],
  [(t) => t === 'BUSCAR' || t === 'TIPOS' || t.startsWith('BUSCAR NOME'), 2],
  [(t) => t === 'ALEATÓR.', 4],
  [(t) => t === 'VENUSAUR', 4, 'linha'],
];
const ABAS_MOB = new Set([4, 6]);
const ordem = (m) => Object.keys(m).sort().map((i) => m[i]);

function alvo(txt, frame, modo) {
  let n = txt;
  if (modo === 'linha') {
    while (n.parent && n.parent !== frame && n.width < 260) n = n.parent;
    return n;
  }
  while (n.parent && n.parent !== frame && (n.width < 40 || n.height < 24)) n = n.parent;
  return n.width > 560 || n.height > 160 ? txt : n;
}

async function carregarFontes(ids) {
  const fontes = new Map();
  for (const fid of ids) {
    const f = await figma.getNodeByIdAsync(fid);
    if (!f) continue;
    for (const t of f.findAllWithCriteria({ types: ['TEXT'] })) {
      if (!t.characters.length) continue;
      const lista = t.fontName === figma.mixed ? t.getRangeAllFontNames(0, t.characters.length) : [t.fontName];
      for (const fn of lista) fontes.set(fn.family + '|' + fn.style, fn);
    }
  }
  for (const fn of fontes.values()) await figma.loadFontAsync(fn);
}

async function secao(page, nome, ids, y, secId) {
  let sec = secId ? await figma.getNodeByIdAsync(secId) : page.children.find((n) => n.type === 'SECTION' && n.name === nome);
  if (!sec) sec = figma.createSection();
  if (sec.parent !== page) page.appendChild(sec);
  sec.name = nome;
  let x = PAD, h = 0;
  for (const fid of ids) {
    const f = await figma.getNodeByIdAsync(fid);
    if (f.parent !== sec) sec.appendChild(f);
    f.x = x; f.y = PAD;
    x += f.width + GAP;
    h = Math.max(h, f.height);
  }
  sec.x = 0; sec.y = y;
  sec.resizeWithoutConstraints(x - GAP + PAD, h + PAD + 80);
  return sec;
}

async function prototipo(mapa) {
  let n = 0;
  for (const k of ['D', 'T', 'M']) {
    const telas = mapa[k];
    for (const [iStr, fid] of Object.entries(telas)) {
      const i = Number(iStr);
      const frame = await figma.getNodeByIdAsync(fid);
      if (i === 0) {
        await frame.setReactionsAsync([reacao(telas[1], DISS(0.6))]);
        n++;
        continue;
      }
      const feitos = new Map();
      for (const t of frame.findAllWithCriteria({ types: ['TEXT'] })) {
        const regra = ALVOS.find(([f]) => f(t.characters.trim()));
        if (!regra || regra[1] === i || !telas[regra[1]]) continue;
        const destI = regra[1];
        const no = alvo(t, frame, regra[2]);
        let tr = DISS(0.25);
        if (k === 'M' && ABAS_MOB.has(destI) && !ABAS_MOB.has(i)) tr = PUSH('LEFT');
        else if (k === 'M' && ABAS_MOB.has(i) && !ABAS_MOB.has(destI)) tr = PUSH('RIGHT');
        feitos.set(no.id, [no, reacao(telas[destI], tr)]);
      }
      for (const [no, r] of feitos.values()) await no.setReactionsAsync([r]);
      n += feitos.size;
    }
  }
  return n;
}

async function main() {
  const capa = await figma.getNodeByIdAsync('42:111');
  if (!capa) throw new Error('abra o arquivo "Pokédex" certo (quadro Capa não encontrado)');

  const pgHi = await figma.getNodeByIdAsync('0:1');
  await pgHi.loadAsync();
  const porNome = (n) => figma.root.children.find((p) => p.name === n);
  let pgRef = porNome('01 Capa, referência & tokens');
  if (!pgRef) { pgRef = figma.createPage(); pgRef.name = '01 Capa, referência & tokens'; }
  let pgWf = porNome('02 Wireframes (low-fi)');
  if (!pgWf) { pgWf = figma.createPage(); pgWf.name = '02 Wireframes (low-fi)'; }
  await pgRef.loadAsync();
  await pgWf.loadAsync();
  pgHi.name = '03 Hi-fi + Protótipo';
  figma.root.insertChild(0, pgRef);
  figma.root.insertChild(1, pgWf);

  const todos = ['1:2', '2:2', '42:111', ...Object.values(WF).flatMap(Object.values), ...Object.values(HIFI).flatMap(Object.values)];
  await carregarFontes(todos);

  for (const [k, mapa] of Object.entries(HIFI)) {
    for (const [i, fid] of Object.entries(mapa)) (await figma.getNodeByIdAsync(fid)).name = `${DEV[k]} / ${i === '0' ? '00 Abertura (fechada)' : ROT[i - 1]}`;
  }
  for (const [k, mapa] of Object.entries(WF)) {
    for (const [i, fid] of Object.entries(mapa)) (await figma.getNodeByIdAsync(fid)).name = `${DEV[k]} / ${ROT[i - 1]}`;
  }

  if (capa.parent !== pgRef) pgRef.appendChild(capa);
  capa.x = 120; capa.y = 0;
  await secao(pgRef, 'Decomposição e tokens', ['1:2', '2:2'], 1100, '42:659');

  let y = 0;
  for (const k of ['D', 'T', 'M']) {
    const s = await secao(pgWf, `${DEV[k]} · ${LARG[k]} px`, ordem(WF[k]), y);
    y += s.height + VGAP;
  }
  y = 0;
  for (const k of ['D', 'T', 'M']) {
    const s = await secao(pgHi, `${DEV[k]} · ${LARG[k]} px`, ordem(HIFI[k]), y, SEC_HI[k]);
    y += s.height + VGAP;
  }

  const nWf = await prototipo(WF);
  const nHi = await prototipo(HIFI);
  pgWf.flowStartingPoints = [
    { nodeId: WF.D[1], name: 'Desktop (low-fi)' }, { nodeId: WF.T[1], name: 'Tablet (low-fi)' }, { nodeId: WF.M[1], name: 'Mobile (low-fi)' },
  ];
  pgHi.flowStartingPoints = [
    { nodeId: HIFI.D[0], name: 'Desktop' }, { nodeId: HIFI.T[1], name: 'Tablet' }, { nodeId: HIFI.M[0], name: 'Mobile' },
  ];
  try { await figma.setFileThumbnailNodeAsync(capa); } catch (e) { /* miniatura é opcional */ }

  await figma.setCurrentPageAsync(pgRef);
  figma.viewport.scrollAndZoomIntoView([capa]);
  return `Pronto: 3 páginas, ${nWf} links nos wireframes e ${nHi} no hi-fi.`;
}

main()
  .then((msg) => figma.closePlugin(msg))
  .catch((e) => figma.closePlugin('Erro: ' + e.message));
