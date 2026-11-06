import { useEffect, useRef, useState } from 'react';
import Icone from './Icone';
import { Chip, Sprite } from './Imagens';
import { CORES_TIPO, ORDENS, STATS, TOTAL_POKEMON, pad3, tinta, tiposUsados, total, up } from '../data/dados';

export const COLS = {
  desk: { cols: '34px 40px 1fr 104px 180px', cell: 30 },
  tab: { cols: '40px 40px 1fr 124px 222px', cell: 37 },
};
export const TCOLS = { desk: '36px 108px 1fr 196px', tab: '40px 130px 1fr 230px' };

export function Status({ esq, dir }) {
  return (
    <div className="lcd-status">
      <span>
        <Icone nome="play" tamanho={8} />
        {esq}
      </span>
      <span>
        {dir}
        <span className="battery">
          <i />
          <i />
          <i />
        </span>
      </span>
    </div>
  );
}

export function CampoBusca({ valor, onChange, rotulo, inputRef, onEnter }) {
  return (
    <label className="search">
      <Icone nome="search" tamanho={14} />
      <span className="sr-only">{rotulo}</span>
      <input
        ref={inputRef}
        type="search"
        value={valor}
        placeholder={rotulo}
        autoComplete="off"
        spellCheck="false"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onEnter?.();
        }}
      />
      {valor && (
        <button type="button" className="clear" aria-label="Limpar busca" onClick={() => onChange('')}>
          <Icone nome="x" tamanho={10} />
        </button>
      )}
    </label>
  );
}

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

// Lista com rolagem real e a barrinha de rolagem desenhada no LCD.
export function Rolagem({ alvo, reinicio, rotulo, children }) {
  const ref = useRef(null);
  const [barra, setBarra] = useState({ topo: 0, altura: 1 });

  const medir = () => {
    const el = ref.current;
    if (!el) return;
    const altura = el.scrollHeight ? el.clientHeight / el.scrollHeight : 1;
    const topo = el.scrollHeight ? el.scrollTop / el.scrollHeight : 0;
    setBarra((b) => (Math.abs(b.topo - topo) < 0.001 && Math.abs(b.altura - altura) < 0.001 ? b : { topo, altura }));
  };

  useEffect(medir);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
  }, [reinicio]);

  useEffect(() => {
    const el = ref.current;
    const item = alvo == null ? null : el?.querySelector(`[data-id="${alvo}"]`);
    if (!item) return;
    const cima = item.offsetTop - 4;
    const baixo = item.offsetTop + item.offsetHeight + 4;
    if (cima < el.scrollTop) el.scrollTop = cima;
    else if (baixo > el.scrollTop + el.clientHeight) el.scrollTop = baixo - el.clientHeight;
  }, [alvo, reinicio]);

  return (
    <div className="rolagem">
      <div className="list" ref={ref} onScroll={medir} role="list" aria-label={rotulo}>
        {children}
      </div>
      {barra.altura < 1 && (
        <div className="scrollbar">
          <i style={{ top: `${barra.topo * 100}%`, height: `${Math.max(barra.altura, 0.06) * 100}%` }} />
        </div>
      )}
    </div>
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

export function LinhaPokemon({ p, v, sel, tag, fav, marcada, onClick }) {
  return (
    <button
      type="button"
      role="listitem"
      data-id={p.id}
      aria-current={sel || undefined}
      className={`row${sel ? ' sel' : ''}${marcada ? ' marcada' : ''}`}
      style={{ gridTemplateColumns: v.cols, '--cell': `${v.cell}px` }}
      onClick={onClick}
    >
      <span className="id">
        {sel && <i className="cursor" />}
        {pad3(p.id)}
      </span>
      <Sprite id={p.id} tamanho={40} />
      <span className="name">
        <span>{up(p.name)}</span>
        {fav && <Icone nome="star" tamanho={12} cor={sel ? '#ffd23f' : '#c79400'} />}
        {tag && <span className="tag-ab">{tag}</span>}
      </span>
      <span className="types">
        {p.types.map((t) => (
          <Chip key={t.id} tipo={t} />
        ))}
      </span>
      <span className="statcells">
        {STATS.map((s) => (
          <span key={s.key} className="stat">
            {p.stats[s.key]}
          </span>
        ))}
      </span>
    </button>
  );
}

export function CardPokemon({ p, sel, tag, fav, marcada, onClick }) {
  return (
    <button
      type="button"
      role="listitem"
      data-id={p.id}
      aria-current={sel || undefined}
      className={`card${sel ? ' sel' : ''}${marcada ? ' marcada' : ''}`}
      onClick={onClick}
    >
      <Sprite id={p.id} tamanho={48} />
      <span className="body">
        <span className="top">
          <span className="id">{pad3(p.id)}</span>
          <span className="name">{up(p.name)}</span>
          {fav && <Icone nome="star" tamanho={11} cor={sel ? '#ffd23f' : '#c79400'} />}
          {tag && <span className="tag-ab">{tag}</span>}
          <span className="types">
            {p.types.map((t) => (
              <Chip key={t.id} tipo={t} />
            ))}
          </span>
        </span>
        <span className="cstats">
          {STATS.map((s) => (
            <span key={s.key}>
              <em>{s.curto}</em>
              {p.stats[s.key]}
            </span>
          ))}
        </span>
      </span>
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

export function Vazio({ titulo, texto, acao, onAcao }) {
  return (
    <div className="empty">
      <Icone nome="ball" tamanho={48} />
      <b>{titulo}</b>
      <p>{texto}</p>
      {acao && (
        <button type="button" className="lcd-btn on" onClick={onAcao}>
          <Icone nome="eraser" tamanho={12} />
          {acao}
        </button>
      )}
    </div>
  );
}

export function Avatar({ t, d }) {
  const cor = CORES_TIPO[t.tipo];
  return (
    <span className="avatar" style={{ width: d, height: d, background: cor, color: tinta(cor), fontSize: Math.round(d / 3.4) }} aria-hidden="true">
      {t.iniciais}
    </span>
  );
}

export function Insignias({ n }) {
  return (
    <span className="badges" aria-label={`${n} insígnias`}>
      {Array.from({ length: Math.max(8, n) }, (_, i) => (
        <i key={i} className={i < n ? 'on' : ''} />
      ))}
      <em>{n}</em>
    </span>
  );
}

function EquipeSprites({ t, s = 32 }) {
  return (
    <span className="team">
      {t.equipe.map(({ p, n }) => (
        <span key={p.id} style={{ display: 'flex', alignItems: 'center' }}>
          <Sprite id={p.id} tamanho={s} />
          {n > 1 && <span className="mult">×{n}</span>}
        </span>
      ))}
    </span>
  );
}

export function LinhaTreinador({ t, cols, sel, onClick }) {
  return (
    <button type="button" role="listitem" data-id={t.id} aria-current={sel || undefined} className={`trainer-row${sel ? ' sel' : ''}`} style={{ gridTemplateColumns: cols }} onClick={onClick}>
      <Avatar t={t} d={36} />
      <span className="trainer-name">{up(t.name)}</span>
      <Insignias n={t.badges} />
      <EquipeSprites t={t} />
    </button>
  );
}

export function CardTreinador({ t, aberto, onAbrir, onPokemon }) {
  return (
    <div className={`tcard${aberto ? ' open' : ''}`} data-id={t.id} role="listitem">
      <button type="button" className="tcard-head" aria-expanded={aberto} onClick={onAbrir}>
        <Avatar t={t} d={34} />
        <span className="meta">
          <span className="trainer-name">{up(t.name)}</span>
          <Insignias n={t.badges} />
        </span>
        <Icone nome={aberto ? 'up' : 'down'} tamanho={14} />
      </button>
      {aberto ? (
        <div className="tcard-team">
          {t.equipe.map(({ p, n }) => (
            <button key={p.id} type="button" className="tmini" onClick={() => onPokemon(p.id)}>
              <Sprite id={p.id} tamanho={30} />
              {up(p.name)}
              {n > 1 ? ` ×${n}` : ''}
              <em>{total(p)}</em>
            </button>
          ))}
        </div>
      ) : (
        <EquipeSprites t={t} s={28} />
      )}
    </div>
  );
}
