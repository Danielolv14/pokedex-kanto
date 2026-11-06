import { useState } from 'react';
import Icone from '../comum/Icone';
import { useIdSvg } from './Carcaca';

const caixa = (x, y, w, h) => ({ left: x, top: y, width: w, height: h });

export function Lente({ x, y, d, pulsando }) {
  const b = Math.round(d * 0.82);
  const l = Math.round(d * 0.68);
  const ob = Math.round((d - b) / 2);
  const ol = Math.round((d - l) / 2);
  return (
    <>
      <div className="lens-ring" style={caixa(x, y, d, d)} />
      <div className="lens-bezel" style={caixa(x + ob, y + ob, b, b)} />
      <div className={`lens${pulsando ? ' pulsando' : ''}`} style={caixa(x + ol, y + ol, l, l)}>
        <i className="g1" />
        <i className="g2" />
        <i className="g3" />
      </div>
    </>
  );
}

export function Leds({ x, y, d, gap, ligados = true, piscando }) {
  return ['red', 'yellow', 'green'].map((cor, i) => (
    <div
      key={cor}
      className={`led ${ligados ? cor : 'off'}${piscando && i === 2 ? ' pisca' : ''}`}
      style={{ ...caixa(x + i * (d + gap), y, d, d), '--i': i }}
    />
  ));
}

// Cruz direcional em relevo, encaixada num rebaixo redondo, com setas moldadas e quatro áreas de toque.
const DIRECOES = [
  ['up', 'Anterior'],
  ['down', 'Próximo'],
  ['left', 'Página anterior'],
  ['right', 'Próxima página'],
];

export function Dpad({ x, y, s, apertada, onDirecao }) {
  const k = useIdSvg();
  const [toque, setToque] = useState(null);
  const t = s / 3;
  const rr = Math.round(t * 0.22);
  const a = t;
  const b = 2 * t;
  const c = 3 * t;
  const cruz = (dy) => {
    const Y = (v) => +(v + dy).toFixed(1);
    return `M${a + rr} ${Y(0)} H${b - rr} Q${b} ${Y(0)} ${b} ${Y(rr)} V${Y(a)} H${c - rr} Q${c} ${Y(a)} ${c} ${Y(a + rr)} V${Y(b - rr)} Q${c} ${Y(b)} ${c - rr} ${Y(b)} H${b} V${Y(c - rr)} Q${b} ${Y(c)} ${b - rr} ${Y(c)} H${a + rr} Q${a} ${Y(c)} ${a} ${Y(c - rr)} V${Y(b)} H${rr} Q0 ${Y(b)} 0 ${Y(b - rr)} V${Y(a + rr)} Q0 ${Y(a)} ${rr} ${Y(a)} H${a} V${Y(rr)} Q${a} ${Y(0)} ${a + rr} ${Y(0)} Z`;
  };
  const q = +(t * 0.2).toFixed(1);
  const tri = (cx, cy, dir, dy) => {
    const p = {
      up: [[cx - q, cy + q * 0.6], [cx + q, cy + q * 0.6], [cx, cy - q * 0.7]],
      down: [[cx - q, cy - q * 0.6], [cx + q, cy - q * 0.6], [cx, cy + q * 0.7]],
      left: [[cx + q * 0.6, cy - q], [cx + q * 0.6, cy + q], [cx - q * 0.7, cy]],
      right: [[cx - q * 0.6, cy - q], [cx - q * 0.6, cy + q], [cx + q * 0.7, cy]],
    }[dir];
    return `M${p.map(([px, py]) => `${+px.toFixed(1)} ${+(py + dy).toFixed(1)}`).join(' L')} Z`;
  };
  const setas = (dy) =>
    [[1.5 * t, 0.48 * t, 'up'], [1.5 * t, 2.52 * t, 'down'], [0.48 * t, 1.5 * t, 'left'], [2.52 * t, 1.5 * t, 'right']]
      .map(([cx, cy, d]) => tri(cx, cy, d, dy))
      .join(' ');
  const poco = Math.round(s * 0.08);
  const lado = toque || apertada;
  return (
    <>
      <div className="dpad-well" style={caixa(x - poco, y - poco, s + 2 * poco, s + 2 * poco)} />
      <svg
        className={`abs dpad-cruz${lado ? ` aperta-${lado}` : ''}`}
        style={{ left: x - 6, top: y - 4, transformOrigin: `${6 + s / 2}px ${4 + s / 2}px` }}
        width={s + 12}
        height={s + 20}
        viewBox={`0 0 ${s + 12} ${s + 20}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${k}f`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4f5861" />
            <stop offset=".5" stopColor="#2c3238" />
            <stop offset="1" stopColor="#1a1d21" />
          </linearGradient>
          <linearGradient id={`${k}b`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".5" />
            <stop offset=".2" stopColor="#fff" stopOpacity=".06" />
            <stop offset="1" stopColor="#000" stopOpacity=".45" />
          </linearGradient>
          <radialGradient id={`${k}d`} cx=".5" cy=".4" r=".6">
            <stop offset="0" stopColor="#101215" />
            <stop offset=".7" stopColor="#22272c" />
            <stop offset="1" stopColor="#3d444c" />
          </radialGradient>
          <filter id={`${k}x`} x="-10%" y="-10%" width="120%" height="130%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <clipPath id={`${k}c`}>
            <path d={cruz(0)} />
          </clipPath>
        </defs>
        <g transform="translate(6 4)">
          <path d={cruz(9)} fill="#1a0004" opacity=".55" filter={`url(#${k}x)`} />
          <path d={cruz(5)} fill="#07080a" />
          <path d={cruz(0)} fill={`url(#${k}f)`} />
          <g clipPath={`url(#${k}c)`}>
            <path d={cruz(0)} fill="none" stroke={`url(#${k}b)`} strokeWidth="4" />
          </g>
          <circle cx={1.5 * t} cy={1.5 * t} r={+(t * 0.34).toFixed(1)} fill={`url(#${k}d)`} />
          <circle cx={1.5 * t} cy={1.5 * t + 1} r={+(t * 0.34).toFixed(1)} fill="none" stroke="#ffffff" strokeOpacity=".12" strokeWidth="1.2" />
          <path d={setas(1.2)} fill="#ffffff" fillOpacity=".16" />
          <path d={setas(0)} fill="#0e1012" />
        </g>
      </svg>
      <div className="dpad-toque" style={{ ...caixa(x, y, s, s), '--t': `${t}px` }}>
        {DIRECOES.map(([d, rotulo]) => (
          <button
            key={d}
            type="button"
            className={`dpad-btn ${d}`}
            aria-label={rotulo}
            onPointerDown={() => setToque(d)}
            onPointerUp={() => setToque(null)}
            onPointerLeave={() => setToque(null)}
            onClick={() => onDirecao(d)}
          />
        ))}
      </div>
    </>
  );
}

// Tecla com encaixe rebaixado, parede, sombra e LED; a ativa fica afundada com o LED aceso.
export function Tecla({ x, y, w, h, rotulo, icone, ativa, fonte = 10, titulo, onClick }) {
  return (
    <>
      <div className="key-well" style={caixa(x - 3, y - 3, w + 6, h + 10)} />
      <button
        type="button"
        className={`key${ativa ? ' on' : ''}`}
        style={{ ...caixa(x, y, w, h), fontSize: fonte }}
        aria-pressed={ativa === undefined ? undefined : ativa}
        aria-label={titulo}
        onClick={onClick}
      >
        <i className="key-led" />
        {icone && <Icone nome={icone} tamanho={h > 36 ? 13 : 11} cor="#ffffff" />}
        <span>{rotulo}</span>
      </button>
    </>
  );
}

// Chave deslizante (tema e som): trilho rebaixado, botão com frisos e legendas nas pontas.
export function Interruptor({ x, y, rotulo, esq, dir, ligado, titulo, onChange, w = 52, h = 22, L = 40 }) {
  const kw = Math.round(w * 0.5);
  const temLegenda = esq !== undefined;
  const ty = temLegenda ? y + 13 : y;
  return (
    <>
      {temLegenda && (
        <div className="switch-legend" style={{ left: x + L, top: y, width: w }} aria-hidden="true">
          <span className={ligado ? '' : 'on'}>{esq}</span>
          <span className={ligado ? 'on' : ''}>{dir}</span>
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={ligado}
        aria-label={titulo}
        className="switch"
        style={caixa(x, ty, L + w, h)}
        onClick={() => onChange(!ligado)}
      >
        <span className="switch-label" style={{ width: L - 6, height: h }}>{rotulo}</span>
        <span className="switch-track" style={{ left: L, top: 0, width: w, height: h }}>
          <span className="switch-knob" style={{ left: ligado ? w - kw - 3 : 3, top: 3, width: kw, height: h - 6 }}>
            <i />
            <i />
            <i />
          </span>
        </span>
      </button>
    </>
  );
}

export function VerdeDisplay({ x, y, w, h, linhas, fonte = 22 }) {
  return (
    <div className="green-display" style={caixa(x, y, w, h)} aria-live="polite">
      <b style={{ fontSize: fonte }}>{linhas[0]}</b>
      <span>{linhas[1]}</span>
    </div>
  );
}

export function MiniDisplay({ x, y, w, h, rotulo, valor }) {
  return (
    <div className="mini-display" style={caixa(x, y, w, h)}>
      <small>{rotulo}</small>
      <b>{valor}</b>
    </div>
  );
}

export function Dobradica({ x, y, w, h, vertical = true }) {
  return (
    <div className={`hinge ${vertical ? 'v' : 'h'}`} style={caixa(x, y, w, h)}>
      <i />
      <i />
      <i />
    </div>
  );
}

export const Rotulo = ({ x, y, w, children }) => (
  <div className="ctrl-label" style={{ left: x, top: y, width: w }} aria-hidden="true">
    {children}
  </div>
);

export const AltoFalante = ({ x, y, w }) => (
  <div className="speaker" style={{ left: x, top: y, width: w }} aria-hidden="true">
    <i />
    <i />
    <i />
    <i />
  </div>
);

export const Bola = ({ classe, x, y, d }) => <div className={classe} style={caixa(x, y, d, d)} aria-hidden="true" />;

export function BotaoRedondo({ x, y, d, titulo, onClick }) {
  const p = Math.round(d * 0.1);
  return (
    <>
      <div className="round-well" style={caixa(x - p, y - p, d + 2 * p, d + 2 * p + 3)} />
      <button type="button" className="round-btn" style={caixa(x, y, d, d)} aria-label={titulo} onClick={onClick} />
    </>
  );
}

export function Pilula({ cor, x, y, w, h, titulo, onClick }) {
  return (
    <>
      <div className="pill-well" style={caixa(x - 3, y - 3, w + 6, h + 8)} />
      <button type="button" className={`pill ${cor}`} style={caixa(x, y, w, h)} aria-label={titulo} onClick={onClick} />
    </>
  );
}
