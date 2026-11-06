const ESTRELA = 'M8 1.2 L10.1 5.6 L14.9 6.2 L11.4 9.5 L12.3 14.3 L8 12 L3.7 14.3 L4.6 9.5 L1.1 6.2 L5.9 5.6 Z';

const DESENHOS = {
  search: (c) => (
    <>
      <circle cx="7" cy="7" r="4.6" stroke={c} strokeWidth="2" />
      <path d="M10.4 10.4 L14.2 14.2" stroke={c} strokeWidth="2.2" strokeLinecap="square" />
    </>
  ),
  chev: (c) => <path d="M3.5 6 L8 10.5 L12.5 6" stroke={c} strokeWidth="2" fill="none" />,
  star: (c) => <path d={ESTRELA} fill={c} />,
  starO: (c) => <path d={ESTRELA} stroke={c} strokeWidth="1.4" fill="none" />,
  dice: (c) => (
    <>
      <rect x="2" y="2" width="12" height="12" rx="2.5" stroke={c} strokeWidth="1.6" />
      {[[5.3, 5.3], [10.7, 5.3], [8, 8], [5.3, 10.7], [10.7, 10.7]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.25" fill={c} />
      ))}
    </>
  ),
  list: (c) => (
    <>
      {[3, 7, 11].map((y) => <rect key={y} x="2" y={y} width="2" height="2" fill={c} />)}
      <path d="M6 4 H14 M6 8 H14 M6 12 H14" stroke={c} strokeWidth="1.8" />
    </>
  ),
  person: (c) => (
    <>
      <circle cx="8" cy="5" r="3" stroke={c} strokeWidth="1.8" />
      <path d="M2.5 14.5 C2.5 11 5 9.5 8 9.5 C11 9.5 13.5 11 13.5 14.5" stroke={c} strokeWidth="1.8" />
    </>
  ),
  vs: (c) => <path d="M2 2 L9.5 9.5 M14 2 L6.5 9.5 M3 9 L7 13 M13 9 L9 13 M4.5 11.5 L2 14 M11.5 11.5 L14 14" stroke={c} strokeWidth="1.8" />,
  left: (c) => <path d="M11 3 L5 8 L11 13 Z" fill={c} />,
  right: (c) => <path d="M5 3 L11 8 L5 13 Z" fill={c} />,
  up: (c) => <path d="M3 11 L8 5 L13 11 Z" fill={c} />,
  down: (c) => <path d="M3 5 L8 11 L13 5 Z" fill={c} />,
  plus: (c) => <path d="M8 3 V13 M3 8 H13" stroke={c} strokeWidth="2.2" />,
  x: (c) => <path d="M4 4 L12 12 M12 4 L4 12" stroke={c} strokeWidth="2" />,
  sun: (c) => (
    <>
      <circle cx="8" cy="8" r="3" stroke={c} strokeWidth="1.8" />
      <path d="M8 1 V2.8 M8 13.2 V15 M1 8 H2.8 M13.2 8 H15 M3 3 L4.3 4.3 M11.7 11.7 L13 13 M13 3 L11.7 4.3 M4.3 11.7 L3 13" stroke={c} strokeWidth="1.6" />
    </>
  ),
  moon: (c) => <path d="M13.5 10.5 C11 13.5 6 13 3.8 10 C1.8 7.2 2.5 3.2 5.5 1.5 C4.5 4.5 5.8 8 8.5 9.5 C10 10.4 12 10.8 13.5 10.5 Z" fill={c} />,
  sound: (c) => (
    <>
      <path d="M2 6 H5 L9 2.5 V13.5 L5 10 H2 Z" fill={c} />
      <path d="M11 5.5 C12 6.5 12 9.5 11 10.5 M12.8 3.8 C14.8 5.8 14.8 10.2 12.8 12.2" stroke={c} strokeWidth="1.5" />
    </>
  ),
  sort: (c) => <path d="M5 2 V13 M2 10 L5 13 L8 10 M11 14 V3 M8 6 L11 3 L14 6" stroke={c} strokeWidth="1.6" />,
  filter: (c) => <path d="M2 3 H14 L9.5 8.5 V13 L6.5 14.5 V8.5 Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />,
  play: (c) => <path d="M5 3 L12 8 L5 13 Z" fill={c} />,
  eraser: (c) => <path d="M3 10 L9 4 L13 8 L8 13 H5 Z M6.5 6.5 L10.5 10.5 M8 13 H14" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />,
  ball: (c) => (
    <>
      <circle cx="8" cy="8" r="6.5" stroke={c} strokeWidth="1.6" />
      <path d="M1.5 8 H5.6 M10.4 8 H14.5" stroke={c} strokeWidth="1.6" />
      <circle cx="8" cy="8" r="2.2" stroke={c} strokeWidth="1.6" />
    </>
  ),
};

export default function Icone({ nome, tamanho = 16, cor = 'currentColor' }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      {DESENHOS[nome](cor)}
    </svg>
  );
}

export function Pokebola({ tamanho = 28 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 28 28" aria-hidden="true">
      <circle cx="14" cy="14" r="12" fill="#ffffff" stroke="#1b2130" strokeWidth="2.4" />
      <path d="M2 14 C2 7.4 7.4 2 14 2 C20.6 2 26 7.4 26 14 Z" fill="#dc0a2d" stroke="#1b2130" strokeWidth="2.4" />
      <circle cx="14" cy="14" r="4.2" fill="#ffffff" stroke="#1b2130" strokeWidth="2.4" />
    </svg>
  );
}
