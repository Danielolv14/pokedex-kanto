import Icone from '../comum/Icone';
import { Chip } from '../comum/Chip';
import { Sprite } from '../comum/Sprite';
import { STATS, pad3, up } from '../../data/dados';

export const COLS = {
  desk: { cols: '34px 40px 1fr 104px 180px', cell: 30 },
  tab: { cols: '40px 40px 1fr 124px 222px', cell: 37 },
};

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
