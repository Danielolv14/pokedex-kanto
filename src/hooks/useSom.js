import { useCallback, useRef } from 'react';

// Bipes curtos gerados com Web Audio (onda quadrada, como um portátil antigo).
const TONS = {
  nav: [[880, 0.035]],
  tecla: [[660, 0.05]],
  ok: [[784, 0.05], [1175, 0.07]],
  erro: [[220, 0.12]],
  sorteio: [[523, 0.05], [659, 0.05], [784, 0.05], [1047, 0.09]],
  liga: [[392, 0.07], [523, 0.07], [784, 0.12]],
};

export default function useSom(ligado) {
  const ctx = useRef(null);

  return useCallback(
    (tipo = 'nav') => {
      if (!ligado) return;
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      ctx.current ??= new Audio();
      const ac = ctx.current;
      if (ac.state === 'suspended') ac.resume();
      let t = ac.currentTime;
      TONS[tipo].forEach(([freq, dur]) => {
        const osc = ac.createOscillator();
        const ganho = ac.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        ganho.gain.setValueAtTime(0.045, t);
        ganho.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(ganho).connect(ac.destination);
        osc.start(t);
        osc.stop(t + dur + 0.01);
        t += dur;
      });
    },
    [ligado],
  );
}
