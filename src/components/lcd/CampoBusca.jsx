import Icone from '../comum/Icone';

export function CampoBusca({ valor, onChange, rotulo, inputRef, onEnter }) {
  return (
    <label className="search">
      <Icone nome="search" tamanho={14} />
      <span className="sr-only">{rotulo}</span>
      <input
        ref={inputRef}
        type="search"
        value={valor}
        placeholder={rotulo}
        autoComplete="off"
        spellCheck="false"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onEnter?.();
        }}
      />
      {valor && (
        <button type="button" className="clear" aria-label="Limpar busca" onClick={() => onChange('')}>
          <Icone nome="x" tamanho={10} />
        </button>
      )}
    </label>
  );
}
