import Icone, { Pokebola } from './Icone';
import { Capa, Corpo, Moldura, Placa, Tampa } from './Carcaca';
import { AltoFalante, Bola, BotaoRedondo, Dobradica, Dpad, Interruptor, Leds, Lente, MiniDisplay, Pilula, Rotulo, Tecla, VerdeDisplay } from './Pecas';

export const TECLAS = [
  ['POKÉDEX', 'list', 'pokedex', 'Modo Pokédex'],
  ['TREINAD.', 'person', 'treinadores', 'Modo treinadores'],
  ['COMPARAR', 'vs', 'comparar', 'Modo comparar'],
  ['FAVORIT.', 'star', 'favoritos', 'Modo favoritos'],
  ['ALEATÓR.', 'dice', 'aleatorio', 'Pokémon aleatório'],
  ['ANT.', 'left', 'ant', 'Anterior'],
  ['PRÓX.', 'right', 'prox', 'Próximo'],
  ['MARCAR', 'starO', 'marcar', 'Marcar ou desmarcar favorito'],
  ['+ VS', 'plus', 'vs', 'Adicionar à comparação'],
  ['LIMPAR', 'eraser', 'limpar', 'Limpar'],
];
const MODOS = new Set(['pokedex', 'treinadores', 'comparar', 'favoritos']);

const inerte = (sim) => (sim ? { inert: '' } : {});

function Teclas({ x0, y0, w, h, gx, gy, fonte, colunas = 5, quantas = 10, ap }) {
  return TECLAS.slice(0, quantas).map(([rotulo, icone, id, titulo], i) => {
    const col = colunas === 5 ? i % 5 : i < 5 ? 0 : 1;
    const lin = colunas === 5 ? (i < 5 ? 0 : 1) : i % 5;
    return (
      <Tecla
        key={id}
        x={x0 + col * (w + gx)}
        y={y0 + lin * (h + gy)}
        w={w}
        h={h}
        rotulo={rotulo}
        icone={icone}
        fonte={fonte}
        titulo={titulo}
        ativa={MODOS.has(id) ? ap.modo === id : undefined}
        onClick={() => ap.ctl.tecla(id)}
      />
    );
  });
}

const LEG = '#ffe9ec';
function Chaves({ x, y, gap = 100, ap }) {
  return (
    <>
      <Interruptor
        x={x}
        y={y}
        rotulo="TEMA"
        esq={<Icone nome="moon" tamanho={9} cor={LEG} />}
        dir={<Icone nome="sun" tamanho={9} cor={LEG} />}
        ligado={ap.ctl.tema === 'claro'}
        titulo="Tema claro"
        onChange={(v) => ap.ctl.setTema(v ? 'claro' : 'escuro')}
      />
      <Interruptor x={x + gap} y={y} rotulo="SOM" esq="OFF" dir="ON" ligado={ap.ctl.som} titulo="Som dos botões" onChange={ap.ctl.setSom} />
    </>
  );
}

function ChavesMob({ x, y, ap }) {
  return (
    <>
      <Interruptor
        x={x}
        y={y}
        w={44}
        h={20}
        L={20}
        rotulo={<Icone nome="sun" tamanho={13} cor={LEG} />}
        ligado={ap.ctl.tema === 'claro'}
        titulo="Tema claro"
        onChange={(v) => ap.ctl.setTema(v ? 'claro' : 'escuro')}
      />
      <Interruptor x={x} y={y + 30} w={44} h={20} L={20} rotulo={<Icone nome="sound" tamanho={13} cor={LEG} />} ligado={ap.ctl.som} titulo="Som dos botões" onChange={ap.ctl.setSom} />
    </>
  );
}

function CapaFechada({ g, emblema, dica, ap }) {
  if (ap.fase === 'aberta') return null;
  return (
    <div className="capa-wrap" style={{ width: g.w, height: g.h + 12 }}>
      <Capa g={g} emblema={emblema} />
      <div className="cover-hint" style={{ left: dica.x, top: dica.y, width: dica.w }}>
        <b>POKÉDEX</b>
        <span>TOQUE PARA ABRIR</span>
        <Icone nome="right" tamanho={24} cor="#ffd23f" />
      </div>
      {ap.fase === 'fechada' && (
        <button type="button" className="capa-toque" style={{ left: 0, top: g.sulco, width: g.w, height: g.h - g.sulco }} aria-label="Abrir a Pokédex" onClick={ap.onAbrir} autoFocus />
      )}
    </div>
  );
}

function Lcd({ x, y, w, h, children, ap }) {
  return (
    <div className="lcd" style={{ left: x, top: y, width: w, height: h }}>
      {ap.fase !== 'fechada' && <div className="tela-viva">{children}</div>}
    </div>
  );
}

function Tela2({ x, y, w, h, children, ap, rotulo }) {
  return (
    <section className="screen2" style={{ left: x, top: y, width: w, height: h }} aria-label={rotulo}>
      {ap.fase !== 'fechada' && <div className="tela-viva">{children}</div>}
    </section>
  );
}

const Botoes = ({ ap, redondo, pilulas }) => (
  <>
    <BotaoRedondo {...redondo} titulo="Pokémon aleatório" onClick={() => ap.ctl.tecla('aleatorio')} />
    <Pilula cor="red" {...pilulas[0]} titulo="Buscar" onClick={ap.ctl.focarBusca} />
    <Pilula cor="blue" {...pilulas[1]} titulo="Filtrar por tipo" onClick={ap.ctl.abrirTipos} />
  </>
);

/* ================= desktop ================= */
const CORPO_D = { w: 640, h: 790, hi: 340, diag: 400, step: 48, r: 26, sulco: 104 };
const TAMPA_D = { w: 560, h: 686, low: 160, diag: 220, step: 48, r: 24 };

export function CabecalhoApp() {
  return (
    <header className="app-header" style={{ left: 0, top: 6, width: 1240, height: 44 }}>
      <div className="brand">
        <Pokebola tamanho={32} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h1 className="brand-name">POKÉDEX</h1>
          <span className="brand-sub">KANTO · 151 POKÉMON · 12 TREINADORES</span>
        </div>
      </div>
      <div className="kbd-hint" aria-label="Atalhos do teclado">
        <kbd>↑</kbd>
        <kbd>↓</kbd>navegar<kbd>←</kbd>
        <kbd>→</kbd>página<kbd>/</kbd>buscar<kbd>R</kbd>aleatório
      </div>
    </header>
  );
}

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

/* ================= tablet ================= */
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

/* ================= mobile ================= */
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
