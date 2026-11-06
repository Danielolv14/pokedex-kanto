import { useEffect, useMemo, useRef, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import useMovimentoReduzido from './useMovimentoReduzido';
import useSom from './useSom';
import { filtrar, ordenar, porId, pokemons, treinadores } from '../data/dados';

const PAGINA = { desktop: 6, tablet: 6, mobile: 4 };
export const ORDEM_PADRAO = { campo: 'id', desc: false };
const PROXIMA_ORDEM_TR = { badges: 'name', name: 'id', id: 'badges' };
const STATS_DECRESCENTES = (campo) => !['id', 'name'].includes(campo);

const limitar = (v, min, max) => Math.max(min, Math.min(max, v));

// Estado da Pokédex e tudo o que os botões, a lista e o teclado podem fazer.
export default function usePokedex(layout) {
  const mobile = layout === 'mobile';
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
    if (!mobile) setAbaMobile(false);
  }, [mobile]);

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
  const treinador = listaTr.find((t) => t.id === trId) ?? (mobile ? null : listaTr[0] ?? null);
  const comparados = [porId.get(vs[0]) ?? null, porId.get(vs[1]) ?? null];
  const filtrando = Boolean(busca.trim() || tipo);

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
    if (novo.length === 2 && mobile) setAbaMobile(true);
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
    if (mobile) setAbaMobile(true);
  };

  const verPokemon = (id) => {
    if (!filtrar([porId.get(id)], { busca, tipo }).length) {
      setBusca('');
      setTipo(null);
    }
    if (modo !== 'pokedex' && !(modo === 'favoritos' && favoritos.has(id))) setModo('pokedex');
    setSelId(id);
    setPainel(null);
    bip('tecla');
    if (mobile) setAbaMobile(true);
  };

  const verTreinador = (id) => {
    setModo('treinadores');
    setBuscaTr('');
    setTrId(id);
    setAbaMobile(false);
    bip('tecla');
  };

  const escolherTreinador = (id) => {
    setTrId(mobile && treinador?.id === id ? null : id);
    bip('tecla');
  };

  const mover = (d) => {
    const passo = { up: -1, down: 1, left: -PAGINA[layout], right: PAGINA[layout] }[d];
    const itens = modo === 'treinadores' ? listaTr : lista;
    if (!itens.length) {
      bip('erro');
      return;
    }
    const atual = modo === 'treinadores' ? treinador?.id : selId;
    const i = itens.findIndex((x) => x.id === atual);
    const ni = i < 0 ? (passo < 0 ? itens.length - 1 : 0) : limitar(i + passo, 0, itens.length - 1);
    if (modo === 'treinadores') setTrId(itens[ni].id);
    else setSelId(itens[ni].id);
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
    setAbaMobile(mobile && novo === 'comparar' && vs.length === 2);
    bip('tecla');
  };

  const aleatorio = () => {
    const usarTodos = !lista.length || modo === 'treinadores';
    if (usarTodos) {
      setBusca('');
      setTipo(null);
    }
    const base = usarTodos ? pokemons : lista;
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
    if (mobile) setAbaMobile(true);
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

  const limparFiltros = () => {
    setBusca('');
    setTipo(null);
  };

  const limpar = () => {
    setPainel(null);
    if (modo === 'comparar') setVs([]);
    else if (modo === 'treinadores') {
      setBuscaTr('');
      setTrId(null);
    } else {
      limparFiltros();
      setOrdem(ORDEM_PADRAO);
      setSelId(null);
    }
    bip('tecla');
  };

  const focarBusca = () => {
    setPainel(null);
    setAbaMobile(false);
    bip('tecla');
    if (abaMobile) requestAnimationFrame(() => buscaRef.current?.focus());
    else buscaRef.current?.focus();
  };

  const alternarPainel = (qual) => {
    if (modo === 'treinadores') setModo('pokedex');
    setAbaMobile(false);
    setPainel((p) => (p === qual ? null : qual));
    bip('tecla');
  };

  const ordenarPor = (campo) => {
    setOrdem((o) => (o.campo === campo ? { campo, desc: !o.desc } : { campo, desc: STATS_DECRESCENTES(campo) }));
    bip('tecla');
  };

  const escolherOrdem = (o) => {
    setOrdem(o.campo !== ordem.campo ? { campo: o.campo, desc: STATS_DECRESCENTES(o.campo) } : o);
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
    else if (mobile && selecionado) setAbaMobile(true);
  };

  const atalhos = {
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
  };

  return {
    fase, modo, busca, tipo, ordem, selId, vs, buscaTr, ordemTr, painel, abaMobile, pulso, pisca, dpad, tema, som,
    favoritos, lista, listaTr, selecionado, treinador, comparados, filtrando, buscaRef, atalhos,
    acoes: {
      abrir, tecla, mover, focarBusca, alternarPainel, escolherPokemon, verPokemon, verTreinador, escolherTreinador,
      alternarVs, marcar, ordenarPor, escolherOrdem, escolherTipo, limparFiltros,
      setBusca, setBuscaTr,
      ciclarOrdemTr: () => setOrdemTr((o) => PROXIMA_ORDEM_TR[o]),
      fecharPainel: () => setPainel(null),
      voltar: () => {
        setAbaMobile(false);
        bip('tecla');
      },
      setTema: (t) => {
        setTema(t);
        bip('tecla');
      },
      setSom,
    },
  };
}
