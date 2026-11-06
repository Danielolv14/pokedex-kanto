import { ArtePokemon } from '../comum/ArtePokemon';
import { Chip } from '../comum/Chip';
import { Cabeca } from './CabecaTela';
import { CORES_TIPO, STATS, pad3, rgba, total, treinadoresDe, up } from '../../data/dados';

const VAR_S2 = {
  desk: { art: 186, img: 166, lbl: 58, segN: 20, segW: 6, segH: 12, gap: 9 },
  tab: { art: 130, img: 116, lbl: 58, segN: 18, segW: 6, segH: 11, gap: 3 },
  mob: { artW: 282, artH: 150, img: 140, lbl: 62, segN: 22, segW: 7, segH: 12, gap: 5 },
};

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
