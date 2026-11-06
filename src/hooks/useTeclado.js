import { useEffect, useRef } from 'react';

// Atalhos globais. Dentro de um campo de texto só valem as setas ↑↓, Enter e Esc.
export default function useTeclado(acoes, ativo = true) {
  const ref = useRef(acoes);
  ref.current = acoes;

  useEffect(() => {
    if (!ativo) return undefined;
    const aoTeclar = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const alvo = e.target;
      const digitando = alvo instanceof HTMLElement && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.isContentEditable);
      const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (digitando && !['ArrowUp', 'ArrowDown', 'Escape', 'Enter'].includes(tecla)) return;
      if (!digitando && tecla === 'Enter' && alvo instanceof HTMLButtonElement) return;
      const acao = ref.current[tecla];
      if (!acao) return;
      e.preventDefault();
      acao(e);
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [ativo]);
}
