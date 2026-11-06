import { BarraStatus } from './BarraStatus';
import { CampoBusca } from './CampoBusca';
import { BotaoOrdem } from './Ordenacao';
import { Rolagem } from './Rolagem';
import { CardTreinador, LinhaTreinador, TCOLS } from './TreinadorItem';
import { Vazio } from './Vazio';

const ORDEM_TR = { badges: 'INSÍGNIAS', name: 'NOME', id: 'Nº' };

// Conteúdo do LCD no modo Treinadores: linhas no desktop/tablet e cards que expandem no mobile.
export function TelaTreinadores({ v, pk }) {
  const { listaTr, buscaTr, ordemTr, treinador, buscaRef, acoes } = pk;
  return (
    <>
      <BarraStatus esq="TREINADORES" dir={String(listaTr.length)} />
      <div className="lcd-toolbar">
        <CampoBusca valor={buscaTr} onChange={acoes.setBuscaTr} rotulo="BUSCAR TREINADOR..." inputRef={buscaRef} />
        <BotaoOrdem texto={v === 'mob' ? ORDEM_TR[ordemTr].slice(0, 5) : ORDEM_TR[ordemTr]} onClick={acoes.ciclarOrdemTr} />
      </div>
      {v !== 'mob' && listaTr.length > 0 && (
        <div className="list-head" style={{ gridTemplateColumns: TCOLS[v] }}>
          <span />
          <span>NOME</span>
          <span>INSÍGNIAS</span>
          <span>EQUIPE</span>
        </div>
      )}
      {listaTr.length ? (
        <Rolagem alvo={treinador?.id} rotulo="Treinadores" reinicio={`${buscaTr}|${ordemTr}`}>
          {listaTr.map((t) =>
            v === 'mob' ? (
              <CardTreinador key={t.id} t={t} aberto={treinador?.id === t.id} onAbrir={() => acoes.escolherTreinador(t.id)} onPokemon={acoes.verPokemon} />
            ) : (
              <LinhaTreinador key={t.id} t={t} cols={TCOLS[v]} sel={treinador?.id === t.id} onClick={() => acoes.escolherTreinador(t.id)} />
            ),
          )}
        </Rolagem>
      ) : (
        <Vazio titulo="NENHUM TREINADOR" texto={`Nada para "${buscaTr}".`} acao="LIMPAR BUSCA" onAcao={() => acoes.setBuscaTr('')} />
      )}
    </>
  );
}
