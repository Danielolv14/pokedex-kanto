import { useEffect, useState } from 'react';

// Cada aparelho é desenhado num tamanho fixo e escalado para caber na janela.
export const PALCOS = {
  desktop: { w: 1240, h: 900 },
  tablet: { w: 744, h: 1030 },
  mobile: { w: 380, h: 844 },
};

function medir() {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const tipo = vw >= 1000 && vw / vh >= 1.1 ? 'desktop' : vw >= 640 ? 'tablet' : 'mobile';
  const palco = PALCOS[tipo];
  const margem = tipo === 'mobile' ? 0 : 24;
  const escala = Math.min((vw - margem) / palco.w, (vh - margem) / palco.h, tipo === 'desktop' ? 1.3 : 1.6);
  return { tipo, escala: Math.max(escala, 0.3) };
}

export default function useLayout() {
  const [layout, setLayout] = useState(medir);

  useEffect(() => {
    const aoMudar = () => setLayout(medir());
    window.addEventListener('resize', aoMudar);
    return () => window.removeEventListener('resize', aoMudar);
  }, []);

  return layout;
}
