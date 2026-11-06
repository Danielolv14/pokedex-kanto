import { useEffect, useReducer } from 'react';

// Imagens vindas da PokéAPI, com cache em memória e no localStorage.
const API = 'https://pokeapi.co/api/v2/pokemon/';
const CHAVE = 'pokedex:imagens:v1';

const memoria = new Map();
const falhas = new Set();
const pendentes = new Map();

try {
  Object.entries(JSON.parse(localStorage.getItem(CHAVE) || '{}')).forEach(([id, v]) => memoria.set(Number(id), v));
} catch {
  localStorage.removeItem(CHAVE);
}

let gravacao = null;
function gravarDepois() {
  clearTimeout(gravacao);
  gravacao = setTimeout(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(Object.fromEntries(memoria)));
    } catch {
      /* sem espaço: o cache continua só em memória */
    }
  }, 400);
}

function buscar(id) {
  if (!pendentes.has(id)) {
    const promessa = fetch(API + id)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(({ sprites }) => {
        const imagens = {
          sprite: sprites.front_default,
          arte: sprites.other?.['official-artwork']?.front_default ?? null,
          animado: sprites.other?.showdown?.front_default ?? null,
        };
        memoria.set(id, imagens);
        gravarDepois();
        return imagens;
      })
      .catch(() => {
        falhas.add(id);
      })
      .finally(() => pendentes.delete(id));
    pendentes.set(id, promessa);
  }
  return pendentes.get(id);
}

export default function usePokeApi(id, ativo = true) {
  const [, atualizar] = useReducer((n) => n + 1, 0);
  const imagens = memoria.get(id) ?? null;
  const falhou = falhas.has(id);

  useEffect(() => {
    if (!ativo || imagens || falhou) return undefined;
    let vivo = true;
    buscar(id).then(() => vivo && atualizar());
    return () => {
      vivo = false;
    };
  }, [id, ativo, imagens, falhou]);

  return { imagens, falhou, carregando: ativo && !imagens && !falhou };
}
