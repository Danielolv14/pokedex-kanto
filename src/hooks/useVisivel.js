import { useEffect, useState } from 'react';

// Fica true na primeira vez que o elemento aparece na tela (carregamento preguiçoso das imagens).
export default function useVisivel(ref) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visivel) return undefined;
    if (!('IntersectionObserver' in window)) {
      setVisivel(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { rootMargin: '120px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, visivel]);

  return visivel;
}
