import Icone from '../comum/Icone';

export function Cabeca({ num, nome, fav, onFav }) {
  return (
    <div className="s2-head">
      {num && <span className="s2-num">{num}</span>}
      <h2 className="s2-name">{nome}</h2>
      <span className="spacer" />
      {onFav && (
        <button type="button" className={`s2-star${fav ? '' : ' off'}`} aria-pressed={fav} onClick={onFav}>
          <Icone nome={fav ? 'star' : 'starO'} tamanho={10} cor={fav ? '#ffd23f' : 'currentColor'} />
          {fav ? 'FAVORITO' : 'MARCAR'}
        </button>
      )}
    </div>
  );
}
