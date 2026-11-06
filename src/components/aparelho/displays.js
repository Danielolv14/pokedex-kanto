import { rotuloOrdem } from '../lcd/Ordenacao';
import { descreverFiltro } from '../tampa/TelaTampa';
import { milhar, pad3, plural, total, up } from '../../data/dados';

// Textos do display verde e dos mostradores pretos, derivados do estado atual.
export function textosDisplays(pk, mobile) {
  const { modo, lista, listaTr, selecionado, treinador, comparados, favoritos, filtrando, busca, tipo, ordem } = pk;
  const [a, b] = comparados;

  if (modo === 'treinadores') {
    const linha2 = treinador ? (mobile ? `${up(treinador.name)} ABERTO` : `${up(treinador.name)} · ${treinador.badges} INSÍG.`) : mobile ? 'TOQUE UM CARD' : '---';
    return {
      verde: [`${listaTr.length} TREINAD.`, linha2],
      minis: treinador ? [['EQUIPE', `${treinador.pokemonIds.length} POKÉMON`], ['TOTAL', milhar(treinador.soma)]] : [['EQUIPE', '---'], ['TOTAL', '---']],
      numero: '---',
    };
  }

  if (modo === 'comparar') {
    return {
      verde: [`A: ${a ? up(a.name) : '---'}`, `B: ${b ? up(b.name) : '---'}`],
      minis: [['A · TOTAL', a ? String(total(a)) : '---'], ['B · TOTAL', b ? String(total(b)) : '---']],
      numero: a && b ? `${pad3(a.id)} × ${pad3(b.id)}` : '---',
    };
  }

  let contagem;
  if (filtrando) contagem = mobile ? `${lista.length} DE 151` : plural(lista.length, 'ENCONTRADO', 'ENCONTRADOS');
  else contagem = modo === 'favoritos' ? plural(lista.length, 'FAVORITO', 'FAVORITOS') : `${lista.length} POKÉMON`;

  let linha2;
  if (selecionado) linha2 = mobile ? up(selecionado.name) : `Nº ${pad3(selecionado.id)} ${up(selecionado.name)}`;
  else if (filtrando) linha2 = descreverFiltro(busca, tipo).replace('BUSCA ', '');
  else linha2 = mobile ? 'CRUZ ↑↓' : 'USE A CRUZ ↑↓';

  let minis;
  if (mobile && selecionado) minis = [['TOTAL', String(total(selecionado))], ['FAVORITO', favoritos.has(selecionado.id) ? 'SIM' : 'NÃO']];
  else if (selecionado) minis = [['Nº', `${pad3(selecionado.id)} / 151`], ['TOTAL', String(total(selecionado))]];
  else minis = [['FAVORITOS', String(favoritos.size)], ['ORDEM', rotuloOrdem(ordem)]];

  return { verde: [contagem, linha2], minis, numero: selecionado ? `${pad3(selecionado.id)} / 151` : '---' };
}
