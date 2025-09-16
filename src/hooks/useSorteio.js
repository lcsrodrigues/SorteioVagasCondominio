import { useState } from 'react';

export const useSorteio = () => {
  const [apartamentos, setApartamentos] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [sorteioRealizado, setSorteioRealizado] = useState(false);

  const carregarApartamentos = (dados) => {
    const apartamentosProcessados = dados.map((item, index) => ({
      id: index + 1,
      numero: item.Apartamento
    }));
    setApartamentos(apartamentosProcessados);
    return apartamentosProcessados;
  };

  const carregarVagas = (dados) => {
    const vagasProcessadas = dados.map((item, index) => {
      const preConfigurada = item['Pré-Selecionada'] === 'SIM';
      let apartamentoAssociado = null;
      
      if (preConfigurada && item['Apartamentos Elegíveis']) {
        apartamentoAssociado = parseInt(item['Apartamentos Elegíveis']);
      }

      return {
        id: index + 1,
        numero: item['Número da Vaga'],
        localizacao: item['Localização'],
        tipo: item['Tipo de Vaga'],
        preConfigurada,
        apartamentoAssociado
      };
    });
    setVagas(vagasProcessadas);
    return vagasProcessadas;
  };

  const realizarSorteio = () => {
    if (apartamentos.length === 0 || vagas.length === 0) {
      throw new Error('É necessário carregar apartamentos e vagas antes do sorteio');
    }

    // Separar vagas pré-configuradas das livres
    const vagasPreConfiguradas = vagas.filter(vaga => vaga.preConfigurada);
    const vagasLivres = vagas.filter(vaga => !vaga.preConfigurada);

    // Apartamentos já ocupados por vagas pré-configuradas
    const apartamentosOcupados = vagasPreConfiguradas
      .filter(vaga => vaga.apartamentoAssociado)
      .map(vaga => vaga.apartamentoAssociado);

    // Apartamentos disponíveis para sorteio
    const apartamentosDisponiveis = apartamentos
      .filter(apt => !apartamentosOcupados.includes(apt.numero))
      .map(apt => apt.numero);

    // Embaralhar apartamentos disponíveis
    const apartamentosEmbaralhados = [...apartamentosDisponiveis].sort(() => Math.random() - 0.5);

    // Criar resultados
    const novosResultados = [];

    // Adicionar vagas pré-configuradas
    vagasPreConfiguradas.forEach(vaga => {
      novosResultados.push({
        vagaNumero: vaga.numero,
        vagaLocalizacao: vaga.localizacao,
        vagaTipo: vaga.tipo,
        apartamentoNumero: vaga.apartamentoAssociado,
        preConfigurada: true
      });
    });

    // Sortear vagas livres
    const vagasParaSortear = Math.min(vagasLivres.length, apartamentosEmbaralhados.length);
    
    for (let i = 0; i < vagasParaSortear; i++) {
      const vaga = vagasLivres[i];
      novosResultados.push({
        vagaNumero: vaga.numero,
        vagaLocalizacao: vaga.localizacao,
        vagaTipo: vaga.tipo,
        apartamentoNumero: apartamentosEmbaralhados[i],
        preConfigurada: false
      });
    }

    // Adicionar vagas não sorteadas (se houver mais vagas que apartamentos)
    for (let i = vagasParaSortear; i < vagasLivres.length; i++) {
      const vaga = vagasLivres[i];
      novosResultados.push({
        vagaNumero: vaga.numero,
        vagaLocalizacao: vaga.localizacao,
        vagaTipo: vaga.tipo,
        apartamentoNumero: null,
        preConfigurada: false
      });
    }

    // Ordenar por número da vaga
    novosResultados.sort((a, b) => a.vagaNumero - b.vagaNumero);

    setResultados(novosResultados);
    setSorteioRealizado(true);

    return {
      totalVagas: vagas.length,
      vagasSorteadas: novosResultados.filter(r => r.apartamentoNumero !== null).length,
      vagasDisponiveis: novosResultados.filter(r => r.apartamentoNumero === null).length
    };
  };

  const resetarSorteio = () => {
    setResultados([]);
    setSorteioRealizado(false);
  };

  const exportarResultados = () => {
    if (resultados.length === 0) {
      throw new Error('Nenhum resultado para exportar');
    }

    const dadosExport = resultados.map(resultado => ({
      'Número da Vaga': resultado.vagaNumero,
      'Localização': resultado.vagaLocalizacao,
      'Tipo': resultado.vagaTipo,
      'Apartamento': resultado.apartamentoNumero || 'Não sorteada',

    }));

    return dadosExport;
  };

  const getEstatisticas = () => {
    const totalVagas = vagas.length;
    const vagasSorteadas = resultados.filter(r => r.apartamentoNumero !== null).length;
    const vagasDisponiveis = resultados.filter(r => r.apartamentoNumero === null).length;
    const vagasPreConfiguradas = resultados.filter(r => r.preConfigurada).length;

    return {
      totalVagas,
      vagasSorteadas,
      vagasDisponiveis,
      vagasPreConfiguradas,
      totalApartamentos: apartamentos.length
    };
  };

  return {
    apartamentos,
    vagas,
    resultados,
    sorteioRealizado,
    carregarApartamentos,
    carregarVagas,
    realizarSorteio,
    resetarSorteio,
    exportarResultados,
    getEstatisticas
  };
};

