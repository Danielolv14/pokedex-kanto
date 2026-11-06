import { Chip } from '../comum/Chip';
import { Sprite } from '../comum/Sprite';
import { Avatar, Insignias } from '../lcd/TreinadorItem';
import { milhar, total, up } from '../../data/dados';

export function TelaTreinador({ t, v, onPokemon }) {
  const qtd = t.equipe.reduce((a, { n }) => a + n, 0);
  return (
    <>
      <div className="trainer-big">
        <Avatar t={t} d={v === 'tab' ? 36 : 44} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="s2-num">TREINADOR</span>
          <h2 className="s2-name">{up(t.name)}</h2>
        </div>
        <span className="spacer" style={{ flex: 1 }} />
        <Insignias n={t.badges} />
      </div>
      <span className="s2-label">EQUIPE · {qtd} POKÉMON</span>
      <div className="team-grid" style={{ gridTemplateColumns: `repeat(${v === 'tab' ? 3 : 2},1fr)` }}>
        {t.equipe.map(({ p, n }) => (
          <button key={p.id} type="button" className="team-card" onClick={() => onPokemon(p.id)}>
            <Sprite id={p.id} tamanho={v === 'tab' ? 36 : 40} />
            <span className="tc-body">
              <span className="tc-name">
                {up(p.name)}
                {n > 1 ? ` ×${n}` : ''}
              </span>
              <span className="tc-sub">
                {v !== 'tab' && p.types.map((x) => <Chip key={x.id} tipo={x} />)}
                <em>{total(p)}</em>
              </span>
            </span>
          </button>
        ))}
      </div>
      <div className="s2-foot">
        TOTAL DA EQUIPE <span className="tchip">{milhar(t.soma)}</span>CLIQUE NUM POKÉMON PARA VER OS DETALHES
      </div>
    </>
  );
}
