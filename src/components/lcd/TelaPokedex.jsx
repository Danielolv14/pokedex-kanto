import { BarraStatus } from './BarraStatus';
import { CampoBusca } from './CampoBusca';
import { BotaoTipo, PainelTipos } from './FiltroTipos';
import { BotaoOrdem, CabecalhoLista, PainelOrdem, rotuloOrdem } from './Ordenacao';
import { CardPokemon, COLS, LinhaPokemon } from './PokemonItem';
import { Rolagem } from './Rolagem';
import { Vazio } from './Vazio';
import { TOTAL_POKEMON, up } from '../../data/dados';

const NOME_MODO = { pokedex: 'POKÉDEX', comparar: 'COMPARAR', favoritos: 'FAVORITOS' };

// Conteúdo do LCD nos modos Pokédex, Favoritos e Comparar: busca, filtros e a lista.
export function TelaPokedex({ v, pk }) {
  const { modo, lista, busca, tipo, ordem, painel, selId, favoritos, vs, buscaRef, acoes } = pk;
  const semFavoritos = modo === 'favoritos' && favoritos.size === 0;
  const contagem = modo === 'comparar' ? `A × B · ${vs.length}/2` : `${lista.length}/${modo === 'favoritos' ? favoritos.size : TOTAL_POKEMON}`;

  let conteudo;
  if (lista.length) {
    conteudo = (
      <Rolagem alvo={selId} rotulo="Pokémon" reinicio={`${modo}|${busca}|${tipo}|${ordem.campo}|${ordem.desc}`}>
        {lista.map((p) => {
          const props = {
            p,
            sel: p.id === selId,
            fav: favoritos.has(p.id),
            tag: vs[0] === p.id ? 'A' : vs[1] === p.id ? 'B' : '',
            marcada: modo === 'comparar' && vs.includes(p.id),
            onClick: () => acoes.escolherPokemon(p.id),
          };
          return v === 'mob' ? <CardPokemon key={p.id} {...props} /> : <LinhaPokemon key={p.id} {...props} v={COLS[v]} />;
        })}
      </Rolagem>
    );
  } else if (semFavoritos) {
    conteudo = <Vazio titulo="NENHUM FAVORITO" texto="Escolha um Pokémon e aperte MARCAR (ou a tecla F)." />;
  } else {
    conteudo = (
      <Vazio
        titulo={
          <>
            NENHUM POKÉMON
            <br />
            ENCONTRADO
          </>
        }
        texto={`Nada para "${busca.trim() || up(tipo ?? '')}". Tente outro nome ou número.`}
        acao="LIMPAR BUSCA"
        onAcao={acoes.limparFiltros}
      />
    );
  }

  return (
    <>
      <BarraStatus esq={NOME_MODO[modo]} dir={contagem} />
      <div className={`lcd-toolbar${v === 'mob' ? ' wrap' : ''}`}>
        <CampoBusca valor={busca} onChange={acoes.setBusca} rotulo="BUSCAR NOME OU Nº..." inputRef={buscaRef} />
        {v === 'mob' && <span style={{ width: '100%', height: 0 }} />}
        <BotaoTipo tipo={tipo} aberto={painel === 'tipos'} onClick={() => acoes.alternarPainel('tipos')} />
        <BotaoOrdem texto={rotuloOrdem(ordem)} aberto={painel === 'ordem'} onClick={() => acoes.alternarPainel('ordem')} />
      </div>
      {v !== 'mob' && lista.length > 0 && <CabecalhoLista v={COLS[v]} ordem={ordem} onOrdenar={acoes.ordenarPor} />}
      {conteudo}
      {painel === 'tipos' && <PainelTipos v={v} tipo={tipo} onEscolher={acoes.escolherTipo} onFechar={acoes.fecharPainel} />}
      {painel === 'ordem' && <PainelOrdem v={v} ordem={ordem} onOrdem={acoes.escolherOrdem} onFechar={acoes.fecharPainel} />}
    </>
  );
}
