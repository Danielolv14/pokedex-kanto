import { useEffect, useRef, useState } from 'react';

// Lista com rolagem real e a barrinha de rolagem desenhada no LCD.
export function Rolagem({ alvo, reinicio, rotulo, children }) {
  const ref = useRef(null);
  const [barra, setBarra] = useState({ topo: 0, altura: 1 });

  const medir = () => {
    const el = ref.current;
    if (!el) return;
    const altura = el.scrollHeight ? el.clientHeight / el.scrollHeight : 1;
    const topo = el.scrollHeight ? el.scrollTop / el.scrollHeight : 0;
    setBarra((b) => (Math.abs(b.topo - topo) < 0.001 && Math.abs(b.altura - altura) < 0.001 ? b : { topo, altura }));
  };

  useEffect(medir);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
  }, [reinicio]);

  useEffect(() => {
    const el = ref.current;
    const item = alvo == null ? null : el?.querySelector(`[data-id="${alvo}"]`);
    if (!item) return;
    const cima = item.offsetTop - 4;
    const baixo = item.offsetTop + item.offsetHeight + 4;
    if (cima < el.scrollTop) el.scrollTop = cima;
    else if (baixo > el.scrollTop + el.clientHeight) el.scrollTop = baixo - el.clientHeight;
  }, [alvo, reinicio]);

  return (
    <div className="rolagem">
      <div className="list" ref={ref} onScroll={medir} role="list" aria-label={rotulo}>
        {children}
      </div>
      {barra.altura < 1 && (
        <div className="scrollbar">
          <i style={{ top: `${barra.topo * 100}%`, height: `${Math.max(barra.altura, 0.06) * 100}%` }} />
        </div>
      )}
    </div>
  );
}
