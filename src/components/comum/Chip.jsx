import { CORES_TIPO, tinta, up } from '../../data/dados';

export function Chip({ tipo, grande }) {
  const cor = CORES_TIPO[tipo.name];
  return (
    <span className={`chip${grande ? ' lg' : ''}`} style={{ background: cor, color: tinta(cor) }}>
      {up(tipo.name)}
    </span>
  );
}
