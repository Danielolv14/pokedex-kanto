import Icone from '../comum/Icone';
import { ArtePokemon } from '../comum/ArtePokemon';
import { Chip } from '../comum/Chip';
import { STATS, total, up } from '../../data/dados';

const CFG_CMP = {
  desk: { art: 84, bar: 150, lbl: 64, lado: 'row' },
  tab: { art: 56, bar: 118, lbl: 60, lado: 'row' },
  mob: { art: 100, bar: 74, lbl: 56, lado: 'col' },
};

export function TelaComparar({ a, b, v }) {
  const cfg = CFG_CMP[v];
  const lado = (p, cls) => {
    const info = (
      <div className={`cmp-side ${cls}`}>
        <span className="cmp-name">{up(p.name)}</span>
        <span className="s2-types">
          {p.types.map((t) => (
            <Chip key={t.id} tipo={t} />
          ))}
        </span>
      </div>
    );
    const img = (
      <div className="art-box" style={{ width: cfg.art, height: cfg.art }}>
        <ArtePokemon p={p} tamanho={cfg.art - 8} animar={false} />
      </div>
    );
    if (cfg.lado === 'col') {
      return (
        <div className={`cmp-side ${cls}`} style={{ gap: 8 }}>
          {img}
          {info}
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {cls === 'b' ? info : img}
        {cls === 'b' ? img : info}
      </div>
    );
  };
  const fill = (val, max) => Math.max(2, Math.round(Math.min(1, val / max) * cfg.bar));
  const linha = (rot, va, vb, max, cor) => {
    const ganhaA = va > vb;
    const ganhaB = vb > va;
    return (
      <div key={rot} className={`cmp-row${rot === 'TOTAL' ? ' total' : ''}`}>
        <span className={`v${ganhaA ? ' win' : ''}`} style={{ width: 30, textAlign: 'right' }}>{va}</span>
        <span className="bar a" style={{ width: cfg.bar }}>
          <i style={{ width: fill(va, max), background: cor, opacity: ganhaA || va === vb ? 1 : 0.45 }} />
        </span>
        <span className="lbl" style={{ width: cfg.lbl }}>{rot}</span>
        <span className="bar" style={{ width: cfg.bar }}>
          <i style={{ width: fill(vb, max), background: cor, opacity: ganhaB || va === vb ? 1 : 0.45 }} />
        </span>
        <span className={`v${ganhaB ? ' win' : ''}`} style={{ width: 30 }}>{vb}</span>
      </div>
    );
  };
  const vence = total(a) === total(b) ? 'EMPATE NO TOTAL' : `${up(total(a) > total(b) ? a.name : b.name)} VENCE NO TOTAL`;
  return (
    <>
      <div className="cmp-top">
        {lado(a, 'a')}
        <span className="vs">VS</span>
        {lado(b, 'b')}
      </div>
      <div className="cmp-rows" style={{ gap: v === 'tab' ? 3 : 5 }}>
        {STATS.map((s) => linha(s.longo, a.stats[s.key], b.stats[s.key], 180, s.cor))}
        {linha('TOTAL', total(a), total(b), 720, '#ffd23f')}
      </div>
      <div className="s2-foot">
        <Icone nome="star" tamanho={10} cor="#ffd23f" />
        {vence}
      </div>
    </>
  );
}
