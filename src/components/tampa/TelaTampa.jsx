import { TelaComparar } from './TelaComparar';
import { TelaDetalhes } from './TelaDetalhes';
import { TelaEscolha } from './TelaEscolha';
import { TelaResumo } from './TelaResumo';
import { TelaSemSinal } from './TelaSemSinal';
import { TelaTreinador } from './TelaTreinador';
import { TOTAL_POKEMON, plural, up } from '../../data/dados';

export const descreverFiltro = (busca, tipo) =>
  [busca.trim() && `BUSCA "${busca.trim().toUpperCase()}"`, tipo && `TIPO ${up(tipo)}`].filter(Boolean).join(' · ');

// Escolhe o que a tela da tampa mostra conforme o modo e a seleção.
export function TelaTampa({ v, pk }) {
  const { modo, lista, selecionado, treinador, comparados, favoritos, filtrando, busca, tipo, acoes } = pk;
  const [a, b] = comparados;

  if (modo === 'treinadores') {
    return treinador ? <TelaTreinador t={treinador} v={v} onPokemon={acoes.verPokemon} /> : <TelaSemSinal texto="Escolha um treinador na lista." />;
  }
  if (modo === 'comparar') {
    return a && b ? <TelaComparar a={a} b={b} v={v} /> : <TelaEscolha a={a} b={b} onRemover={acoes.alternarVs} />;
  }
  if (selecionado) {
    return <TelaDetalhes p={selecionado} v={v} fav={favoritos.has(selecionado.id)} onFav={acoes.marcar} onTreinador={acoes.verTreinador} />;
  }
  if (!lista.length) {
    const semFavoritos = modo === 'favoritos' && !favoritos.size;
    return <TelaSemSinal texto={semFavoritos ? 'Você ainda não marcou favoritos.' : 'Nenhum Pokémon para mostrar. Ajuste a busca ou os filtros.'} />;
  }
  let info;
  if (filtrando) info = `${descreverFiltro(busca, tipo)} · ${lista.length} DE ${TOTAL_POKEMON}`;
  else if (modo === 'favoritos') info = plural(lista.length, 'FAVORITO', 'FAVORITOS');
  return (
    <TelaResumo
      lista={lista}
      v={v}
      titulo={modo === 'favoritos' ? 'SEUS FAVORITOS' : filtrando ? 'RESULTADO DA BUSCA' : 'RESUMO DA POKÉDEX'}
      info={info}
      onPokemon={acoes.verPokemon}
    />
  );
}
