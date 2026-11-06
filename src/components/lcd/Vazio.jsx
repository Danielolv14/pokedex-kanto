import Icone from '../comum/Icone';

export function Vazio({ titulo, texto, acao, onAcao }) {
  return (
    <div className="empty">
      <Icone nome="ball" tamanho={48} />
      <b>{titulo}</b>
      <p>{texto}</p>
      {acao && (
        <button type="button" className="lcd-btn on" onClick={onAcao}>
          <Icone nome="eraser" tamanho={12} />
          {acao}
        </button>
      )}
    </div>
  );
}
