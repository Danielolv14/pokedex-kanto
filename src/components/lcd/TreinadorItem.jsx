import Icone from '../comum/Icone';
import { Sprite } from '../comum/Sprite';
import { CORES_TIPO, tinta, total, up } from '../../data/dados';

export const TCOLS = { desk: '36px 108px 1fr 196px', tab: '40px 130px 1fr 230px' };

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
