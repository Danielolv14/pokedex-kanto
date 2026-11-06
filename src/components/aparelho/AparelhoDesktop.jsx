import { Corpo, Moldura, Tampa } from './Carcaca';
import { AltoFalante, Bola, Dobradica, Dpad, Leds, Lente, MiniDisplay, Rotulo, VerdeDisplay } from './Pecas';
import { Botoes, CapaFechada, Chaves, Lcd, Tela2, Teclas, inerte } from './Controles';

const CORPO_D = { w: 640, h: 790, hi: 340, diag: 400, step: 48, r: 26, sulco: 104 };

const TAMPA_D = { w: 560, h: 686, low: 160, diag: 220, step: 48, r: 24 };

export function AparelhoDesktop({ ap }) {
  const fechada = ap.fase === 'fechada';
  return (
    <>
      <div className="floor-shadow" style={fechada ? { left: 324, top: 808, width: 600, height: 90 } : { left: 50, top: 808, width: 1140, height: 90 }} />
      <div className="corpo-wrap" style={{ left: 0, top: 66, width: 640, height: 800 }}>
        <Corpo g={CORPO_D} />
        <Lente x={28} y={8} d={92} pulsando={ap.pulso} />
        <Leds x={140} y={18} d={16} gap={12} ligados={!fechada} piscando={ap.pisca} />
        <div className="engraved" style={{ left: 424, top: 62, fontSize: 14 }} aria-hidden="true">POKÉDEX</div>
        <Chaves x={424} y={90} ap={ap} />
        <div {...inerte(fechada)}>
          <Moldura x={32} y={176} w={576} h={444} chanfro={44} />
          <Bola classe="bezel-dot" x={303} y={187} d={10} />
          <Bola classe="bezel-dot" x={327} y={187} d={10} />
          <Lcd x={56} y={204} w={528} h={372} ap={ap}>{ap.lcd}</Lcd>
          <Bola classe="bezel-btn" x={96} y={588} d={20} />
          <AltoFalante x={500} y={588} w={72} />
          <Botoes ap={ap} redondo={{ x: 40, y: 640, d: 60 }} pilulas={[{ x: 132, y: 646, w: 70, h: 14 }, { x: 216, y: 646, w: 70, h: 14 }]} />
          <Rotulo x={26} y={710} w={88}>ALEATÓRIO</Rotulo>
          <Rotulo x={132} y={666} w={70}>BUSCAR</Rotulo>
          <Rotulo x={216} y={666} w={70}>TIPOS</Rotulo>
          <VerdeDisplay x={132} y={686} w={222} h={70} linhas={ap.gd} />
          <Dpad x={452} y={636} s={120} apertada={ap.dpad} onDirecao={ap.ctl.mover} />
          <Rotulo x={452} y={764} w={120}>NAVEGAR</Rotulo>
        </div>
        <CapaFechada g={CORPO_D} emblema={{ cy: 380, r: 74 }} dica={{ x: 120, y: 486, w: 400 }} ap={ap} />
        <Dobradica x={642} y={168} w={36} h={604} />
      </div>
      <div className="tampa-wrap" style={{ left: 680, top: 170, width: 560, height: 696 }} {...inerte(fechada)}>
        <Tampa g={TAMPA_D} />
        <Tela2 x={36} y={76} w={488} h={356} ap={ap} rotulo="Tela de detalhes">{ap.s2}</Tela2>
        <Teclas x0={36} y0={456} w={88} h={40} gx={12} gy={10} fonte={10} ap={ap} />
        <div className="white-bar" style={{ left: 36, top: 568, width: 110, height: 12 }} />
        <div className="white-bar" style={{ left: 160, top: 568, width: 110, height: 12 }} />
        <div className="led yellow" style={{ left: 500, top: 564, width: 20, height: 20, '--i': 3 }} />
        <MiniDisplay x={36} y={600} w={236} h={56} rotulo={ap.mini[0][0]} valor={ap.mini[0][1]} />
        <MiniDisplay x={288} y={600} w={236} h={56} rotulo={ap.mini[1][0]} valor={ap.mini[1][1]} />
      </div>
    </>
  );
}
