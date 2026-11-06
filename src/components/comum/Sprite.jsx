import { useRef, useState } from 'react';
import usePokeApi from '../../hooks/usePokeApi';
import useVisivel from '../../hooks/useVisivel';
import semImagem from '../../assets/images/sem-imagem.svg';

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
