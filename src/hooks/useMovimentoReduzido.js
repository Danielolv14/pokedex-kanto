import { useEffect, useState } from 'react';

const CONSULTA = '(prefers-reduced-motion: reduce)';

export default function useMovimentoReduzido() {
  const [reduzido, setReduzido] = useState(() => window.matchMedia(CONSULTA).matches);

  useEffect(() => {
    const mq = window.matchMedia(CONSULTA);
    const aoMudar = () => setReduzido(mq.matches);
    mq.addEventListener('change', aoMudar);
    return () => mq.removeEventListener('change', aoMudar);
  }, []);

  return reduzido;
}
