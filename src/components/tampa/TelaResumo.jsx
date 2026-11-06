import Icone from '../comum/Icone';
import { Chip } from '../comum/Chip';
import { Sprite } from '../comum/Sprite';
import { Cabeca } from './CabecaTela';
import { CORES_TIPO, tiposUsados, total, up } from '../../data/dados';

export function TelaResumo({ lista, v, titulo = 'RESUMO DA POKÉDEX', info, onPokemon }) {
  const usados = tiposUsados
    .map((t) => ({ ...t, n: lista.filter((p) => p.types.some((x) => x.id === t.id)).length }))
    .filter((t) => t.n > 0)
    .sort((a, b) => b.n - a.n);
  const max = Math.max(...usados.map((t) => t.n));
  const larg = v === 'tab' ? 36 : 50;
  const meio = Math.ceil(usados.length / 2);
  const colunas = usados.length > 4 ? [usados.slice(0, meio), usados.slice(meio)] : [usados];
  const fortes = [...lista].sort((a, b) => total(b) - total(a)).slice(0, 3);
  const spr = v === 'tab' ? 30 : 36;
  return (
    <>
      <Cabeca nome={titulo} />
      <div className="s2-cols" style={{ gap: v === 'tab' ? 12 : 16 }}>
        <div className="s2-col">
          <span className="s2-label">POKÉMON POR TIPO</span>
          <div style={{ display: 'flex', gap: 12 }}>
            {colunas.map((col) => (
              <div key={col[0].id} className="type-bars">
                {col.map((t) => (
                  <div key={t.id} className="type-bar">
                    <Chip tipo={t} />
                    <span className="fill" style={{ width: Math.max(3, Math.round((t.n / max) * larg)), background: CORES_TIPO[t.name] }} />
                    <em>{t.n}</em>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="s2-col">
          <span className="s2-label">MAIS FORTES</span>
          <div className="top-list">
            {fortes.map((p) => (
              <button key={p.id} type="button" className="top-item" onClick={() => onPokemon(p.id)}>
                <Sprite id={p.id} tamanho={spr} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {up(p.name)}
                  <em style={{ marginLeft: 0 }}>{total(p)}</em>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="s2-foot">{info ?? `${lista.length} POKÉMON · ${usados.length} TIPOS · 12 TREINADORES`}</div>
      <div className="hint">
        <Icone nome="up" tamanho={8} />
        <Icone nome="down" tamanho={8} />
        OU CLIQUE NUM POKÉMON PARA VER OS DETALHES
      </div>
    </>
  );
}
