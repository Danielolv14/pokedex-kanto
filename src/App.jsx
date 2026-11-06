import { useEffect, useMemo, useRef, useState } from 'react';
import { AparelhoDesktop, AparelhoMobile, AparelhoTablet, CabecalhoApp } from './components/Aparelhos';
import {
  BotaoOrdem, BotaoTipo, CabecalhoLista, CampoBusca, CardPokemon, CardTreinador, COLS, LinhaPokemon, LinhaTreinador,
  PainelOrdem, PainelTipos, Rolagem, Status, TCOLS, Vazio, rotuloOrdem,
} from './components/Lcd';
import { TelaComparar, TelaDetalhes, TelaEscolha, TelaResumo, TelaSemSinal, TelaTreinador } from './components/TelaSecundaria';
import useLayout, { PALCOS } from './hooks/useLayout';
import useLocalStorage from './hooks/useLocalStorage';
import useMovimentoReduzido from './hooks/useMovimentoReduzido';
import useSom from './hooks/useSom';
import useTeclado from './hooks/useTeclado';
import { TOTAL_POKEMON, filtrar, milhar, ordenar, pad3, porId, pokemons, total, treinadores, up } from './data/dados';

const V = { desktop: 'desk', tablet: 'tab', mobile: 'mob' };
const PAGINA = { desktop: 6, tablet: 6, mobile: 4 };
const NOME_MODO = { pokedex: 'POKÉDEX', treinadores: 'TREINADORES', comparar: 'COMPARAR', favoritos: 'FAVORITOS' };
const ORDEM_TR = { badges: 'INSÍGNIAS', name: 'NOME', id: 'Nº' };
const PROXIMA_ORDEM_TR = { badges: 'name', name: 'id', id: 'badges' };
const ORDEM_PADRAO = { campo: 'id', desc: false };

const limitar = (v, min, max) => Math.max(min, Math.min(max, v));
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

export default function App() {
  const { tipo: layout, escala } = useLayout();
  const v = V[layout];
  const reduzido = useMovimentoReduzido();
  const [tema, setTema] = useLocalStorage('pokedex:tema', 'claro');
  const [som, setSom] = useLocalStorage('pokedex:som', true);
  const [favLista, setFavLista] = useLocalStorage('pokedex:favoritos', []);
  const favoritos = useMemo(() => new Set(favLista), [favLista]);
  const bip = useSom(som);

  const [fase, setFase] = useState('fechada');
  const [modo, setModo] = useState('pokedex');
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState(null);
  const [ordem, setOrdem] = useState(ORDEM_PADRAO);
  const [selId, setSelId] = useState(null);
  const [vs, setVs] = useState([]);
  const [buscaTr, setBuscaTr] = useState('');
  const [ordemTr, setOrdemTr] = useState('badges');
  const [trId, setTrId] = useState(null);
  const [painel, setPainel] = useState(null);
  const [abaMobile, setAbaMobile] = useState(false);
  const [pulso, setPulso] = useState(false);
  const [pisca, setPisca] = useState(false);
  const [dpad, setDpad] = useState(null);
  const buscaRef = useRef(null);
  const timers = useRef(new Map());

  const depois = (chave, ms, fn) => {
    clearTimeout(timers.current.get(chave));
    timers.current.set(chave, setTimeout(fn, ms));
  };

  useEffect(() => {
    const mapa = timers.current;
    return () => mapa.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
  }, [tema]);

  useEffect(() => {
    if (layout !== 'mobile') setAbaMobile(false);
  }, [layout]);

  const lista = useMemo(
    () => ordenar(filtrar(pokemons, { busca, tipo, ids: modo === 'favoritos' ? favoritos : null }), ordem),
    [busca, tipo, ordem, modo, favoritos],
  );

  const listaTr = useMemo(() => {
    const q = buscaTr.trim().toLowerCase();
    const achados = treinadores.filter((t) => !q || t.name.toLowerCase().includes(q) || t.equipe.some(({ p }) => p.name.toLowerCase().includes(q)));
    if (ordemTr === 'badges') return [...achados].sort((a, b) => b.badges - a.badges || a.id - b.id);
    if (ordemTr === 'name') return [...achados].sort((a, b) => a.name.localeCompare(b.name));
    return achados;
  }, [buscaTr, ordemTr]);

  const selecionado = selId == null ? null : lista.find((p) => p.id === selId) ?? null;
  const treinador = listaTr.find((t) => t.id === trId) ?? (layout === 'mobile' ? null : listaTr[0] ?? null);
  const [a, b] = [porId.get(vs[0]) ?? null, porId.get(vs[1]) ?? null];
  const filtrando = Boolean(busca.trim() || tipo);

  /* ---------- ações ---------- */
  const piscar = () => {
    setPisca(true);
    depois('pisca', 230, () => setPisca(false));
  };

  const abrir = () => {
    bip('liga');
    if (reduzido) {
      setFase('aberta');
      return;
    }
    setFase('abrindo');
    depois('abertura', 1800, () => setFase('aberta'));
  };

  const alternarVs = (id) => {
    const novo = vs.includes(id) ? vs.filter((x) => x !== id) : vs.length < 2 ? [...vs, id] : [vs[0], id];
    setVs(novo);
    bip(novo.length > vs.length ? 'ok' : 'tecla');
    if (novo.length === 2 && layout === 'mobile') setAbaMobile(true);
  };

  const escolherPokemon = (id) => {
    setSelId(id);
    setPainel(null);
    if (modo === 'comparar') {
      alternarVs(id);
      return;
    }
    bip('tecla');
    piscar();
    if (layout === 'mobile') setAbaMobile(true);
  };

  const verPokemon = (id) => {
    const p = porId.get(id);
    const visivelNoFiltro = filtrar([p], { busca, tipo }).length > 0;
    if (!visivelNoFiltro) {
      setBusca('');
      setTipo(null);
    }
    if (modo !== 'pokedex' && !(modo === 'favoritos' && favoritos.has(id))) setModo('pokedex');
    setSelId(id);
    setPainel(null);
    bip('tecla');
    if (layout === 'mobile') setAbaMobile(true);
  };

  const verTreinador = (id) => {
    setModo('treinadores');
    setBuscaTr('');
    setTrId(id);
    setAbaMobile(false);
    bip('tecla');
  };

  const mover = (d) => {
    const passo = { up: -1, down: 1, left: -PAGINA[layout], right: PAGINA[layout] }[d];
    if (modo === 'treinadores') {
      if (!listaTr.length) return;
      const i = listaTr.findIndex((t) => t.id === treinador?.id);
      const ni = i < 0 ? (passo < 0 ? listaTr.length - 1 : 0) : limitar(i + passo, 0, listaTr.length - 1);
      setTrId(listaTr[ni].id);
    } else {
      if (!lista.length) {
        bip('erro');
        return;
      }
      const i = lista.findIndex((p) => p.id === selId);
      const ni = i < 0 ? (passo < 0 ? lista.length - 1 : 0) : limitar(i + passo, 0, lista.length - 1);
      setSelId(lista[ni].id);
    }
    bip('nav');
    piscar();
  };

  const moverPeloTeclado = (d) => {
    setDpad(d);
    depois('dpad', 140, () => setDpad(null));
    mover(d);
  };

  const irModo = (novo) => {
    setPainel(null);
    if (novo === 'comparar' && vs.length === 0 && selecionado) setVs([selecionado.id]);
    setModo(novo);
    setAbaMobile(layout === 'mobile' && novo === 'comparar' && vs.length === 2);
    bip('tecla');
  };

  const aleatorio = () => {
    const base = lista.length && modo !== 'treinadores' ? lista : pokemons;
    if (base === pokemons && modo !== 'treinadores') {
      setBusca('');
      setTipo(null);
    }
    const opcoes = base.length > 1 ? base.filter((p) => p.id !== selId) : base;
    const p = opcoes[Math.floor(Math.random() * opcoes.length)];
    setPulso(true);
    depois('pulso', 900, () => setPulso(false));
    bip('sorteio');
    piscar();
    setPainel(null);
    setSelId(p.id);
    if (modo === 'comparar') {
      alternarVs(p.id);
      return;
    }
    if (modo === 'treinadores' || (modo === 'favoritos' && !favoritos.has(p.id))) setModo('pokedex');
    if (layout === 'mobile') setAbaMobile(true);
  };

  const marcar = () => {
    if (!selecionado) {
      bip('erro');
      return;
    }
    const id = selecionado.id;
    setFavLista((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id].sort((x, y) => x - y)));
    bip('ok');
  };

  const adicionarVs = () => {
    if (!selecionado) {
      bip('erro');
      return;
    }
    if (modo !== 'comparar') setModo('comparar');
    if (!vs.includes(selecionado.id)) alternarVs(selecionado.id);
  };

  const limpar = () => {
    setPainel(null);
    if (modo === 'comparar') setVs([]);
    else if (modo === 'treinadores') {
      setBuscaTr('');
      setTrId(null);
    } else {
      setBusca('');
      setTipo(null);
      setOrdem(ORDEM_PADRAO);
      setSelId(null);
    }
    bip('tecla');
  };

  const focarBusca = () => {
    setPainel(null);
    setAbaMobile(false);
    bip('tecla');
    requestAnimationFrame(() => buscaRef.current?.focus());
  };

  const alternarPainel = (qual) => {
    if (modo === 'treinadores') setModo('pokedex');
    setAbaMobile(false);
    setPainel((p) => (p === qual ? null : qual));
    bip('tecla');
  };

  const ordenarPor = (campo) => {
    setOrdem((o) => (o.campo === campo ? { campo, desc: !o.desc } : { campo, desc: !['id', 'name'].includes(campo) }));
    bip('tecla');
  };

  const escolherOrdem = (o) => {
    setOrdem(o.campo !== ordem.campo ? { campo: o.campo, desc: !['id', 'name'].includes(o.campo) } : o);
    bip('tecla');
  };

  const escolherTipo = (t) => {
    setTipo(t);
    bip('tecla');
  };

  const tecla = (id) => {
    const acoes = {
      pokedex: () => irModo('pokedex'),
      treinadores: () => irModo('treinadores'),
      comparar: () => irModo('comparar'),
      favoritos: () => irModo('favoritos'),
      aleatorio,
      ant: () => mover('up'),
      prox: () => mover('down'),
      marcar,
      vs: adicionarVs,
      limpar,
    };
    acoes[id]();
  };

  const escapar = () => {
    if (painel) setPainel(null);
    else if (document.activeElement === buscaRef.current) buscaRef.current.blur();
    else if (abaMobile) setAbaMobile(false);
    else if (modo === 'treinadores') setTrId(null);
    else setSelId(null);
  };

  const confirmar = () => {
    if (document.activeElement === buscaRef.current) {
      buscaRef.current.blur();
      if (modo === 'treinadores') {
        if (listaTr[0]) setTrId(listaTr[0].id);
      } else if (lista[0] && !selecionado) escolherPokemon(lista[0].id);
      return;
    }
    if (modo === 'comparar' && selecionado) alternarVs(selecionado.id);
    else if (layout === 'mobile' && selecionado) setAbaMobile(true);
  };

  useTeclado(
    {
      ArrowUp: () => moverPeloTeclado('up'),
      ArrowDown: () => moverPeloTeclado('down'),
      ArrowLeft: () => moverPeloTeclado('left'),
      ArrowRight: () => moverPeloTeclado('right'),
      '/': focarBusca,
      r: aleatorio,
      f: marcar,
      c: adicionarVs,
      t: () => setTema((x) => (x === 'claro' ? 'escuro' : 'claro')),
      m: () => setSom((x) => !x),
      Escape: escapar,
      Enter: confirmar,
    },
    fase !== 'fechada',
  );

  /* ---------- conteúdo do LCD ---------- */
  let lcd;
  if (modo === 'treinadores') {
    lcd = (
      <>
        <Status esq="TREINADORES" dir={String(listaTr.length)} />
        <div className="lcd-toolbar">
          <CampoBusca valor={buscaTr} onChange={setBuscaTr} rotulo="BUSCAR TREINADOR..." inputRef={buscaRef} />
          <BotaoOrdem texto={v === 'mob' ? ORDEM_TR[ordemTr].slice(0, 5) : ORDEM_TR[ordemTr]} onClick={() => setOrdemTr((o) => PROXIMA_ORDEM_TR[o])} />
        </div>
        {v !== 'mob' && listaTr.length > 0 && (
          <div className="list-head" style={{ gridTemplateColumns: TCOLS[v] }}>
            <span />
            <span>NOME</span>
            <span>INSÍGNIAS</span>
            <span>EQUIPE</span>
          </div>
        )}
        {listaTr.length ? (
          <Rolagem alvo={treinador?.id} rotulo="Treinadores" reinicio={`${buscaTr}|${ordemTr}`}>
            {listaTr.map((t) =>
              v === 'mob' ? (
                <CardTreinador
                  key={t.id}
                  t={t}
                  aberto={treinador?.id === t.id}
                  onAbrir={() => {
                    setTrId(treinador?.id === t.id ? null : t.id);
                    bip('tecla');
                  }}
                  onPokemon={verPokemon}
                />
              ) : (
                <LinhaTreinador
                  key={t.id}
                  t={t}
                  cols={TCOLS[v]}
                  sel={treinador?.id === t.id}
                  onClick={() => {
                    setTrId(t.id);
                    bip('tecla');
                  }}
                />
              ),
            )}
          </Rolagem>
        ) : (
          <Vazio titulo="NENHUM TREINADOR" texto={`Nada para "${buscaTr}".`} acao="LIMPAR BUSCA" onAcao={() => setBuscaTr('')} />
        )}
      </>
    );
  } else {
    const semFavoritos = modo === 'favoritos' && favoritos.size === 0;
    lcd = (
      <>
        <Status esq={NOME_MODO[modo]} dir={modo === 'comparar' ? `A × B · ${vs.length}/2` : `${lista.length}/${modo === 'favoritos' ? favoritos.size : TOTAL_POKEMON}`} />
        <div className={`lcd-toolbar${v === 'mob' ? ' wrap' : ''}`}>
          <CampoBusca valor={busca} onChange={setBusca} rotulo="BUSCAR NOME OU Nº..." inputRef={buscaRef} />
          {v === 'mob' && <span style={{ width: '100%', height: 0 }} />}
          <BotaoTipo tipo={tipo} aberto={painel === 'tipos'} onClick={() => alternarPainel('tipos')} />
          <BotaoOrdem texto={rotuloOrdem(ordem)} aberto={painel === 'ordem'} onClick={() => alternarPainel('ordem')} />
        </div>
        {v !== 'mob' && lista.length > 0 && <CabecalhoLista v={COLS[v]} ordem={ordem} onOrdenar={ordenarPor} />}
        {lista.length ? (
          <Rolagem alvo={selId} rotulo="Pokémon" reinicio={`${modo}|${busca}|${tipo}|${ordem.campo}|${ordem.desc}`}>
            {lista.map((p) => {
              const props = {
                p,
                sel: p.id === selId,
                fav: favoritos.has(p.id),
                tag: vs[0] === p.id ? 'A' : vs[1] === p.id ? 'B' : '',
                marcada: modo === 'comparar' && vs.includes(p.id),
                onClick: () => escolherPokemon(p.id),
              };
              return v === 'mob' ? <CardPokemon key={p.id} {...props} /> : <LinhaPokemon key={p.id} {...props} v={COLS[v]} />;
            })}
          </Rolagem>
        ) : semFavoritos ? (
          <Vazio titulo="NENHUM FAVORITO" texto="Escolha um Pokémon e aperte MARCAR (ou a tecla F)." />
        ) : (
          <Vazio
            titulo={
              <>
                NENHUM POKÉMON
                <br />
                ENCONTRADO
              </>
            }
            texto={`Nada para "${busca.trim() || up(tipo ?? '')}". Tente outro nome ou número.`}
            acao="LIMPAR BUSCA"
            onAcao={() => {
              setBusca('');
              setTipo(null);
            }}
          />
        )}
        {painel === 'tipos' && <PainelTipos v={v} tipo={tipo} onEscolher={escolherTipo} onFechar={() => setPainel(null)} />}
        {painel === 'ordem' && <PainelOrdem v={v} ordem={ordem} onOrdem={escolherOrdem} onFechar={() => setPainel(null)} />}
      </>
    );
  }

  /* ---------- tela da tampa ---------- */
  const descricaoFiltro = [busca.trim() && `BUSCA "${busca.trim().toUpperCase()}"`, tipo && `TIPO ${up(tipo)}`].filter(Boolean).join(' · ');
  let s2;
  if (modo === 'treinadores') {
    s2 = treinador ? <TelaTreinador t={treinador} v={v} onPokemon={verPokemon} /> : <TelaSemSinal texto="Escolha um treinador na lista." />;
  } else if (modo === 'comparar') {
    s2 = a && b ? <TelaComparar a={a} b={b} v={v} /> : <TelaEscolha a={a} b={b} onRemover={alternarVs} />;
  } else if (selecionado) {
    s2 = (
      <TelaDetalhes
        p={selecionado}
        v={v}
        fav={favoritos.has(selecionado.id)}
        onFav={marcar}
        onTreinador={verTreinador}
      />
    );
  } else if (!lista.length) {
    s2 = <TelaSemSinal texto={modo === 'favoritos' && !favoritos.size ? 'Você ainda não marcou favoritos.' : 'Nenhum Pokémon para mostrar. Ajuste a busca ou os filtros.'} />;
  } else {
    s2 = (
      <TelaResumo
        lista={lista}
        v={v}
        titulo={modo === 'favoritos' ? 'SEUS FAVORITOS' : filtrando ? 'RESULTADO DA BUSCA' : 'RESUMO DA POKÉDEX'}
        info={filtrando ? `${descricaoFiltro} · ${lista.length} DE ${TOTAL_POKEMON}` : modo === 'favoritos' ? plural(lista.length, 'FAVORITO', 'FAVORITOS') : undefined}
        onPokemon={verPokemon}
      />
    );
  }

  /* ---------- displays ---------- */
  const mob = layout === 'mobile';
  let gd;
  let mini;
  if (modo === 'treinadores') {
    gd = [`${listaTr.length} TREINAD.`, treinador ? (mob ? `${up(treinador.name)} ABERTO` : `${up(treinador.name)} · ${treinador.badges} INSÍG.`) : mob ? 'TOQUE UM CARD' : '---'];
    mini = treinador ? [['EQUIPE', `${treinador.pokemonIds.length} POKÉMON`], ['TOTAL', milhar(treinador.soma)]] : [['EQUIPE', '---'], ['TOTAL', '---']];
  } else if (modo === 'comparar') {
    gd = [`A: ${a ? up(a.name) : '---'}`, `B: ${b ? up(b.name) : '---'}`];
    mini = [['A · TOTAL', a ? String(total(a)) : '---'], ['B · TOTAL', b ? String(total(b)) : '---']];
  } else {
    const contagem = filtrando
      ? mob ? `${lista.length} DE 151` : plural(lista.length, 'ENCONTRADO', 'ENCONTRADOS')
      : modo === 'favoritos' ? plural(lista.length, 'FAVORITO', 'FAVORITOS') : `${lista.length} POKÉMON`;
    const linha2 = selecionado ? (mob ? up(selecionado.name) : `Nº ${pad3(selecionado.id)} ${up(selecionado.name)}`) : filtrando ? descricaoFiltro.replace('BUSCA ', '') : mob ? 'CRUZ ↑↓' : 'USE A CRUZ ↑↓';
    gd = [contagem, linha2];
    if (mob && selecionado) mini = [['TOTAL', String(total(selecionado))], ['FAVORITO', favoritos.has(selecionado.id) ? 'SIM' : 'NÃO']];
    else if (selecionado) mini = [['Nº', `${pad3(selecionado.id)} / 151`], ['TOTAL', String(total(selecionado))]];
    else mini = [['FAVORITOS', String(favoritos.size)], ['ORDEM', rotuloOrdem(ordem)]];
  }
  const numMobile = modo === 'comparar' ? (a && b ? `${pad3(a.id)} × ${pad3(b.id)}` : '---') : selecionado ? `${pad3(selecionado.id)} / 151` : '---';

  const ap = {
    fase,
    onAbrir: abrir,
    lcd,
    s2,
    gd,
    mini,
    modo,
    dpad,
    pulso,
    pisca,
    abaMobile,
    numMobile,
    ctl: {
      tecla,
      mover,
      focarBusca,
      abrirTipos: () => alternarPainel('tipos'),
      voltar: () => {
        setAbaMobile(false);
        bip('tecla');
      },
      tema,
      setTema: (t) => {
        setTema(t);
        bip('tecla');
      },
      som,
      setSom,
    },
  };

  const P = PALCOS[layout];
  return (
    <main className="palco-moldura" style={{ width: P.w * escala, height: P.h * escala }}>
      {layout !== 'desktop' && <h1 className="sr-only">Pokédex de Kanto</h1>}
      <div className={`palco ${v} ${fase}`} style={{ width: P.w, height: P.h, transform: `scale(${escala})` }}>
        {layout === 'desktop' && <CabecalhoApp />}
        {layout === 'desktop' && <AparelhoDesktop ap={ap} />}
        {layout === 'tablet' && <AparelhoTablet ap={ap} />}
        {layout === 'mobile' && <AparelhoMobile ap={ap} />}
      </div>
    </main>
  );
}
