import Icone from '../comum/Icone';
import { CORES_TIPO, TOTAL_POKEMON, tinta, tiposUsados, up } from '../../data/dados';

export function BotaoTipo({ tipo, aberto, onClick }) {
  return (
    <button type="button" className={`lcd-btn${tipo ? ' on' : ''}`} aria-expanded={aberto} aria-haspopup="dialog" onClick={onClick}>
      <Icone nome="filter" tamanho={12} />
      {tipo ? (
        <>
          <i className="dot" style={{ background: CORES_TIPO[tipo] }} />
          {up(tipo)}
        </>
      ) : (
        'TIPO: TODOS'
      )}
      <Icone nome="chev" tamanho={10} />
    </button>
  );
}

function OpcoesTipo({ tipo, onEscolher }) {
  return (
    <div className="type-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
      <button type="button" className={`type-opt${tipo ? '' : ' on'}`} style={{ background: 'var(--lcd-hi)', color: 'var(--lcd-ink)' }} onClick={() => onEscolher(null)}>
        TODOS<em>{TOTAL_POKEMON}</em>
      </button>
      {tiposUsados.map((t) => {
        const cor = CORES_TIPO[t.name];
        return (
          <button
            key={t.id}
            type="button"
            className={`type-opt${tipo === t.name ? ' on' : ''}`}
            style={{ background: cor, color: tinta(cor) }}
            aria-pressed={tipo === t.name}
            onClick={() => onEscolher(t.name)}
          >
            {up(t.name)}
            <em>{t.count}</em>
          </button>
        );
      })}
    </div>
  );
}

// Filtro de tipos: popover no desktop/tablet e folha que sobe no mobile.
export function PainelTipos({ v, tipo, onEscolher, onFechar }) {
  const conteudo = (
    <>
      <div className="popover-title">
        <span>FILTRAR POR TIPO</span>
        <span>{tiposUsados.length} TIPOS</span>
      </div>
      <OpcoesTipo tipo={tipo} onEscolher={onEscolher} />
      <div className="popover-actions">
        <button type="button" className="lcd-btn" onClick={() => onEscolher(null)}>
          <Icone nome="eraser" tamanho={12} />
          LIMPAR
        </button>
        <button type="button" className="lcd-btn on" onClick={onFechar}>
          <Icone nome="play" tamanho={10} />
          APLICAR
        </button>
      </div>
    </>
  );
  return (
    <>
      <div className="veu" onClick={onFechar} aria-hidden="true" />
      {v === 'mob' ? (
        <div className="sheet-lcd" role="dialog" aria-label="Filtrar por tipo">
          <span className="grip" />
          {conteudo}
        </div>
      ) : (
        <div className="popover" role="dialog" aria-label="Filtrar por tipo" style={v === 'tab' ? { left: 250, top: 66, width: 360 } : { left: 160, top: 66, width: 350 }}>
          {conteudo}
        </div>
      )}
    </>
  );
}
