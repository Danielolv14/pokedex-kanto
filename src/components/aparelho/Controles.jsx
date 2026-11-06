import Icone from '../comum/Icone';
import { Capa } from './Carcaca';
import { BotaoRedondo, Interruptor, Pilula, Tecla } from './Pecas';

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

export const MODOS = new Set(['pokedex', 'treinadores', 'comparar', 'favoritos']);

export const inerte = (sim) => (sim ? { inert: '' } : {});

export function Teclas({ x0, y0, w, h, gx, gy, fonte, colunas = 5, quantas = 10, ap }) {
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

export function Chaves({ x, y, gap = 100, ap }) {
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

export function ChavesMob({ x, y, ap }) {
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

export function CapaFechada({ g, emblema, dica, ap }) {
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

export function Lcd({ x, y, w, h, children, ap }) {
  return (
    <div className="lcd" style={{ left: x, top: y, width: w, height: h }}>
      {ap.fase !== 'fechada' && <div className="tela-viva">{children}</div>}
    </div>
  );
}

export function Tela2({ x, y, w, h, children, ap, rotulo }) {
  return (
    <section className="screen2" style={{ left: x, top: y, width: w, height: h }} aria-label={rotulo}>
      {ap.fase !== 'fechada' && <div className="tela-viva">{children}</div>}
    </section>
  );
}

export const Botoes = ({ ap, redondo, pilulas }) => (
  <>
    <BotaoRedondo {...redondo} titulo="Pokémon aleatório" onClick={() => ap.ctl.tecla('aleatorio')} />
    <Pilula cor="red" {...pilulas[0]} titulo="Buscar" onClick={ap.ctl.focarBusca} />
    <Pilula cor="blue" {...pilulas[1]} titulo="Filtrar por tipo" onClick={ap.ctl.abrirTipos} />
  </>
);
