import Icone from '../comum/Icone';
import { ORDENS, STATS } from '../../data/dados';

export const rotuloOrdem = (o) => `${ORDENS.find((x) => x.campo === o.campo).rotulo} ${o.desc ? '↓' : '↑'}`;

export function BotaoOrdem({ texto, aberto, onClick }) {
  return (
    <button type="button" className="lcd-btn" aria-expanded={aberto} aria-haspopup="dialog" aria-label={`Ordenar: ${texto}`} onClick={onClick}>
      <Icone nome="sort" tamanho={12} />
      {texto}
      <Icone nome="chev" tamanho={10} />
    </button>
  );
}

export function PainelOrdem({ v, ordem, onOrdem, onFechar }) {
  const conteudo = (
    <>
      <div className="popover-title">
        <span>ORDENAR POR</span>
        <span>{ordem.desc ? 'DECRESCENTE' : 'CRESCENTE'}</span>
      </div>
      <div className="ord-grid">
        {ORDENS.map((o) => (
          <button key={o.campo} type="button" className={`ord-opt${ordem.campo === o.campo ? ' on' : ''}`} aria-pressed={ordem.campo === o.campo} onClick={() => onOrdem({ ...ordem, campo: o.campo })}>
            {o.rotulo}
          </button>
        ))}
      </div>
      <div className="popover-actions">
        <button type="button" className="lcd-btn" onClick={() => onOrdem({ ...ordem, desc: !ordem.desc })}>
          <Icone nome={ordem.desc ? 'down' : 'up'} tamanho={10} />
          {ordem.desc ? 'DECRESCENTE' : 'CRESCENTE'}
        </button>
        <button type="button" className="lcd-btn on" onClick={onFechar}>
          <Icone nome="play" tamanho={10} />
          OK
        </button>
      </div>
    </>
  );
  return (
    <>
      <div className="veu" onClick={onFechar} aria-hidden="true" />
      {v === 'mob' ? (
        <div className="sheet-lcd" role="dialog" aria-label="Ordenar">
          <span className="grip" />
          {conteudo}
        </div>
      ) : (
        <div className="popover" role="dialog" aria-label="Ordenar" style={{ right: 8, top: 66, width: 300 }}>
          {conteudo}
        </div>
      )}
    </>
  );
}

export function CabecalhoLista({ v, ordem, onOrdenar }) {
  const col = (campo, rotulo, cls) => {
    const ativa = ordem.campo === campo;
    return (
      <span className={cls}>
        <button type="button" className={ativa ? 'ativa' : ''} onClick={() => onOrdenar(campo)} aria-label={`Ordenar por ${rotulo}`}>
          {rotulo}
          {ativa && (ordem.desc ? '↓' : '↑')}
        </button>
      </span>
    );
  };
  return (
    <div className="list-head" style={{ gridTemplateColumns: v.cols, '--cell': `${v.cell}px` }}>
      {col('id', 'Nº', 'num')}
      <span />
      {col('name', 'NOME')}
      <span>TIPO</span>
      <span className="statcells">
        {STATS.map((s) => {
          const ativa = ordem.campo === s.key;
          return (
            <button key={s.key} type="button" className={ativa ? 'ativa' : ''} onClick={() => onOrdenar(s.key)} aria-label={`Ordenar por ${s.longo}`}>
              {ativa && (ordem.desc ? '↓' : '↑')}
              {s.curto}
            </button>
          );
        })}
      </span>
    </div>
  );
}
