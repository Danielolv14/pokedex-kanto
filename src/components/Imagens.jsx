import { useRef, useState } from 'react';
import usePokeApi from '../hooks/usePokeApi';
import useVisivel from '../hooks/useVisivel';
import useMovimentoReduzido from '../hooks/useMovimentoReduzido';
import { CORES_TIPO, tinta, up } from '../data/dados';
import animacoes from '../data/animacoes.json';
import semImagem from '../assets/images/sem-imagem.svg';

const COM_VIDEO = new Set(animacoes);

export function Chip({ tipo, grande }) {
  const cor = CORES_TIPO[tipo.name];
  return (
    <span className={`chip${grande ? ' lg' : ''}`} style={{ background: cor, color: tinta(cor) }}>
      {up(tipo.name)}
    </span>
  );
}

// Sprite da lista: só busca na PokéAPI quando aparece na tela.
export function Sprite({ id, tamanho }) {
  const ref = useRef(null);
  const visivel = useVisivel(ref);
  const { imagens, carregando } = usePokeApi(id, visivel);
  const [quebrada, setQuebrada] = useState(null);
  const src = imagens?.sprite;
  const z = Math.round(tamanho * 1.5);
  const m = Math.round((z - tamanho) / 2);
  return (
    <span ref={ref} className="spr" style={{ width: tamanho, height: tamanho }}>
      {src && quebrada !== src ? (
        <img src={src} width={z} height={z} alt="" style={{ margin: -m }} onError={() => setQuebrada(src)} />
      ) : (
        <img src={semImagem} width={Math.round(tamanho * 0.8)} height={Math.round(tamanho * 0.8)} alt="" className={`spr-ph${carregando ? ' carregando' : ''}`} />
      )}
    </span>
  );
}

// Arte dos detalhes: vídeo próprio → GIF do Showdown → arte oficial → imagem reserva.
export function ArtePokemon({ p, tamanho, animar = true, etiqueta = false }) {
  const reduzido = useMovimentoReduzido();
  const { imagens, carregando } = usePokeApi(p.id);
  const [falhas, setFalhas] = useState({ id: p.id });
  const [gif, setGif] = useState({ id: null, s: 0 });
  const erros = falhas.id === p.id ? falhas : { id: p.id };
  const falhar = (qual) => setFalhas({ ...erros, [qual]: true });
  const mover = animar && !reduzido;

  let midia;
  let animada = false;
  if (mover && COM_VIDEO.has(p.id) && !erros.video) {
    animada = true;
    midia = (
      <video
        key={`v${p.id}`}
        src={`${import.meta.env.BASE_URL}animations/${p.id}.webm`}
        width={tamanho}
        height={tamanho}
        poster={imagens?.arte ?? undefined}
        autoPlay
        loop
        muted
        playsInline
        aria-label={`Animação de ${p.name}`}
        onError={() => falhar('video')}
      />
    );
  } else if (mover && imagens?.animado && !erros.gif) {
    animada = true;
    const s = gif.id === p.id ? gif.s : 0;
    midia = (
      <img
        key={`g${p.id}`}
        className="arte-gif"
        src={imagens.animado}
        alt={p.name}
        style={{ transform: `scale(${s})`, opacity: s ? 1 : 0 }}
        onLoad={(e) => {
          const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
          setGif({ id: p.id, s: Math.min(3, (tamanho * 0.86) / w, (tamanho * 0.86) / h) });
        }}
        onError={() => falhar('gif')}
      />
    );
  } else if (imagens?.arte && !erros.arte) {
    midia = <img key={`a${p.id}`} src={imagens.arte} width={tamanho} height={tamanho} alt={p.name} onError={() => falhar('arte')} />;
  } else {
    midia = (
      <img
        src={semImagem}
        width={Math.round(tamanho * 0.6)}
        height={Math.round(tamanho * 0.6)}
        alt={carregando ? '' : `${p.name} (imagem indisponível)`}
        className={`arte-ph${carregando ? ' carregando' : ''}`}
      />
    );
  }

  return (
    <>
      {etiqueta && (
        <span className="art-tag">
          <i className={animada ? '' : 'parado'} />
          {animada ? 'ANIM' : 'ARTE'}
        </span>
      )}
      {midia}
    </>
  );
}
