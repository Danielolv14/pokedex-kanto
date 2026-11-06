import Icone from '../comum/Icone';

export function BarraStatus({ esq, dir }) {
  return (
    <div className="lcd-status">
      <span>
        <Icone nome="play" tamanho={8} />
        {esq}
      </span>
      <span>
        {dir}
        <span className="battery">
          <i />
          <i />
          <i />
        </span>
      </span>
    </div>
  );
}
