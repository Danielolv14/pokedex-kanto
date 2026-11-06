import { Corpo, Moldura, Tampa } from './Carcaca';
import { AltoFalante, Bola, Dobradica, Dpad, Leds, Lente, MiniDisplay, Rotulo, Tecla, VerdeDisplay } from './Pecas';
import { Botoes, CapaFechada, ChavesMob, Lcd, MODOS, TECLAS, Tela2, Teclas, inerte } from './Controles';

const CORPO_M = { w: 370, h: 814, hi: 200, diag: 240, step: 34, r: 24, sulco: 90 };

const TAMPA_M = { w: 350, h: 814, low: 100, diag: 150, step: 40, r: 24 };

export function AparelhoMobile({ ap }) {
  const fechada = ap.fase === 'fechada';
  return (
    <div className={`mob-trilho${ap.abaMobile ? ' na-tampa' : ''}`}>
      <div className="lado" style={{ left: 0 }} {...inerte(ap.abaMobile)}>
        <div className="corpo-wrap" style={{ left: 5, top: 5, width: 370, height: 824 }}>
          <Corpo g={CORPO_M} />
          <Lente x={16} y={8} d={74} pulsando={ap.pulso} />
          <Leds x={104} y={14} d={13} gap={9} ligados={!fechada} piscando={ap.pisca} />
          <div className="engraved" style={{ left: 104, top: 44, fontSize: 10 }} aria-hidden="true">POKÉDEX</div>
          <ChavesMob x={262} y={44} ap={ap} />
          <div {...inerte(fechada)}>
            <Moldura x={10} y={132} w={350} h={486} chanfro={34} />
            <Bola classe="bezel-dot" x={172} y={141} d={9} />
            <Bola classe="bezel-dot" x={189} y={141} d={9} />
            <Lcd x={24} y={156} w={322} h={428} ap={ap}>{ap.lcd}</Lcd>
            <Bola classe="bezel-btn" x={60} y={592} d={16} />
            <AltoFalante x={276} y={592} w={60} />
            {TECLAS.slice(0, 5).map(([rotulo, icone, id, titulo], i) => (
              <Tecla
                key={id}
                x={12 + i * 70}
                y={632}
                w={64}
                h={40}
                rotulo={rotulo}
                icone={icone}
                fonte={8}
                titulo={titulo}
                ativa={MODOS.has(id) ? ap.modo === id : undefined}
                onClick={() => ap.ctl.tecla(id)}
              />
            ))}
            <Botoes ap={ap} redondo={{ x: 22, y: 690, d: 50 }} pilulas={[{ x: 92, y: 694, w: 52, h: 10 }, { x: 154, y: 694, w: 52, h: 10 }]} />
            <Rotulo x={6} y={746} w={82}>ALEATÓRIO</Rotulo>
            <Rotulo x={92} y={708} w={52}>BUSCAR</Rotulo>
            <Rotulo x={154} y={708} w={52}>TIPOS</Rotulo>
            <VerdeDisplay x={92} y={726} w={140} h={58} linhas={ap.gd} fonte={19} />
            <Dpad x={252} y={686} s={102} apertada={ap.dpad} onDirecao={ap.ctl.mover} />
            <Rotulo x={252} y={794} w={102}>NAVEGAR</Rotulo>
          </div>
          <CapaFechada g={CORPO_M} emblema={{ cy: 370, r: 64 }} dica={{ x: 55, y: 462, w: 260 }} ap={ap} />
        </div>
      </div>
      <div className="lado" style={{ left: 380 }} {...inerte(!ap.abaMobile)}>
        <div className="abs" style={{ left: 5, top: 5, width: 370, height: 824 }}>
          <Dobradica x={0} y={60} w={22} h={700} />
          <div className="abs" style={{ left: 20, top: 0, width: 350, height: 824 }}>
            <Tampa g={TAMPA_M} />
            <Tecla x={16} y={52} w={104} h={34} rotulo="VOLTAR" icone="left" fonte={10} titulo="Voltar para a lista" onClick={ap.ctl.voltar} />
            <MiniDisplay x={170} y={14} w={164} h={52} rotulo="Nº" valor={ap.numMobile} />
            <Tela2 x={16} y={100} w={318} h={470} ap={ap} rotulo="Tela de detalhes">{ap.abaMobile ? ap.s2 : null}</Tela2>
            <Teclas x0={16} y0={588} w={58} h={40} gx={6} gy={8} fonte={8} ap={ap} />
            <div className="white-bar" style={{ left: 16, top: 694, width: 100, height: 10 }} />
            <div className="white-bar" style={{ left: 126, top: 694, width: 100, height: 10 }} />
            <div className="led yellow" style={{ left: 306, top: 690, width: 18, height: 18 }} />
            <MiniDisplay x={16} y={720} w={154} h={56} rotulo={ap.mini[0][0]} valor={ap.mini[0][1]} />
            <MiniDisplay x={180} y={720} w={154} h={56} rotulo={ap.mini[1][0]} valor={ap.mini[1][1]} />
          </div>
        </div>
      </div>
    </div>
  );
}
