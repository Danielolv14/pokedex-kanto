import { Corpo, Moldura, Placa } from './Carcaca';
import { AltoFalante, Bola, Dobradica, Dpad, Leds, Lente, MiniDisplay, Rotulo, VerdeDisplay } from './Pecas';
import { Botoes, CapaFechada, Chaves, Lcd, Tela2, Teclas, inerte } from './Controles';

const CORPO_T = { w: 720, h: 650, hi: 400, diag: 450, step: 44, r: 26, sulco: 100 };

export function AparelhoTablet({ ap }) {
  const fechada = ap.fase === 'fechada';
  return (
    <>
      <div className="corpo-wrap" style={{ left: 10, top: 6, width: 720, height: 660 }}>
        <Dobradica x={60} y={648} w={600} h={28} vertical={false} />
        <Corpo g={CORPO_T} />
        <Lente x={26} y={8} d={88} pulsando={ap.pulso} />
        <Leds x={134} y={16} d={16} gap={12} ligados={!fechada} piscando={ap.pisca} />
        <div className="engraved" style={{ left: 470, top: 56, fontSize: 12 }} aria-hidden="true">POKÉDEX</div>
        <Chaves x={470} y={80} ap={ap} />
        <div {...inerte(fechada)}>
          <Moldura x={24} y={160} w={672} h={402} chanfro={40} />
          <Bola classe="bezel-dot" x={343} y={170} d={10} />
          <Bola classe="bezel-dot" x={367} y={170} d={10} />
          <Lcd x={46} y={188} w={628} h={338} ap={ap}>{ap.lcd}</Lcd>
          <Bola classe="bezel-btn" x={90} y={534} d={18} />
          <AltoFalante x={600} y={532} w={72} />
          <Botoes ap={ap} redondo={{ x: 34, y: 576, d: 50 }} pilulas={[{ x: 112, y: 582, w: 62, h: 12 }, { x: 186, y: 582, w: 62, h: 12 }]} />
          <Rotulo x={18} y={632} w={82}>ALEATÓRIO</Rotulo>
          <Rotulo x={112} y={600} w={62}>BUSCAR</Rotulo>
          <Rotulo x={186} y={600} w={62}>TIPOS</Rotulo>
          <VerdeDisplay x={262} y={576} w={210} h={62} linhas={ap.gd} />
          <Rotulo x={500} y={602} w={90}>NAVEGAR</Rotulo>
          <Dpad x={604} y={566} s={78} apertada={ap.dpad} onDirecao={ap.ctl.mover} />
        </div>
        <CapaFechada g={CORPO_T} emblema={{ cy: 360, r: 70 }} dica={{ x: 160, y: 452, w: 400 }} ap={ap} />
      </div>
      <div className="tampa-wrap" style={{ left: 10, top: 692, width: 720, height: 320 }} {...inerte(fechada)}>
        <Placa w={720} h={306} r={24} chanfro={40} />
        <Tela2 x={24} y={20} w={428} h={268} ap={ap} rotulo="Tela de detalhes">{ap.s2}</Tela2>
        <Teclas x0={476} y0={20} w={106} h={38} gx={10} gy={8} fonte={10} colunas={2} ap={ap} />
        <MiniDisplay x={476} y={250} w={200} h={40} rotulo={ap.mini[0][0]} valor={ap.mini[0][1]} />
        <div className="led yellow" style={{ left: 688, top: 254, width: 14, height: 14, '--i': 3 }} />
      </div>
    </>
  );
}
