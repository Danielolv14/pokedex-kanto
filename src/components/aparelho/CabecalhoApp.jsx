import { Pokebola } from '../comum/Icone';

export function CabecalhoApp() {
  return (
    <header className="app-header" style={{ left: 0, top: 6, width: 1240, height: 44 }}>
      <div className="brand">
        <Pokebola tamanho={32} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h1 className="brand-name">POKÉDEX</h1>
          <span className="brand-sub">KANTO · 151 POKÉMON · 12 TREINADORES</span>
        </div>
      </div>
      <div className="kbd-hint" aria-label="Atalhos do teclado">
        <kbd>↑</kbd>
        <kbd>↓</kbd>navegar<kbd>←</kbd>
        <kbd>→</kbd>página<kbd>/</kbd>buscar<kbd>R</kbd>aleatório
      </div>
    </header>
  );
}
