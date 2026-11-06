import { useEffect, useState } from 'react';

export default function useLocalStorage(chave, inicial) {
  const [valor, setValor] = useState(() => {
    try {
      const salvo = localStorage.getItem(chave);
      return salvo === null ? inicial : JSON.parse(salvo);
    } catch {
      return inicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
      /* armazenamento cheio ou bloqueado: segue só em memória */
    }
  }, [chave, valor]);

  return [valor, setValor];
}
