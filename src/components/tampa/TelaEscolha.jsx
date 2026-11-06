import Icone from '../comum/Icone';
import { Sprite } from '../comum/Sprite';
import { Cabeca } from './CabecaTela';
import { up } from '../../data/dados';

export function TelaEscolha({ a, b, onRemover }) {
  const slot = (p, letra) => (
    <div className={`slot${p ? ' cheio' : ''}`}>
      <b>{letra}</b>
      {p ? (
        <>
          <Sprite id={p.id} tamanho={56} />
          <span>{up(p.name)}</span>
          <button type="button" onClick={() => onRemover(p.id)}>
            REMOVER
          </button>
        </>
      ) : (
        <span>VAZIO</span>
      )}
    </div>
  );
  return (
    <>
      <Cabeca nome="COMPARAR" />
      <div className="slot-grid">
        {slot(a, 'A')}
        {slot(b, 'B')}
      </div>
      <div className="hint">
        <Icone nome="plus" tamanho={8} />
        ESCOLHA DOIS POKÉMON NA LISTA (CLIQUE OU + VS)
      </div>
    </>
  );
}
