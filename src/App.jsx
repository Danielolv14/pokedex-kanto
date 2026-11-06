import { AparelhoDesktop } from './components/aparelho/AparelhoDesktop';
import { AparelhoMobile } from './components/aparelho/AparelhoMobile';
import { AparelhoTablet } from './components/aparelho/AparelhoTablet';
import { CabecalhoApp } from './components/aparelho/CabecalhoApp';
import { textosDisplays } from './components/aparelho/displays';
import { TelaPokedex } from './components/lcd/TelaPokedex';
import { TelaTreinadores } from './components/lcd/TelaTreinadores';
import { TelaTampa } from './components/tampa/TelaTampa';
import useLayout, { PALCOS } from './hooks/useLayout';
import usePokedex from './hooks/usePokedex';
import useTeclado from './hooks/useTeclado';

const V = { desktop: 'desk', tablet: 'tab', mobile: 'mob' };
const APARELHOS = { desktop: AparelhoDesktop, tablet: AparelhoTablet, mobile: AparelhoMobile };

export default function App() {
  const { tipo: layout, escala } = useLayout();
  const v = V[layout];
  const pk = usePokedex(layout);
  useTeclado(pk.atalhos, pk.fase !== 'fechada');

  const { verde, minis, numero } = textosDisplays(pk, layout === 'mobile');
  const ap = {
    fase: pk.fase,
    onAbrir: pk.acoes.abrir,
    lcd: pk.modo === 'treinadores' ? <TelaTreinadores v={v} pk={pk} /> : <TelaPokedex v={v} pk={pk} />,
    s2: <TelaTampa v={v} pk={pk} />,
    gd: verde,
    mini: minis,
    numMobile: numero,
    modo: pk.modo,
    dpad: pk.dpad,
    pulso: pk.pulso,
    pisca: pk.pisca,
    abaMobile: pk.abaMobile,
    ctl: {
      tecla: pk.acoes.tecla,
      mover: pk.acoes.mover,
      focarBusca: pk.acoes.focarBusca,
      abrirTipos: () => pk.acoes.alternarPainel('tipos'),
      voltar: pk.acoes.voltar,
      tema: pk.tema,
      setTema: pk.acoes.setTema,
      som: pk.som,
      setSom: pk.acoes.setSom,
    },
  };

  const P = PALCOS[layout];
  const Aparelho = APARELHOS[layout];
  return (
    <main className="palco-moldura" style={{ width: P.w * escala, height: P.h * escala }}>
      {layout !== 'desktop' && <h1 className="sr-only">Pokédex de Kanto</h1>}
      <div className={`palco ${v} ${pk.fase}`} style={{ width: P.w, height: P.h, transform: `scale(${escala})` }}>
        {layout === 'desktop' && <CabecalhoApp />}
        <Aparelho ap={ap} />
      </div>
    </main>
  );
}
