import Icone from './Icone';
import { ArtePokemon, Chip, Sprite } from './Imagens';
import { Avatar, Insignias } from './Lcd';
import { CORES_TIPO, STATS, milhar, pad3, rgba, tiposUsados, total, treinadoresDe, up } from '../data/dados';

const VAR_S2 = {
  desk: { art: 186, img: 166, lbl: 58, segN: 20, segW: 6, segH: 12, gap: 9 },
  tab: { art: 130, img: 116, lbl: 58, segN: 18, segW: 6, segH: 11, gap: 3 },
  mob: { artW: 282, artH: 150, img: 140, lbl: 62, segN: 22, segW: 7, segH: 12, gap: 5 },
};

function Cabeca({ num, nome, fav, onFav }) {
  return (
    <div className="s2-head">
      {num && <span className="s2-num">{num}</span>}
      <h2 className="s2-name">{nome}</h2>
      <span className="spacer" />
      {onFav && (
        <button type="button" className={`s2-star${fav ? '' : ' off'}`} aria-pressed={fav} onClick={onFav}>
          <Icone nome={fav ? 'star' : 'starO'} tamanho={10} cor={fav ? '#ffd23f' : 'currentColor'} />
          {fav ? 'FAVORITO' : 'MARCAR'}
        </button>
      )}
    </div>
  );
}

function Segmentos({ valor, n, w, h, cor }) {
  const acesos = Math.max(1, Math.round((valor / 255) * n));
  return (
    <span className="segs anima" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} className={i < acesos ? 'on' : ''} style={{ width: w, height: h, '--i': i, ...(i < acesos ? { background: cor } : null) }} />
      ))}
    </span>
  );
}

function CaixaArte({ p, w, h, img }) {
  const cor = CORES_TIPO[p.types[0].name];
  return (
    <div className="art-box" style={{ width: w, height: h, background: `radial-gradient(circle at 50% 55%, ${rgba(cor, 0.45)} 0%, ${rgba(cor, 0)} 65%)` }}>
      <ArtePokemon p={p} tamanho={img} etiqueta />
    </div>
  );
}

function BlocoStats({ p, v }) {
  return (
    <div className="stats" style={{ gap: v.gap }} key={p.id}>
      {STATS.map((s) => (
        <div key={s.key} className="stat-row">
          <span className="lbl" style={{ width: v.lbl }}>{s.longo}</span>
          <span className="val" style={{ width: 30 }}>{p.stats[s.key]}</span>
          <Segmentos valor={p.stats[s.key]} n={v.segN} w={v.segW} h={v.segH} cor={s.cor} />
        </div>
      ))}
    </div>
  );
}

function RodapeTreinadores({ p, onTreinador }) {
  const trs = treinadoresDe(p.id);
  return (
    <div className="s2-foot">
      TREINADORES:
      {trs.length
        ? trs.map((t) => (
            <button key={t.id} type="button" className="tchip" onClick={() => onTreinador(t.id)}>
              {up(t.name)}
            </button>
          ))
        : ' NENHUM'}
    </div>
  );
}

export function TelaDetalhes({ p, v, fav, onFav, onTreinador }) {
  const c = VAR_S2[v];
  const tipos = (
    <div className="s2-types">
      {p.types.map((t) => (
        <Chip key={t.id} tipo={t} grande />
      ))}
    </div>
  );
  const tot = (
    <div className="s2-total">
      <span>TOTAL</span>
      <b>{total(p)}</b>
      {v !== 'mob' && <span>MÉDIA {Math.round(total(p) / 6)}</span>}
    </div>
  );
  const cab = <Cabeca num={`Nº ${pad3(p.id)}`} nome={up(p.name)} fav={fav} onFav={onFav} />;
  if (v === 'mob') {
    return (
      <>
        {cab}
        <CaixaArte p={p} w={c.artW} h={c.artH} img={c.img} />
        <div className="s2-head">
          {tipos}
          <span className="spacer" />
          {tot}
        </div>
        <span className="s2-label">STATUS BASE</span>
        <BlocoStats p={p} v={c} />
        <RodapeTreinadores p={p} onTreinador={onTreinador} />
      </>
    );
  }
  return (
    <>
      {cab}
      <div className="s2-cols">
        <div className="s2-col">
          <CaixaArte p={p} w={c.art} h={c.art} img={c.img} />
          {tipos}
        </div>
        <div className="s2-col">
          {v === 'desk' && <span className="s2-label">STATUS BASE</span>}
          <BlocoStats p={p} v={c} />
          {tot}
        </div>
      </div>
      <RodapeTreinadores p={p} onTreinador={onTreinador} />
    </>
  );
}

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

export function TelaEscolha({ a, b, onRemover }) {
  const slot = (p, letra) => (
    <div className={`slot${p ? ' cheio' : ''}`}>
      <b>{letra}</b>
      {p ? (
        <>
          <Sprite id={p.id} tamanho={56} />
          <span>{up(p.name)}</span>
          <button type="button" onClick={() => onRemover(p.id)}>
            REMOVER
          </button>
        </>
      ) : (
        <span>VAZIO</span>
      )}
    </div>
  );
  return (
    <>
      <Cabeca nome="COMPARAR" />
      <div className="slot-grid">
        {slot(a, 'A')}
        {slot(b, 'B')}
      </div>
      <div className="hint">
        <Icone nome="plus" tamanho={8} />
        ESCOLHA DOIS POKÉMON NA LISTA (CLIQUE OU + VS)
      </div>
    </>
  );
}

export function TelaSemSinal({ titulo = 'SEM SINAL', texto }) {
  return (
    <div className="signal">
      <Icone nome="ball" tamanho={40} />
      <b>{titulo}</b>
      <span>{texto}</span>
    </div>
  );
}
