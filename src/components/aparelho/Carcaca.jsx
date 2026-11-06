import { useId } from 'react';

// Peças de plástico desenhadas em SVG com coordenadas em pixels (sem escala de viewBox).
export const useIdSvg = () => useId().replace(/[^a-zA-Z0-9]/g, '');

const PLASTICO = { topo: '#ec2843', meio: '#dc0a2d', base: '#b5021f', parede: ['#9a001c', '#4a000d'] };

// Volume do plástico: parede embaixo, luz do alto à esquerda e borda chanfrada.
function Casca({ w, h, face, parede, t = 12, dentro, fora }) {
  const k = useIdSvg();
  const p = PLASTICO;
  return (
    <svg className="abs casca" style={{ left: 0, top: 0 }} width={w} height={h + t} viewBox={`0 0 ${w} ${h + t}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${k}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.topo} />
          <stop offset=".42" stopColor={p.meio} />
          <stop offset="1" stopColor={p.base} />
        </linearGradient>
        <linearGradient id={`${k}l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".14" />
          <stop offset=".16" stopColor="#fff" stopOpacity="0" />
          <stop offset=".84" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
        <radialGradient id={`${k}s`} cx=".24" cy=".08" r=".6">
          <stop offset="0" stopColor="#fff" stopOpacity=".22" />
          <stop offset=".55" stopColor="#fff" stopOpacity=".04" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${k}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".75" />
          <stop offset=".12" stopColor="#fff" stopOpacity=".18" />
          <stop offset=".85" stopColor="#000" stopOpacity=".05" />
          <stop offset="1" stopColor="#000" stopOpacity=".35" />
        </linearGradient>
        <linearGradient id={`${k}w`} gradientUnits="userSpaceOnUse" x1="0" y1={h - 6} x2="0" y2={h + t}>
          <stop offset="0" stopColor={p.parede[0]} />
          <stop offset="1" stopColor={p.parede[1]} />
        </linearGradient>
        <radialGradient id={`${k}m`} cx=".35" cy=".3" r=".75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".45" stopColor="#c9cdd3" />
          <stop offset="1" stopColor="#6f757d" />
        </radialGradient>
        <clipPath id={`${k}c`}>
          <path d={face} />
        </clipPath>
      </defs>
      <path d={parede} fill={`url(#${k}w)`} />
      <path d={face} fill={`url(#${k}f)`} />
      <g clipPath={`url(#${k}c)`}>
        <path d={face} fill={`url(#${k}l)`} />
        <path d={face} fill={`url(#${k}s)`} />
        {dentro}
        <path d={face} fill="none" stroke={`url(#${k}b)`} strokeWidth="5" />
      </g>
      {fora?.(k)}
    </svg>
  );
}

// Sulco moldado: sombra em cima, fundo escuro e luz na borda de baixo.
function Sulco({ linha }) {
  return (
    <>
      <path d={linha(-1.5)} stroke="#7a0016" strokeOpacity=".35" strokeWidth="3" fill="none" />
      <path d={linha(0)} stroke="#4f000e" strokeWidth="2.4" fill="none" />
      <path d={linha(2.2)} stroke="#ff9aa7" strokeOpacity=".55" strokeWidth="1.4" fill="none" />
    </>
  );
}

const parafusos = (pontos, r) => (k) =>
  r
    ? pontos.map(([x, y]) => {
        const a = +(r * 0.55).toFixed(1);
        return (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y + 1} r={r + 1.5} fill="#4a000d" opacity=".55" />
            <circle cx={x} cy={y} r={r} fill={`url(#${k}m)`} stroke="#5e0012" strokeWidth=".8" />
            <path d={`M${x - a} ${y - a} L${x + a} ${y + a} M${x + a} ${y - a} L${x - a} ${y + a}`} stroke="#4b5057" strokeWidth="1.3" />
          </g>
        );
      })
    : null;

const pathCorpo = ({ w, h, hi, diag, step, r }, dy = 0) =>
  `M${r} ${dy} H${hi} L${diag} ${step + dy} H${w - 8} Q${w} ${step + dy} ${w} ${step + 8 + dy} V${h - 8 + dy} Q${w} ${h + dy} ${w - 8} ${h + dy} H${r} Q0 ${h + dy} 0 ${h - r + dy} V${r + dy} Q0 ${dy} ${r} ${dy} Z`;

export function Corpo({ g }) {
  const { w, h, hi, diag, step, sulco } = g;
  const linha = (dy) => `M0 ${sulco + dy} H${hi} L${diag} ${sulco + step + dy} H${w}`;
  const r = w < 200 ? 0 : Math.max(4, Math.round(w / 110));
  const m = Math.round(r * 2.8);
  return (
    <Casca
      w={w}
      h={h}
      face={pathCorpo(g)}
      parede={pathCorpo(g, 12)}
      dentro={<Sulco linha={linha} />}
      fora={parafusos([[m, h - m], [w - m, h - m], [w - m, step + m]], r)}
    />
  );
}

const pathTampa = ({ w, h, low, diag, step, r }, dy = 0) =>
  `M8 ${step + dy} H${low} L${diag} ${dy} H${w - r} Q${w} ${dy} ${w} ${r + dy} V${h - r + dy} Q${w} ${h + dy} ${w - r} ${h + dy} H8 Q0 ${h + dy} 0 ${h - 8 + dy} V${step + 8 + dy} Q0 ${step + dy} 8 ${step + dy} Z`;

export function Tampa({ g }) {
  const { w, h } = g;
  const r = w < 200 ? 0 : Math.max(4, Math.round(w / 100));
  const m = Math.round(r * 2.8);
  return <Casca w={w} h={h} face={pathTampa(g)} parede={pathTampa(g, 12)} fora={parafusos([[m, h - m], [w - m, h - m]], r)} />;
}

export function Placa({ w, h, r = 24, chanfro = 40 }) {
  const d = (dy) =>
    `M${r} ${dy} H${w - r} Q${w} ${dy} ${w} ${r + dy} V${h - chanfro + dy} L${w - chanfro} ${h + dy} H${r} Q0 ${h + dy} 0 ${h - r + dy} V${r + dy} Q0 ${dy} ${r} ${dy} Z`;
  return <Casca w={w} h={h} face={d(0)} parede={d(12)} />;
}

// Moldura cinza em relevo: sombra projetada, espessura e borda iluminada.
export function Moldura({ x, y, w, h, chanfro = 40 }) {
  const k = useIdSvg();
  const r = 10;
  const d = (dy) =>
    `M${r} ${1 + dy} H${w - r} Q${w - 1} ${1 + dy} ${w - 1} ${r + dy} V${h - r + dy} Q${w - 1} ${h - 1 + dy} ${w - r} ${h - 1 + dy} H${chanfro} L1 ${h - chanfro + dy} V${r + dy} Q1 ${1 + dy} ${r} ${1 + dy} Z`;
  return (
    <svg className="abs" style={{ left: x, top: y }} width={w} height={h + 14} viewBox={`0 0 ${w} ${h + 14}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${k}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbfbfb" />
          <stop offset=".5" stopColor="#e2e2e2" />
          <stop offset="1" stopColor="#cbcbcb" />
        </linearGradient>
        <linearGradient id={`${k}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset=".1" stopColor="#fff" stopOpacity=".3" />
          <stop offset=".9" stopColor="#000" stopOpacity=".04" />
          <stop offset="1" stopColor="#000" stopOpacity=".28" />
        </linearGradient>
        <filter id={`${k}x`} x="-5%" y="-5%" width="110%" height="120%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <clipPath id={`${k}c`}>
          <path d={d(0)} />
        </clipPath>
      </defs>
      <path d={d(8)} fill="#3d000b" opacity=".45" filter={`url(#${k}x)`} />
      <path d={d(4)} fill="#8f8f8f" />
      <path d={d(0)} fill={`url(#${k}f)`} />
      <g clipPath={`url(#${k}c)`}>
        <path d={d(0)} fill="none" stroke={`url(#${k}b)`} strokeWidth="4" />
      </g>
    </svg>
  );
}

// Capa fechada: painel e emblema rebaixados, trava e frestinha no encaixe com o corpo.
export function Capa({ g, emblema }) {
  const { w, h, hi, diag, step, r, sulco } = g;
  const face = (dy) => `M0 ${sulco + dy} H${hi} L${diag} ${sulco + step + dy} H${w} V${h - 8 + dy} Q${w} ${h + dy} ${w - 8} ${h + dy} H${r} Q0 ${h + dy} 0 ${h - r + dy} Z`;
  const i = 14;
  const painel = (dy) =>
    `M${i} ${sulco + i + dy} H${hi - 6} L${diag - 6} ${sulco + step + i + dy} H${w - i} V${h - i - 6 + dy} Q${w - i} ${h - i + dy} ${w - i - 6} ${h - i + dy} H${r} Q${i} ${h - i + dy} ${i} ${h - r + dy} Z`;
  const bola = (dy, cor, op) => (
    <g stroke={cor} strokeWidth="5" fill="none" opacity={op}>
      <circle cx={w / 2} cy={emblema.cy + dy} r={emblema.r} />
      <path d={`M${w / 2 - emblema.r} ${emblema.cy + dy} H${w / 2 - emblema.r * 0.32} M${w / 2 + emblema.r * 0.32} ${emblema.cy + dy} H${w / 2 + emblema.r}`} />
      <circle cx={w / 2} cy={emblema.cy + dy} r={emblema.r * 0.3} />
    </g>
  );
  const ty = Math.round(h * 0.52);
  return (
    <Casca
      w={w}
      h={h}
      face={face(0)}
      parede={face(12)}
      dentro={
        <>
          <path d={painel(1.6)} fill="none" stroke="#ff9aa7" strokeWidth="2" opacity=".45" />
          <path d={painel(0)} fill="none" stroke="#5a0010" strokeWidth="2" opacity=".55" />
          {bola(1.8, '#ff9aa7', 0.45)}
          {bola(0, '#5a0010', 0.6)}
          <rect x={w - 13} y={ty} width="9" height="70" rx="4" fill="#4f000e" />
          <rect x={w - 11} y={ty + 3} width="2" height="64" rx="1" fill="#ff9aa7" opacity=".5" />
        </>
      }
      fora={() => <path d={`M0 ${sulco - 1} H${hi} L${diag} ${sulco + step - 1} H${w}`} stroke="#3d000b" strokeWidth="2" opacity=".6" fill="none" />}
    />
  );
}
