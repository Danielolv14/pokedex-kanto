import Icone from '../comum/Icone';

export function TelaSemSinal({ titulo = 'SEM SINAL', texto }) {
  return (
    <div className="signal">
      <Icone nome="ball" tamanho={40} />
      <b>{titulo}</b>
      <span>{texto}</span>
    </div>
  );
}
